const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');

const verifyToken = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');

router.post('/',verifyToken, checkRole(['ADMIN']), serviceController.createService);
router.patch('/:id',verifyToken, checkRole(['ADMIN']), serviceController.editService);
router.delete('/:id',verifyToken, checkRole(['ADMIN']), serviceController.deleteService);
router.get('/active', verifyToken, checkRole(['EMPLOYEE','MANAGER','ADMIN']), serviceController.getAllActiveServices);
router.get('/', verifyToken, checkRole(['EMPLOYEE','MANAGER','ADMIN']), serviceController.getAllServices);
module.exports = router;