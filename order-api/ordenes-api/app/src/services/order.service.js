const { sequelize, Venta, OrdenServicio } = require('../models');
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

    //Iniciamos la transacción
    const generatedCode = generateUniqueHexCode()
    const t = await sequelize.transaction();

    try {
    // Creaamos una Venta
    const nuevaVenta = await Venta.create({
        codigo_recogida: generatedCode,
        anotaciones_generales: anotaciones,
        id_cliente: idCliente,
        id_sucursal: idSucursal,
        id_empleado: idEmpleado,
        costo_total: 0, 
    }, { transaction: t });

    let costoTotalCalculado = 0;

    // Creamos Detalles (son las ordenes de forma individual)
    if (items && items.length > 0) {
        for (const item of items) {

            // En un futuro, aquí vamos a llamar a ServiciosAPI para validar el precio real
            const subtotal = item.pesoKg * item.precioAplicado; 
            costoTotalCalculado += subtotal;

            await OrdenServicio.create({
            id_venta: nuevaVenta.id,
            id_servicio: item.idServicio,
            numero_prendas: item.numeroPrendas,
            peso_kg: item.pesoKg,
            precio_aplicado: item.precioAplicado,
            subtotal: subtotal,
            detalles_prendas: item.detalles,
            estado: 'RECIBIDO',
            fecha_entrega_estimada: item.fechaEntrega
            }, { transaction: t });
        }
    }

    // Actualizamos total
    nuevaVenta.costo_total = costoTotalCalculado;
    await nuevaVenta.save({ transaction: t });

    // Confirmamos éxito
    await t.commit();
    
    // Devolvemos la venta creada para que el controlador la use
    return nuevaVenta;

    } catch (error) {
        // Si falla, revertimos y lanzamos el error hacia arriba
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


//Esta el metodo de eliminar ordenes faltante por impementar, tambien los middlewares y requisito de roles

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
        
    module.exports = {
    createOrderTransaction, //ya
    getActiveSalesByClient, //ya
    updateOrderStatus, //ya
    getSaleDetails, //ya
    getAllSalesByBranch, 
    getAllOrdersByBranch
};