const connection = require('../config/db');

module.exports = {
    getAllRatings: (req, res) => {
        const qstring = "SELECT * FROM ratings";
        connection.query(qstring, (err, data) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send({
                    message: err.message || "Terjadi Kesalahan saat get data ratings"
                });
            }
            else res.send(data);
        });
    },

    getRatingById: (req, res) => {
        const qstring = `SELECT * FROM ratings WHERE id = ${req.params.id}`;
        connection.query(qstring, (err, data) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send({
                    message: err.message || "Terjadi Kesalahan saat get data rating"
                });
            }
            else if (data.length === 0) {
                res.status(404).send({
                    message: `Rating dengan ID ${req.params.id} tidak ditemukan`
                });
            }
            else res.send(data[0]);
        });
    },
    getRatingsByPaketId: (req, res) => {
        const paketId = req.params.paket_id;
        const query = `
        SELECT r.id, r.pesanan_id, r.rating, r.ulasan, r.created_at, u.nama AS user_nama
        FROM ratings r
        JOIN pesanan p ON r.pesanan_id = p.id
        JOIN users u ON p.user_id = u.id
        WHERE p.paket_cuci_id = ?
        ORDER BY r.created_at DESC
    `;
        connection.query(query, [paketId], (err, results) => {
            if (err) {
                console.error("Error ambil ulasan:", err);
                return res.status(500).json({ message: "Gagal ambil ulasan" });
            }
            res.json(results);
        });
    },

    getRatingByPesananId: (req, res) => {
        const qstring = `SELECT * FROM ratings WHERE pesanan_id = ${req.params.pesanan_id}`;
        connection.query(qstring, (err, data) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send({
                    message: err.message || "Terjadi Kesalahan saat get data rating"
                });
            }
            else if (data.length === 0) {
                res.status(404).send({
                    message: `Rating untuk pesanan dengan ID ${req.params.pesanan_id} tidak ditemukan`
                });
            }
            else res.send(data[0]);
        });
    },

    createRating: (req, res) => {
        const { pesanan_id, rating, ulasan } = req.body;
        const user_id = req.session.user?.id;

        if (!pesanan_id || !user_id || !rating || !ulasan) {
            return res.status(400).send({ message: "Semua field harus diisi!" });
        }

        const qstring = "INSERT INTO ratings SET ?";
        const newRating = { pesanan_id, user_id, rating, ulasan };

        connection.query(qstring, newRating, (err, result) => {
            if (err) {
                console.log("error: ", err);
                return res.status(500).send({
                    message: err.message || "Terjadi kesalahan saat menambahkan rating"
                });
            }
            res.status(201).send({ id: result.insertId, ...newRating });
        });
    },


    updateRating: (req, res) => {
        const ratingId = req.params.id;
        const ratingData = req.body;
        const qstring = `UPDATE ratings SET ? WHERE id = ${ratingId}`;

        connection.query(qstring, ratingData, (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send({
                    message: "Error updating rating with ID " + ratingId
                });
            }
            else if (result.affectedRows === 0) {
                res.status(404).send({
                    message: `Rating dengan ID ${ratingId} tidak ditemukan`
                });
            }
            else {
                res.send({ id: ratingId, ...ratingData });
            }
        });
    },

    deleteRating: (req, res) => {
        const ratingId = req.params.id;
        const qstring = `DELETE FROM ratings WHERE id = ${ratingId}`;

        connection.query(qstring, (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send({
                    message: "Error deleting rating with ID " + ratingId
                });
            }
            else if (result.affectedRows === 0) {
                res.status(404).send({
                    message: `Rating dengan ID ${ratingId} tidak ditemukan`
                });
            }
            else {
                res.send({ message: `Rating dengan ID ${ratingId} telah dihapus` });
            }
        });
    },

    getRatingSummaryByPaketId: (req, res) => {
        const { paket_id } = req.params;

        const query = `
        SELECT 
            COUNT(r.id) AS total_ulasan,
            AVG(r.rating) AS rata_rating
        FROM ratings r
        JOIN pesanan p ON r.pesanan_id = p.id
        WHERE p.paket_cuci_id = ?
    `;

        connection.query(query, [paket_id], (err, results) => {
            if (err) {
                console.error("Error:", err);
                return res.status(500).json({ error: "Gagal mengambil data ringkasan rating" });
            }

            const summary = results[0];
            res.json({
                total_ulasan: summary.total_ulasan || 0,
                rata_rating: summary.rata_rating ? parseFloat(summary.rata_rating).toFixed(1) : "0.0"
            });
        });
    },
    getAllRatingSummariesByPaket: (req, res) => {
        const query = `
        SELECT 
            p.paket_cuci_id,
            COUNT(r.id) AS total_ulasan,
            AVG(r.rating) AS rata_rating
        FROM ratings r
        JOIN pesanan p ON r.pesanan_id = p.id
        GROUP BY p.paket_cuci_id
    `;

        connection.query(query, (err, results) => {
            if (err) {
                console.error("Error:", err);
                return res.status(500).json({ error: "Gagal mengambil ringkasan rating semua paket" });
            }

            const summaries = {};
            results.forEach(row => {
                summaries[row.paket_cuci_id] = {
                    total_ulasan: row.total_ulasan,
                    rata_rating: parseFloat(row.rata_rating).toFixed(1)
                };
            });

            res.json(summaries);
        });
    },
};