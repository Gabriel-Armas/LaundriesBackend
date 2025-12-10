const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

const verifyToken = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');

//Hacemos la ruta POST 
router.post('/',  verifyToken, checkRole(['EMPLOYEE','MANAGER','ADMIN']),orderController.createOrder);

//Ver Ventas Activas (podemos mandar el id del cliente o no para filtrar)
//http://localhost:4003/ordenes/ventas-activas
router.get('/ventas-activas',verifyToken, checkRole(['EMPLOYEE','MANAGER','ADMIN']),orderController.getActiveSales);

//Obtener TODAS las ventas de la sucursal, es como el historial
//http://localhost:4003/ordenes/ventas?idSucursal=...
router.get('/ventas',verifyToken, checkRole(['MANAGER','ADMIN']), orderController.getAllSales);

//Reporte de Ventas por fecha en formato  
//http://localhost:4003/ordenes/ventas/por-fecha?idSucursal=XYZ&fecha=2025-11-30
router.get('/ventas/por-fecha', verifyToken, checkRole(['MANAGER', 'ADMIN','EMPLOYEE']), orderController.getSalesByDate);


//Obtener TODAS las órdenes, items, de la sucursal
//http://localhost:4003/ordenes/items?idSucursal=...
router.get('/items',verifyToken, checkRole(['MANAGER','ADMIN']), orderController.getAllOrders);

//Detalle (Ver TODO de una venta específica) 
router.get('/venta/:id',verifyToken, checkRole(['EMPLOYEE','MANAGER','ADMIN']), orderController.getSaleDetails);

//Cambiar estado de una orden específica
//PATCH http://localhost:4003/ordenes/item/5/estado
router.patch('/item/:id/estado',verifyToken, checkRole(['EMPLOYEE','MANAGER','ADMIN']), orderController.updateOrderStatus);


//Historial de Ventas, muestra tambien ordenes de un Cliente
//http://localhost:4003/ordenes/cliente/1/ventas
router.get('/cliente/:idCliente/ventas',verifyToken, checkRole(['MANAGER','ADMIN']), orderController.getAllSalesByClient);

//Historial de Items o prendas de un cliente
//http://localhost:4003/ordenes/cliente/1/items
router.get('/cliente/:idCliente/items',verifyToken, checkRole(['MANAGER','ADMIN']),orderController.getAllOrdersByClient);


// Cancelar una orden, necesita que mandemos un code en el body
//http://localhost:4003/ordenes/item/5/cancelar
router.patch('/item/:id/cancelar', verifyToken , checkRole(['MANAGER','ADMIN','EMPLOYEE']),orderController.cancelOrder);




module.exports = router;