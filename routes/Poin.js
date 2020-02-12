const express = require("express");
const poin = express.Router();
const jwt = require("jsonwebtoken");

// Require all models
const db = require("../models/Models");

poin.post("/", (req, res) => {
    var decoded = jwt.verify(
        req.headers["authorization"],
        process.env.SCRET_KEY
    );

    db.Guru.findOne({
        _id: decoded._id
    })
        .then(() => {
            var today = new Date();

            var dd = String(today.getDate()).padStart(2, "0");
            var mm = String(today.getMonth() + 1).padStart(2, "0");
            var yyyy = today.getFullYear();

            today = yyyy + "-" + mm + "-" + dd;

            const dataPoin = {
                id_siswa: req.body.id_siswa,
                id_pelanggaran: req.body.id_pelanggaran,
                keterangan: req.body.keterangan,
                tanggal: today
            };

            db.Poin.create(dataPoin)
                .then(() => {
                    res.json({
                        status: "1",
                        massage: "Data Poin Pelanggaran berhasil ditambahkan"
                    });
                })
                .catch(err => {
                    res.json("error: " + err);
                });
        })
        .catch(err => {
            res.json(err);
        });
});

poin.get("/", (req, res) => {
    var decoded = jwt.verify(
        req.headers["authorization"],
        process.env.SCRET_KEY
    );

    db.Guru.findOne({
        _id: decoded._id
    })
        .then(() => {
            db.Poin.find({})
                .populate("id_siswa")
                .populate("id_pelanggaran")
                .then(dbPoin => {
                    res.json({
                        count: dbPoin.map(poin => poin.id).length,
                        poin: dbPoin.map(poin => poin),
                        status: "1"
                    });
                })
                .catch(err => {
                    res.json(err);
                });
        })
        .catch(err => {
            res.json(err);
        });
});

poin.put("/:id", (req, res) => {
    const newData = req.body;

    db.Poin.findByIdAndUpdate(req.params.id, newData)
        .then(() => {
            res.json({
                status: "1",
                massage: "Data Siswa berhasil diubah",
                poin: newData
            });
        })
        .catch(err => {
            res.json(err);
        });
});

poin.delete("/:id", (req, res) => {
    db.Poin.findByIdAndDelete(req.params.id)
        .then(user => {
            if (user) {
                res.json({ status: "1", massage: "Data berhasil dihapus" });
            } else {
                res.json({ status: "1", massage: "Data tidak ditemukan" });
            }
        })
        .catch(err => {
            res.json(err);
        });
});

module.exports = poin;
