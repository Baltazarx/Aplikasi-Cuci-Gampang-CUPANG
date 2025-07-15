// 📁 /backend/index.js

const express = require('express');
const session = require('express-session');
const cors = require('cors');

// Import semua rute
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const pesananRoutes = require('./routes/pesananRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paketcuciRoutes = require('./routes/paketcuciRoutes');
const ratingRoutes = require('./routes/ratingRoutes')

// Middleware auth
const { isLoggedIn } = require('./middleware/authMiddleware');

const app = express();
const port = 5000;

//  Konfigurasi CORS (izinkan frontend mengakses backend)
app.use(cors({
  origin: 'http://localhost:8081', // frontend Next.js
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // penting untuk cookie
}));

//  Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Session konfigurasi
app.use(session({
  secret: 'rahasia',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.use('/auth', authRoutes);

app.use('/users', isLoggedIn, userRoutes);
app.use('/pesanan', isLoggedIn, pesananRoutes);

app.use('/admin', isLoggedIn, adminRoutes);

app.use('/paket-cuci', isLoggedIn, paketcuciRoutes);
app.use('/ratings', isLoggedIn, ratingRoutes);

// 7️⃣ Cek server aktif
app.get('/', (req, res) => {
  res.send('✅ Backend API Aktif!');
});

// 8️⃣ Jalankan server
app.listen(port, () => {
  console.log(`🚀 Backend jalan di http://192.168.18.118:${port}`);
});