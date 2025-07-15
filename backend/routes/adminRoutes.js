// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/pesanan', adminController.getAllPesanan);
router.put('/pesanan/:id/status', adminController.updatePesananStatus);
router.get('/ratings', adminController.getAllRatings);
router.delete('/pesanan/:id', adminController.deletePesanan);
router.get('/users', adminController.getAllUsers);

module.exports = router;