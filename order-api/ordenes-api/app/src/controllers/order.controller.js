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


const getActiveSales = async (req,res) => {
    try{

        const {idSucursal,idCliente}= req.query;

        if (!idSucursal) {
            return res.status(400).json({ message: 'Falta el idSucursal' });
    }

        const ventas = await orderService.getActiveSalesByClient(idSucursal,idCliente);



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


//Historial Tickets, tambien muestra todas las ordenes asociadas al cliente, o sea tooodo junto
const getAllSalesByClient = async (req, res) => {
    try {
        const { idCliente } = req.params;
        const ventas = await orderService.getAllSalesByClient(idCliente);
        return res.status(200).json(ventas);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//Historial Prendas
const getAllOrdersByClient = async (req, res) => {
    try {
        const { idCliente } = req.params;
        const ordenes = await orderService.getAllOrdersByClient(idCliente);
        return res.status(200).json(ordenes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// PATCH cancelar una orden, es cambiarle el estado
const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params; // ID de la orden a cancelar
        const { idSucursal, codigoAutorizacion } = req.body; // Datos de seguridad

        if (!idSucursal || !codigoAutorizacion) {
            return res.status(400).json({ 
                message: 'Se requiere idSucursal y codigoAutorizacion para cancelar' 
            });
        }

        const ordenCancelada = await orderService.cancelOrder(id, idSucursal, codigoAutorizacion);

        return res.status(200).json({
            message: 'Orden cancelada exitosamente',
            data: ordenCancelada
        });

    } catch (error) {
        // Si el error es por código inválido, podríamos devolver 403 (Forbidden) o 400
        return res.status(400).json({ 
            message: 'No se pudo cancelar la orden',
            error: error.message 
        });
    }
};

const getSalesByDate = async (req, res) => {
    try {
        const { idSucursal, fecha } = req.query;

        //Validaciones 
        if (!idSucursal) {
            return res.status(400).json({ message: 'Se requiere idSucursal' });
        }
        if (!fecha) {
            return res.status(400).json({ message: 'Se requiere la fecha (YYYY-MM-DD)' });
        }

        const ventas = await orderService.getSalesByDate(idSucursal, fecha);
        
        return res.status(200).json(ventas);
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error al obtener ventas por fecha', 
            error: error.message 
        });
    }
};

module.exports = {
    createOrder,
    getActiveSales,
    updateOrderStatus,
    getSaleDetails,
    getAllSales,
    getAllOrders,
    getAllSalesByClient,
    getAllOrdersByClient,
    cancelOrder,
    getSalesByDate
};