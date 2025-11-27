const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

//Hacemos la ruta POST 
router.post('/', orderController.createOrder);

//Ver Ventas Activas (podemos mandar el id del cliente o no para filtrar)
// URL: GET http://localhost:4003/ordenes/ventas-activas
router.get('/ventas-activas', orderController.getActiveSales);

//Obtener TODAS las ventas de la sucursal, es como el historial
//URL: GET http://localhost:4003/ordenes/ventas?idSucursal=...
router.get('/ventas', orderController.getAllSales);

//Obtener TODAS las órdenes, items, de la sucursal
//URL: GET http://localhost:4003/ordenes/items?idSucursal=...
router.get('/items', orderController.getAllOrders);

//Detalle (Ver TODO de una venta específica) 
router.get('/venta/:id', orderController.getSaleDetails);

//Cambiar estado de una orden específica
//URL: PATCH http://localhost:4003/ordenes/item/5/estado
router.patch('/item/:id/estado', orderController.updateOrderStatus);


module.exports = router;