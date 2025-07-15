const connection = require('../config/db');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Pastikan ini diatur di .env

module.exports = {
  register: async (req, res) => {
    const { nama, email, password, no_telepon, alamat, role } = req.body;

    if (!nama || !email || !password || !no_telepon || !alamat || !role) {
      return res.status(400).json({ message: 'Semua data wajib diisi' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO users (nama, email, password, no_telepon, alamat, role) VALUES (?, ?, ?, ?, ?, ?)';
      const values = [nama, email, hashedPassword, no_telepon, alamat, role];

      connection.query(sql, values, (err, result) => {
        if (err) {
          console.error('❌ Gagal registrasi:', err);
          return res.status(500).json({ message: 'Gagal registrasi' });
        }

        return res.status(201).json({
          message: 'Registrasi berhasil',
          id_user: result.insertId
        });
      });
    } catch (error) {
      console.error('❌ Gagal hash password:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan saat registrasi' });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email dan password wajib diisi" });

    const sql = 'SELECT * FROM users WHERE email = ?';
    connection.query(sql, [email], async (err, results) => {
      if (err) return res.status(500).json({ message: "Kesalahan server" });
      if (!results || results.length === 0) {
        return res.status(401).json({ message: "Email atau password salah" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Email atau password salah" });
      }

      // Simpan session
      req.session.user = {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        alamat: user.alamat
      };

      return res.status(200).json({
        message: "Login berhasil",
        user: { email: user.email, role: user.role }
      });
    });
  },

  logout: (req, res) => {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ message: "Gagal logout" });
      res.clearCookie('connect.sid');
      res.status(200).json({ message: "Logout berhasil" });
    });
  },

  getMe: (req, res) => {
    res.send({ user: req.session.user });
  },

  getPelanggan: (req, res) => {
    connection.query("SELECT id, nama, email, no_telepon, alamat FROM users WHERE role = 'pelanggan'", (err, data) => {
      if (err) return res.status(500).send({ message: "Gagal ambil data pelanggan", err });
      res.send(data);
    });
  },

  getPesanan: (req, res) => {
    const q = `SELECT p.id, u.nama AS pelanggan, k.nomor_polisi, pc.nama_paket, p.lokasi, p.total_harga, p.status
               FROM pesanan p
               JOIN users u ON p.pelanggan_id = u.id
               JOIN kendaraan k ON p.kendaraan_id = k.id
               JOIN paket_cuci pc ON p.paket_cuci_id = pc.id`;
    connection.query(q, (err, data) => {
      if (err) return res.status(500).send({ message: "Gagal ambil data pesanan", err });
      res.send(data);
    });
  },

  getRatings: (req, res) => {
    const q = `SELECT r.id, u.nama AS pelanggan, r.rating, r.ulasan, r.created_at
               FROM ratings r 
               JOIN users u ON r.pelanggan_id = u.id 
               ORDER BY r.created_at DESC`;
    connection.query(q, (err, data) => {
      if (err) return res.status(500).send({ message: "Gagal ambil data rating", err });
      res.send(data);
    });
  },

  googleLogin: async (req, res) => {
    const { idToken } = req.body;

    try {
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const { email, name } = payload;

      // Check if user exists in database
      const sql = 'SELECT * FROM users WHERE email = ?';
      connection.query(sql, [email], async (err, results) => {
        if (err) {
          console.error('❌ Error querying user for Google login:', err);
          return res.status(500).json({ message: 'Server error during Google login' });
        }

        let user;
        if (results.length > 0) {
          // User exists, log them in
          user = results[0];
        } else {
          // User does not exist, register them
          const hashedPassword = await bcrypt.hash(email, 10); // Use email as a dummy password for Google users, or generate a random one
          const insertSql = 'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)';
          const insertValues = [name, email, hashedPassword, 'user']; // Default role 'user'

          connection.query(insertSql, insertValues, (insertErr, insertResult) => {
            if (insertErr) {
              console.error('❌ Error registering new user via Google:', insertErr);
              return res.status(500).json({ message: 'Failed to register user via Google' });
            }
            user = { id: insertResult.insertId, nama: name, email: email, role: 'user' };
          });
        }

        // Create session for the user
        req.session.user = {
          id: user.id,
          nama: user.nama,
          email: user.email,
          role: user.role,
          alamat: user.alamat || null, // Alamat mungkin kosong untuk Google login
        };

        return res.status(200).json({
          message: 'Login with Google successful',
          user: { email: user.email, role: user.role },
        });
      });
    } catch (error) {
      console.error('❌ Google token verification failed:', error);
      return res.status(401).json({ message: 'Invalid Google token' });
    }
  },
};
