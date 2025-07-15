// controllers/adminController.js
const db = require('../config/db');

exports.getAllPesanan = (req, res) => {
  const sql = `
    SELECT 
      pesanan.id,
      users.nama AS nama_pelanggan,
      kendaraan.nomor_polisi,
      paket_cuci.nama_paket,
      pesanan.lokasi,
      pesanan.total_harga,
      pesanan.status,
      pesanan.created_at
    FROM pesanan
    JOIN users ON pesanan.user_id = users.id
    JOIN kendaraan ON pesanan.kendaraan_id = kendaraan.id
    JOIN paket_cuci ON pesanan.paket_cuci_id = paket_cuci.id
    ORDER BY pesanan.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('❌ Gagal ambil data pesanan:', err);
      return res.status(500).json({ message: 'Gagal ambil pesanan' });
    }
    res.status(200).json(result);
  });
};

exports.updatePesananStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = 'UPDATE pesanan SET status = ? WHERE id = ?';
  db.query(sql, [status, id], (err) => {
    if (err) {
      console.error('❌ Gagal update status:', err);
      return res.status(500).json({ message: 'Gagal update status pesanan' });
    }
    res.json({ message: 'Status berhasil diubah' });
  });
};

exports.getAllRatings = (req, res) => {
  const sql = `
    SELECT 
      ratings.id,
      users.nama AS nama_pelanggan,
      ratings.rating,
      ratings.ulasan,
      paket_cuci.nama_paket,
      ratings.created_at
    FROM ratings
    JOIN users ON ratings.user_id = users.id
    JOIN pesanan ON ratings.pesanan_id = pesanan.id
    JOIN paket_cuci ON pesanan.paket_cuci_id = paket_cuci.id
    ORDER BY ratings.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('❌ Gagal ambil ratings:', err);
      return res.status(500).json({ message: 'Gagal ambil rating' });
    }
    res.status(200).json(result);
  });
};

exports.getAllUsers = (req, res) => {
  const sql = `
    SELECT id, nama, email, no_telepon, alamat, role
    FROM users
    WHERE role = 'user'  -- 🔥 Hanya user biasa
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('❌ Gagal ambil data users:', err);
      return res.status(500).json({ message: 'Gagal ambil data users' });
    }

    res.status(200).json(result);
  });
};

exports.deletePesanan = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM pesanan WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Gagal hapus pesanan:', err);
      return res.status(500).json({ message: 'Gagal hapus pesanan' });
    }

    res.status(200).json({ message: 'Pesanan berhasil dihapus' });
  });
};