const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');

//Crear
router.post('/', clientController.createClient);

//Obtener todos 
router.get('/', clientController.getAllClients);

//Obtener uno
router.get('/:id', clientController.getClient);

//Editar
router.patch('/:id', clientController.editClient);

//Eliminar
router.delete('/:id', clientController.deleteClient);

module.exports = router;