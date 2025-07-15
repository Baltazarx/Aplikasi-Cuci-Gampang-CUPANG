const express = require('express');
const router = express.Router();
const pesananController = require('../controllers/pesananController');

router.get('/me', pesananController.getPesananSaya);
// 1️⃣ Ambil semua pesanan (Admin)
router.get('/', pesananController.getAllPesanan);

// 2️⃣ Ambil satu pesanan berdasarkan ID
router.get('/:id', pesananController.getPesananById);

// 3️⃣ Ambil semua pesanan dari satu pelanggan (Admin)
router.get('/user/:pelanggan_id', pesananController.getPesananByUserId);

// 5️⃣ Buat pesanan baru (user login)
router.post('/', pesananController.createPesanan);

// 6️⃣ Update seluruh data pesanan
router.put('/:id', pesananController.updatePesanan);

// 7️⃣ Update hanya status pesanan (Admin/operator)
router.put('/:id/status', pesananController.updateStatusPesanan);

// 8️⃣ Hapus pesanan
router.delete('/:id', pesananController.deletePesanan);

module.exports = router;
