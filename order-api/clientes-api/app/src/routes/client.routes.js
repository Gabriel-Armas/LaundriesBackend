const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');

const verifyToken = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');


//Crear
router.post('/', verifyToken, checkRole(['EMPLOYEE','MANAGER','ADMIN']), clientController.createClient);

//Obtener todos 
router.get('/', verifyToken, checkRole(['EMPLOYEE','MANAGER','ADMIN']), clientController.getAllClients);

//Obtener uno
router.get('/:id', verifyToken, checkRole(['EMPLOYEE','MANAGER','ADMIN']), clientController.getClient);

//Editar
router.patch('/:id', verifyToken, checkRole(['EMPLOYEE','MANAGER','ADMIN']),clientController.editClient);

//Eliminar
router.delete('/:id', verifyToken, checkRole(['ADMIN']), clientController.deleteClient);

module.exports = router;