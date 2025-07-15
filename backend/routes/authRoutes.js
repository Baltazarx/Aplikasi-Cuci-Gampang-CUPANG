const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Autentikasi
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/register', authController.register);
router.get('/me', authController.getMe);
router.post('/google', authController.googleLogin);

// Admin tools
router.get('/pelanggan', authController.getPelanggan);
router.get('/pesanan', authController.getPesanan);
router.get('/ratings', authController.getRatings);

module.exports = router;
