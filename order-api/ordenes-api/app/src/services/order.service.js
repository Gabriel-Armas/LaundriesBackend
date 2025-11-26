const { sequelize, Venta, OrdenServicio } = require('../models');

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

    module.exports = {
    createOrderTransaction
};