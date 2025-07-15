const connection = require('../config/db');

module.exports = {
    getAllpaketcuci: (req, res) => {
        const qstring = "SELECT * FROM paket_cuci";
        connection.query(qstring, (err, data) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send({
                    message: err.message || "Terjadi Kesalahan saat get data paket cuci"
                });
            }
            else res.send(data);
        });
    },

    getpaketcuciById: (req, res) => {
        const qstring = `SELECT * FROM paket_cuci WHERE id = ${req.params.id}`;
        connection.query(qstring, (err, data) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send({
                    message: err.message || "Terjadi Kesalahan saat get data paket cuci"
                });
            }
            else if (data.length === 0) {
                res.status(404).send({
                    message: `Paket cuci dengan ID ${req.params.id} tidak ditemukan`
                });
            }
            else res.send(data[0]);
        });
    },

    createpaketcuci: (req, res) => {
        const newPaket = req.body;
        const qstring = "INSERT INTO paket_cuci SET ?";
        
        connection.query(qstring, newPaket, (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send({
                    message: err.message || "Terjadi kesalahan saat menambahkan paket cuci"
                });
            }
            else {
                newPaket.id = result.insertId;
                res.status(201).send(newPaket);
            }
        });
    },

    updatepaketcuci: (req, res) => {
        const paketId = req.params.id;
        const paketData = req.body;
        const qstring = `UPDATE paket_cuci SET ? WHERE id = ${paketId}`;
        
        connection.query(qstring, paketData, (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send({
                    message: "Error updating paket cuci with ID " + paketId
                });
            }
            else if (result.affectedRows === 0) {
                res.status(404).send({
                    message: `Paket cuci dengan ID ${paketId} tidak ditemukan`
                });
            }
            else {
                res.send({ id: paketId, ...paketData });
            }
        });
    },

    deletepaketcuci: (req, res) => {
        const paketId = req.params.id;
        const qstring = `DELETE FROM paket_cuci WHERE id = ${paketId}`;
        
        connection.query(qstring, (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.status(500).send({
                    message: "Error deleting paket cuci with ID " + paketId
                });
            }
            else if (result.affectedRows === 0) {
                res.status(404).send({
                    message: `Paket cuci dengan ID ${paketId} tidak ditemukan`
                });
            }
            else {
                res.send({ message: `Paket cuci dengan ID ${paketId} telah dihapus` });
            }
        });
    }
};