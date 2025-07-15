const connection = require('../config/db');

module.exports = {
  getSessionUser: (req, res) => {
    const userId = req.session.user.id;

    const sql = 'SELECT * FROM users WHERE id = ?';
    connection.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('❌ Gagal ambil user dari DB:', err);
        return res.status(500).json({ message: 'Gagal ambil user' });
      }
      if (results.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });

      res.json({ user: results[0] });
    });
  },

  updateProfile: (req, res) => {
    const { nama, alamat } = req.body;
    const userId = req.session.user.id;

    const sql = 'UPDATE users SET nama = ?, alamat = ? WHERE id = ?';
    connection.query(sql, [nama, alamat, userId], (err) => {
      if (err) {
        console.error('❌ Gagal update profil:', err);
        return res.status(500).json({ message: 'Gagal update profil' });
      }

      // ✅ Update juga session-nya agar nama langsung berubah di frontend
      req.session.user.nama = nama;
      req.session.user.alamat = alamat;

      res.status(200).json({ message: 'Profil berhasil diupdate' });
    });
  },

  // ✅ Ambil semua user
  getAllUsers: (req, res) => {
    const sql = "SELECT * FROM users";
    connection.query(sql, (err, data) => {
      if (err) return res.status(500).json({ message: "Gagal ambil data user" });
      res.json(data);
    });
  },

  // ✅ Ambil user berdasarkan ID
  getUserById: (req, res) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    connection.query(sql, [req.params.id], (err, data) => {
      if (err) return res.status(500).json({ message: "Gagal ambil user" });
      if (data.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });
      res.json(data[0]);
    });
  },

  // ✅ Tambah user (admin)
  createUser: (req, res) => {
    const newUser = req.body;
    const sql = "INSERT INTO users SET ?";
    connection.query(sql, newUser, (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal membuat user" });
      newUser.id = result.insertId;
      res.status(201).json(newUser);
    });
  },

  // ✅ Update user by ID
  updateUser: (req, res) => {
    const { nama, alamat } = req.body;
    const sql = "UPDATE users SET nama = ?, alamat = ? WHERE id = ?";
    connection.query(sql, [nama, alamat, req.params.id], (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal update user" });
      if (result.affectedRows === 0) return res.status(404).json({ message: "User tidak ditemukan" });
      res.json({ id: req.params.id, nama, alamat });
    });
  },

  // ✅ Hapus user by ID
  deleteUser: (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?";
    connection.query(sql, [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal hapus user" });
      if (result.affectedRows === 0) return res.status(404).json({ message: "User tidak ditemukan" });
      res.json({ message: `User ID ${req.params.id} berhasil dihapus` });
    });
  },

  // ✅ Ambil kendaraan user login
  getKendaraanUser: (req, res) => {
    const userId = req.session.user.id;
    const sql = 'SELECT * FROM kendaraan WHERE user_id = ?';
    connection.query(sql, [userId], (err, data) => {
      if (err) return res.status(500).json({ message: 'Gagal ambil kendaraan' });
      res.status(200).json(data);
    });
  },

  // ✅ Tambah kendaraan user login
  tambahKendaraan: (req, res) => {
    const userId = req.session.user.id;
    const { merk, model, nomor_polisi, jenis } = req.body;
    const sql = 'INSERT INTO kendaraan (user_id, merk, model, nomor_polisi, jenis) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [userId, merk, model, nomor_polisi, jenis], (err, result) => {
      if (err) return res.status(500).json({ message: 'Gagal menambah kendaraan' });
      res.status(201).json({ id: result.insertId, merk, model, nomor_polisi, jenis });
    });
  },

  // ✅ Update kendaraan user login
  updateKendaraan: (req, res) => {
    const userId = req.session.user.id;
    const kendaraanId = req.params.id;
    const { merk, model, nomor_polisi, jenis } = req.body;
    const sql = 'UPDATE kendaraan SET merk = ?, model = ?, nomor_polisi = ?, jenis = ? WHERE id = ? AND user_id = ?';
    connection.query(sql, [merk, model, nomor_polisi, jenis, kendaraanId, userId], (err) => {
      if (err) return res.status(500).json({ message: 'Gagal update kendaraan' });
      res.json({ id: kendaraanId, merk, model, nomor_polisi, jenis });
    });
  },

  // ✅ Hapus kendaraan user login
  hapusKendaraan: (req, res) => {
    const userId = req.session.user.id;
    const kendaraanId = req.params.id;
    const sql = 'DELETE FROM kendaraan WHERE id = ? AND user_id = ?';
    connection.query(sql, [kendaraanId, userId], (err) => {
      if (err) return res.status(500).json({ message: 'Gagal hapus kendaraan' });
      res.json({ message: 'Kendaraan berhasil dihapus' });
    });
  },
};
