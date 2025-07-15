const express = require('express');
const router = express.Router();
const kendaraanController = require('../controllers/kendaraanController');

router.get('/', kendaraanController.getAllKendaraan);
router.get('/:id', kendaraanController.getKendaraanById);
router.get('/user/:user_id', kendaraanController.getKendaraanByUserId);
router.post('/', kendaraanController.createKendaraan);
router.put('/:id', kendaraanController.updateKendaraan);
router.delete('/:id', kendaraanController.deleteKendaraan);

module.exports = router;