const connection = require('../config/db');

module.exports = {
  // 1️⃣ Ambil semua pesanan
  getAllPesanan: (req, res) => {
    const sql = "SELECT * FROM pesanan";
    connection.query(sql, (err, data) => {
      if (err) {
        console.error("❌ getAllPesanan:", err);
        return res.status(500).send({ message: "Gagal ambil data pesanan" });
      }
      res.send(data);
    });
  },

  // 2️⃣ Ambil pesanan berdasarkan ID
  getPesananById: (req, res) => {
    const sql = "SELECT * FROM pesanan WHERE id = ?";
    connection.query(sql, [req.params.id], (err, data) => {
      if (err) {
        console.error("❌ getPesananById:", err);
        return res.status(500).send({ message: "Gagal ambil pesanan" });
      }
      if (data.length === 0) {
        return res.status(404).send({ message: "Pesanan tidak ditemukan" });
      }
      res.send(data[0]);
    });
  },

  // 3️⃣ Ambil semua pesanan dari pelanggan tertentu
  getPesananByUserId: (req, res) => {
    const sql = "SELECT * FROM pesanan WHERE user_id = ?";
    connection.query(sql, [req.params.user_id], (err, data) => {
      if (err) {
        console.error("❌ getPesananByUserId:", err);
        return res.status(500).send({ message: "Gagal ambil pesanan pelanggan" });
      }
      res.send(data);
    });
  },

  // 4️⃣ Ambil pesanan milik user login
  getPesananSaya: (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.id) {
      return res.status(401).json({ message: "Unauthorized: User belum login" });
    }

    const userId = req.session.user.id;

    const sql = `
    SELECT 
      pesanan.id,
      pesanan.lokasi,
      pesanan.status,
      pesanan.total_harga,
      pesanan.created_at,
      kendaraan.nomor_polisi,
      paket_cuci.nama_paket,
      paket_cuci.harga AS harga_paket
    FROM pesanan
    JOIN kendaraan ON pesanan.kendaraan_id = kendaraan.id
    JOIN paket_cuci ON pesanan.paket_cuci_id = paket_cuci.id
    WHERE pesanan.user_id = ?
    ORDER BY pesanan.created_at DESC
  `;

    connection.query(sql, [userId], (err, result) => {
      if (err) {
        console.error("❌ getPesananSaya:", err);
        return res.status(500).json({ message: 'Gagal ambil pesanan' });
      }
      res.status(200).json(result);
    });
  },

  // 5️⃣ Buat pesanan baru
  createPesanan: (req, res) => {
    const user = req.session.user;
    const { paket_cuci_id, kendaraan_id } = req.body;
    const lokasi = user.alamat;

    if (!paket_cuci_id || !kendaraan_id || !lokasi) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    // Ambil harga dari paket cuci
    const sqlHarga = 'SELECT harga FROM paket_cuci WHERE id = ?';
    connection.query(sqlHarga, [paket_cuci_id], (err, result) => {
      if (err || result.length === 0) {
        console.error('❌ Gagal ambil harga paket:', err);
        return res.status(400).json({ message: 'Paket tidak ditemukan' });
      }

      const total_harga = result[0].harga;

      const sqlInsert = `
        INSERT INTO pesanan 
        (user_id, kendaraan_id, paket_cuci_id, lokasi, total_harga, status, created_at)
        VALUES (?, ?, ?, ?, ?, 'diproses', NOW())
      `;
      const values = [user.id, kendaraan_id, paket_cuci_id, lokasi, total_harga];

      connection.query(sqlInsert, values, (err, result2) => {
        if (err) {
          console.error('❌ Gagal simpan pesanan:', err);
          return res.status(500).json({ message: 'Gagal simpan pesanan' });
        }
        res.status(201).json({ message: 'Pesanan berhasil dibuat', id: result2.insertId });
      });
    });
  },

  // 6️⃣ Update isi lengkap pesanan
  updatePesanan: (req, res) => {
    const id = req.params.id;
    const updateData = req.body;
    const sql = "UPDATE pesanan SET ? WHERE id = ?";
    connection.query(sql, [updateData, id], (err, result) => {
      if (err) {
        console.error("❌ updatePesanan:", err);
        return res.status(500).send({ message: "Gagal update pesanan" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "Pesanan tidak ditemukan" });
      }
      res.send({ message: "Pesanan berhasil diupdate", id, ...updateData });
    });
  },

  // 7️⃣ Update status saja
  updateStatusPesanan: (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    if (!status) return res.status(400).send({ message: "Status harus disertakan" });

    const sql = "UPDATE pesanan SET status = ? WHERE id = ?";
    connection.query(sql, [status, id], (err, result) => {
      if (err) {
        console.error("❌ updateStatusPesanan:", err);
        return res.status(500).send({ message: "Gagal update status pesanan" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "Pesanan tidak ditemukan" });
      }
      res.send({ message: "Status pesanan berhasil diupdate", status });
    });
  },

  // 8️⃣ Hapus pesanan
  deletePesanan: (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM pesanan WHERE id = ?";
    connection.query(sql, [id], (err, result) => {
      if (err) {
        console.error("❌ deletePesanan:", err);
        return res.status(500).send({ message: "Gagal hapus pesanan" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "Pesanan tidak ditemukan" });
      }
      res.send({ message: `Pesanan dengan ID ${id} berhasil dihapus` });
    });
  },
};
