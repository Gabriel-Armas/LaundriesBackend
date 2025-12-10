const { sequelize, Venta, OrdenServicio, Servicio } = require('../models');
const { Op } = require('sequelize');

//Esta función NO recibe req ni res, recibe datos puros.

const crypto = require('crypto');

function generateUniqueHexCode() {
    const randomBytes = crypto.randomBytes(3);
    const hexCode = randomBytes.toString('hex').toUpperCase();
    
    return hexCode;
}



const createOrderTransaction = async (orderData) => {
    const { 
        idCliente, 
        idSucursal, 
        idEmpleado,  
        anotaciones, 
        items 
    } = orderData;

    const generatedCode = generateUniqueHexCode();
    const t = await sequelize.transaction();

    try {
        //Crear Venta 
        const nuevaVenta = await Venta.create({
            codigo_recogida: generatedCode,
            anotaciones_generales: anotaciones,
            id_cliente: idCliente,
            id_sucursal: idSucursal,
            id_empleado: idEmpleado,
            costo_total: 0, 
        }, { transaction: t });

        let costoTotalCalculado = 0;

        //Procesar Items
        if (items && items.length > 0) {
            for (const item of items) {
                
                //BUSCAMOS EL PRECIO REAL EN LA BD
                const servicioDb = await Servicio.findByPk(item.idServicio, { transaction: t });

                //Validaciones
                if (!servicioDb) {
                    throw new Error(`El servicio con ID ${item.idServicio} no existe.`);
                }

                console.log("Servicio encontrado:", servicioDb.toJSON());
                
                if (!servicioDb.activo) {
                    throw new Error(`El servicio '${servicioDb.nombre}' ya no está activo.`);
                }

                //TOMAMOS EL PRECIO DE LA DB 
                const precioReal = parseFloat(servicioDb.precio_por_kilo);

                //CALCULAMOS SUBTOTAL
                // subtotal = peso * precioReal
                const subtotal = item.pesoKg * precioReal; 
                
                costoTotalCalculado += subtotal;

                //CREAMOS LA ORDEN
                //Guardamos el precio_aplicado como Snapshot del precio en ese momento
                await OrdenServicio.create({
                    id_venta: nuevaVenta.id,
                    id_servicio: item.idServicio,
                    numero_prendas: item.numeroPrendas,
                    peso_kg: item.pesoKg,
                    precio_aplicado: precioReal, //Usamos el real
                    subtotal: subtotal,
                    detalles_prendas: item.detalles,
                    estado: 'RECIBIDO',
                    fecha_entrega_estimada: item.fechaEntrega
                }, { transaction: t });
            }
        }

        // 3. Actualizar Total Venta
        nuevaVenta.costo_total = costoTotalCalculado;
        await nuevaVenta.save({ transaction: t });

        await t.commit();
        return nuevaVenta;

    } catch (error) {
        await t.rollback();
        throw error; 
    }
};

const getActiveSalesByClient = async (idSucursal, idCliente) => {
    //filtro dinámico
    const ventaFilter = {
        id_sucursal: idSucursal, //filtramos por sucursal 
    };

    //Si el empleado seleccionó un cliente específico, agregamos ese filtro
    if (idCliente) {
        ventaFilter.id_cliente = idCliente;
    }

//Hacemos la consulta inteligente
const ventasActivas = await Venta.findAll({
    where: ventaFilter,
    include: [{
    model: OrdenServicio,
    as: 'items',
    required: true, // Esto hace un inner jpin, si no hay items activos, no trae la venta
    where: {
        //Solo nos interesan estos estados
        estado: {
        [Op.in]: ['RECIBIDO', 'LAVANDO', 'LISTO'] 
        }
    }
    }],
    order: [['fecha_recepcion', 'DESC']] //Las mas recientes primero
});

return ventasActivas;
};


//Obtenemos TODAS las ORDENES ASOCIADAS A UNA VENTA
const getSaleDetails = async (idVenta) => {
    const venta = await Venta.findByPk(idVenta, {
        include: [{
        model: OrdenServicio,
        as: 'items',
        //Queremos ver items entregados, cancelados, lavando... todo.
        }]
    });

    if (!venta) {
        throw new Error('Venta no encontrada');
    }

    return venta;
    };


    //const getOrdersAllOrdersBySell or getAllActiveOrdersBySell?  

const updateOrderStatus = async (idOrden, nuevoEstado) => {
    const estadosValidos = ['RECIBIDO', 'LAVANDO', 'LISTO', 'ENTREGADO', 'CANCELADO'];
    
    if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error(`Estado '${nuevoEstado}' no es válido`);
    }

    //Buscamos la orden
    const orden = await OrdenServicio.findByPk(idOrden);
    if (!orden) {
        throw new Error('Orden no encontrada');
    }

    //verificamos si ya está en un estado final para que no deje cambiarlo
    const estadosTerminales = ['ENTREGADO', 'CANCELADO'];
    
    if (estadosTerminales.includes(orden.estado)) {
        throw new Error(`No se puede modificar una orden que ya está ${orden.estado}.`);
    }

    //Actualizamos
    orden.estado = nuevoEstado;
    
    //Si el nuevo estado es ENTREGADO, podría guardar la fecha
    

    await orden.save();
    return orden;
};



//Obtener TODAS las ventas de una sucursal, Historial
const getAllSalesByBranch = async (idSucursal) => {
    const ventas = await Venta.findAll({
        where: {
        id_sucursal: idSucursal
        },
        include: [{
        model: OrdenServicio,
        as: 'items'
        }],
        order: [['fecha_recepcion', 'DESC']] //De la más reciente a la más antigua
    });
    
    return ventas;
};

//Obtener TODAS las órdenes individuales de una sucursal
const getAllOrdersByBranch = async (idSucursal) => {
    //OrdenServicio no tiene columna id_sucursal, tenemos que unirla con Venta y filtrar por la sucursal de la venta.
    
    const ordenes = await OrdenServicio.findAll({
        include: [{
        model: Venta,
        as: 'venta',
        where: { id_sucursal: idSucursal }, //Solo ventas de esta sucursal
        required: true // Inner join necesario
        }],
        order: [['id', 'DESC']]
    });

    return ordenes;
};


const getAllSalesByClient = async (id) => {
    const sales = await Venta.findAll({
        where:{
            id_cliente:id
        },
        include:[{
            model:OrdenServicio,
            as: 'items'
        }],
        order:[['fecha_recepcion','DESC']]
    });

    return sales;

}

const getAllOrdersByClient = async (id) => {
    const orders = await OrdenServicio.findAll({
        include:[{
            model: Venta,
            as: 'venta',
            where:{id_cliente:id},
            required: true,
            attributes:['codigo_recogida','fecha_recepcion']
        }],
        order:[['id','DESC']]
    });

    return orders; 
}


const validarCodigoSucursal = async (idSucursal, codigoIngresado, token) => {
    try {
        
        const url = `http://100.68.70.25:8881/sucursales/${idSucursal}/validar-clave`;

        console.log("--> 1. Intentando conectar a:", url);
        console.log("--> 2. Token enviado:", token ? token.substring(0, 20) + "..." : "SIN TOKEN");

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token 
            },
            body: JSON.stringify({ 
                clave: codigoIngresado 
            })
        });
        
        //para ver el diagnostico
        if (!response.ok) {
            const errorText = await response.text(); //esto lo dice py
            console.error(`error api sucursales. Status: ${response.status}`);
            console.error(`mensaje del backend python: ${errorText}`);
            return false;
        }
        
        const data = await response.json();
        console.log("respuesta api sucursales:", data);
        
        return data.valida; 

    } catch (error) {
        console.error(" Error CRÍTICO de red o conexión:", error.message);
        // Esto pasa si la IP es inalcanzable desde dentro del contenedor
        return false;
    }
};


//cancelamos una orden con la validcion de la sucursa, se supone que ella tendrá un code
const cancelOrder = async (idOrden, idSucursal, codigoAutorizacion, token) => {
    //validamos la orden
    const orden = await OrdenServicio.findByPk(idOrden);
    if (!orden) {
        throw new Error('La orden no existe');
    }

    //validamos el estado actual
    const estadosTerminales = ['ENTREGADO', 'CANCELADO'];
    if (estadosTerminales.includes(orden.estado)) {
        throw new Error(`No se puede cancelar una orden que ya está en estado ${orden.estado}`);
    }

    
    // Pasamos el token a la función de arriba
    const codigoEsValido = await validarCodigoSucursal(idSucursal, codigoAutorizacion, token);
    
    if (!codigoEsValido) {
        throw new Error('Código de autorizacion no valido o usuario no autorizado en esa sucursal');
    }

    // la cancelamos
    orden.estado = 'CANCELADO';
    await orden.save();

    return orden;
};


 //Formato fecha YYYY-MM-DD ,2025-11-30

const getSalesByDate = async (idSucursal, fecha) => {
    //Crear el rango de tiempo para el día completo
    const fechaInicio = new Date(`${fecha}T00:00:00`);
    const fechaFin = new Date(`${fecha}T23:59:59.999`);

    //Buscar ventas
    const ventas = await Venta.findAll({
        where: {
            id_sucursal: idSucursal,
            fecha_recepcion: {
                [Op.between]: [fechaInicio, fechaFin] //Entre X y Y
            }
        },
        /*
        include: [{ //PODEMOS QUITAR EL INCLUDE SI SOLO QUEREMOS LAS VENTAS
            model: OrdenServicio,
            as: 'items' //Incluimos los items para ver qué se vendió, aunque filtremos por venta
        }],*/

        order: [['fecha_recepcion', 'DESC']]
    });

    return ventas;
};
        
    module.exports = {
    createOrderTransaction, //ya
    getActiveSalesByClient, //ya
    updateOrderStatus, //ya
    getSaleDetails, //ya
    getAllSalesByBranch, //ya
    getAllOrdersByBranch,//ya
    getAllSalesByClient,//ya
    getAllOrdersByClient,//ya
    cancelOrder,//ya
    getSalesByDate


};