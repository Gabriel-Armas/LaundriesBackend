// Importamos el SERVICIO, no los modelos
const orderService = require('../services/order.service');

const createOrder = async (req, res) => {
    try {
    //Extraemos los datos del body
    const orderData = req.body;

    //Llamamos al Servicio 
    //Acá el controlador no sabe qué es una transacción, nada mas espera el resultado
    const nuevaVenta = await orderService.createOrderTransaction(orderData);

    //Respondemos al cliente
    return res.status(201).json({
        message: 'Orden creada exitosamente',
        data: nuevaVenta
    });

    } catch (error) {
        //Manejamos errores si se dan
        console.error('Error en el controlador de órdenes:', error);
        return res.status(500).json({
        message: 'Error al procesar la orden',
        error: error.message
        });
    }
};

module.exports = {
    createOrder
};