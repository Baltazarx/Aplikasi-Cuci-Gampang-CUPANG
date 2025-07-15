const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    // Jika ada session user, lanjutkan ke rute berikutnya
    return next();
  } else {
    // Jika tidak ada, tolak akses
    return res.status(401).json({ message: 'Akses ditolak. Silakan login terlebih dahulu.' });
  }
};

module.exports = { isLoggedIn };