const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

// Hacemos la ruta POST /
router.post('/', orderController.createOrder);

module.exports = router;