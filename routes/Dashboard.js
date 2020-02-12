const express = require("express");
const dashboard = express.Router();
const jwt = require("jsonwebtoken");

// Require all models
const db = require("../models/Models");

dashboard.get("/statistik", (req, res) => {
    var decoded = jwt.verify(
        req.headers["authorization"],
        process.env.SCRET_KEY
    );

    const jumlahSiswa = db.Siswa.find({}).then(
        data => (jumlahSiswa.data = data)
    );

    const jumlahPetugas = db.Guru.find({}).then(
        data => (jumlahPetugas.data = data)
    );

    const jumlahPelanggaran = db.Pelanggaran.find({}).then(
        data => (jumlahPelanggaran.data = data)
    );

    var today = new Date();

    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;

    const jumlahPelanggaranHariIni = db.Poin.find({ tanggal: today }).then(
        data => (jumlahPelanggaranHariIni.data = data)
    );

    db.Guru.findOne({
        _id: decoded._id
    })
        .then(() => {
            res.json({
                jml_siswa: jumlahSiswa.data.length,
                jml_petugas: jumlahPetugas.data.length,
                jml_data_pelanggaran: jumlahPelanggaran.data.length,
                pelanggaran_hari_ini: jumlahPelanggaranHariIni.data.length
            });
        })
        .catch(err => {
            res.json(err);
        });
});

module.exports = dashboard;
