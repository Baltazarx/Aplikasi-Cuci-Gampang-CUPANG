const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/me', userController.getSessionUser);

// Update profil user login
router.put('/update-profile', userController.updateProfile);

// Kendaraan milik user login
router.get('/kendaraan', userController.getKendaraanUser);
router.post('/kendaraan', userController.tambahKendaraan);
router.put('/kendaraan/:id', userController.updateKendaraan);
router.delete('/kendaraan/:id', userController.hapusKendaraan);

// CRUD user (admin)
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
