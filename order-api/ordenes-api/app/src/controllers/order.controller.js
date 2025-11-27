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

// PATCH /ordenes/:id/estado
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params; //El ID de la orden(item)
        const { estado } = req.body; 

        const ordenActualizada = await orderService.updateOrderStatus(id, estado);

        return res.status(200).json({
        message: 'Estado actualizado',
        data: ordenActualizada
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};


const getActiveSells = async (req,res) => {
    try{

        const {idSucursal,idCliente}= req.query;

        if (!idSucursal) {
            return res.status(400).json({ message: 'Falta el idSucursal' });
    }

        const ventas = await orderService.getActiveSells(idSucursal,idCliente);



        return res.status(200).json(ventas)

    }catch (error){
        console.error(error);
        return res.status(500).json({
            message: 'Error al obtener las ventas activas por cliente',
            error: error.message
        });
    }
};

const getSaleDetails = async (req, res) => {
    try {
        const { id } = req.params; // El ID de la Venta (UUID)
        const venta = await orderService.getSaleDetails(id);
        return res.status(200).json(venta);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};


// GET /ordenes/ventas TODO el historial de nuestras ventas de una sucursal
const getAllSales = async (req, res) => {
    try {
        const { idSucursal } = req.query;

        if (!idSucursal) {
        return res.status(400).json({ message: 'Falta el idSucursal' });
        }

        const ventas = await orderService.getAllSalesByBranch(idSucursal);
        return res.status(200).json(ventas);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// GET /ordenes/items  o sea todas las prendas individuales
const getAllOrders = async (req, res) => {
    try {
        const { idSucursal } = req.query;

        if (!idSucursal) {
        return res.status(400).json({ message: 'Falta el idSucursal' });
        }

        const ordenes = await orderService.getAllOrdersByBranch(idSucursal);
        return res.status(200).json(ordenes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
module.exports = {
    createOrder,
    getActiveSells,
    updateOrderStatus,
    getSaleDetails,
    getAllSales,
    getAllOrders


};