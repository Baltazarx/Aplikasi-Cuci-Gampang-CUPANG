// routes/paketcuciRoutes.js
const express = require('express');
const router = express.Router();
const paketcuciController = require('../controllers/paketcuciController');

router.get('/', paketcuciController.getAllpaketcuci);
router.get('/:id', paketcuciController.getpaketcuciById);
router.post('/', paketcuciController.createpaketcuci);
router.put('/:id', paketcuciController.updatepaketcuci);
router.delete('/:id', paketcuciController.deletepaketcuci);

module.exports = router;