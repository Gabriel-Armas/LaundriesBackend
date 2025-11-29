const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

//Hacemos la ruta POST 
router.post('/', orderController.createOrder);

//Ver Ventas Activas (podemos mandar el id del cliente o no para filtrar)
//http://localhost:4003/ordenes/ventas-activas
router.get('/ventas-activas', orderController.getActiveSales);

//Obtener TODAS las ventas de la sucursal, es como el historial
//http://localhost:4003/ordenes/ventas?idSucursal=...
router.get('/ventas', orderController.getAllSales);

//Obtener TODAS las órdenes, items, de la sucursal
//http://localhost:4003/ordenes/items?idSucursal=...
router.get('/items', orderController.getAllOrders);

//Detalle (Ver TODO de una venta específica) 
router.get('/venta/:id', orderController.getSaleDetails);

//Cambiar estado de una orden específica
//PATCH http://localhost:4003/ordenes/item/5/estado
router.patch('/item/:id/estado', orderController.updateOrderStatus);


//Historial de Ventas, muestra tambien ordenes de un Cliente
//http://localhost:4003/ordenes/cliente/1/ventas
router.get('/cliente/:idCliente/ventas', orderController.getAllSalesByClient);

//Historial de Items o prendas de un cliente
//http://localhost:4003/ordenes/cliente/1/items
router.get('/cliente/:idCliente/items', orderController.getAllOrdersByClient);


// Cancelar una orden, necesita que mandemos un code en el body
//http://localhost:4003/ordenes/item/5/cancelar
router.patch('/item/:id/cancelar', orderController.cancelOrder);



module.exports = router;