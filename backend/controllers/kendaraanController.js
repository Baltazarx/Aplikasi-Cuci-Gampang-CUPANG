const connection = require('../config/db');

module.exports = {
    getAllKendaraan: (req, res) => {
        const qstring = "SELECT * FROM kendaraan";
        connection.query(qstring, (err, data) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send({
                    message: err.message || "Terjadi Kesalahan saat get data kendaraan"
                });
            }
            else res.send(data);
        });
    },

    getKendaraanById: (req, res) => {
        const qstring = `SELECT * FROM kendaraan WHERE id = ${req.params.id}`;
        connection.query(qstring, (err, data) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send({
                    message: err.message || "Terjadi Kesalahan saat get data kendaraan"
                });
            }
            else if (data.length === 0) {
                res.status(404).send({
                    message: `Kendaraan dengan ID ${req.params.id} tidak ditemukan`
                });
            }
            else res.send(data[0]);
        });
    },

    getKendaraanByUserId: (req, res) => {
        const qstring = `SELECT * FROM kendaraan WHERE user_id = ${req.params.user_id}`;
        connection.query(qstring, (err, data) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send({
                    message: err.message || "Terjadi Kesalahan saat get data kendaraan"
                });
            }
            else res.send(data);
        });
    },

    createKendaraan: (req, res) => {
        const newKendaraan = req.body;
        const qstring = "INSERT INTO kendaraan SET ?";
        
        connection.query(qstring, newKendaraan, (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send({
                    message: err.message || "Terjadi kesalahan saat menambahkan kendaraan"
                });
            }
            else {
                newKendaraan.id = result.insertId;
                res.status(201).send(newKendaraan);
            }
        });
    },

    updateKendaraan: (req, res) => {
        const kendaraanId = req.params.id;
        const kendaraanData = req.body;
        const qstring = `UPDATE kendaraan SET ? WHERE id = ${kendaraanId}`;
        
        connection.query(qstring, kendaraanData, (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send({
                    message: "Error updating kendaraan with ID " + kendaraanId
                });
            }
            else if (result.affectedRows === 0) {
                res.status(404).send({
                    message: `Kendaraan dengan ID ${kendaraanId} tidak ditemukan`
                });
            }
            else {
                res.send({ id: kendaraanId, ...kendaraanData });
            }
        });
    },

    deleteKendaraan: (req, res) => {
        const kendaraanId = req.params.id;
        const qstring = `DELETE FROM kendaraan WHERE id = ${kendaraanId}`;
        
        connection.query(qstring, (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send({
                    message: "Error deleting kendaraan with ID " + kendaraanId
                });
            }
            else if (result.affectedRows === 0) {
                res.status(404).send({
                    message: `Kendaraan dengan ID ${kendaraanId} tidak ditemukan`
                });
            }
            else {
                res.send({ message: `Kendaraan dengan ID ${kendaraanId} telah dihapus` });
            }
        });
    }
};