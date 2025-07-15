const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

router.get('/summary/paket/:paket_id', ratingController.getRatingSummaryByPaketId);
router.get('/summary/paket', ratingController.getAllRatingSummariesByPaket);
router.get('/paket/:paket_id', ratingController.getRatingsByPaketId);
router.get('/pesanan/:pesanan_id', ratingController.getRatingByPesananId);
router.get('/', ratingController.getAllRatings);
router.get('/:id', ratingController.getRatingById);
router.post('/', ratingController.createRating);
router.put('/:id', ratingController.updateRating);
router.delete('/:id', ratingController.deleteRating);

module.exports = router;
