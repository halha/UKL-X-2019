const express = require("express");
const pelanggaran = express.Router();
const jwt = require("jsonwebtoken");

// Require all models
const db = require("../models/Models");

pelanggaran.post("/", (req, res) => {
    var decoded = jwt.verify(
        req.headers["authorization"],
        process.env.SCRET_KEY
    );

    db.Guru.findOne({
        _id: decoded._id
    })
        .then(() => {
            const dataPelanggaran = {
                nama_pelanggaran: req.body.nama_pelanggaran,
                kategori: req.body.kategori,
                poin: req.body.poin
            };

            db.Pelanggaran.create(dataPelanggaran)
                .then(() => {
                    res.json({
                        status: "1",
                        massage: "Data Pelanggaran berhasil ditambahkan"
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

pelanggaran.get("/", (req, res) => {
    var decoded = jwt.verify(
        req.headers["authorization"],
        process.env.SCRET_KEY
    );

    db.Guru.findOne({
        _id: decoded._id
    })
        .then(() => {
            db.Pelanggaran.find({})
                .then(dbPelanggaran => {
                    res.json({
                        count: dbPelanggaran.map(pelanggaran => pelanggaran.id)
                            .length,
                        pelanggaran: dbPelanggaran.map(pelanggaran => {
                            const data = {
                                id: pelanggaran.id,
                                nama_pelanggaran: pelanggaran.nama_pelanggaran,
                                kategori: pelanggaran.kategori,
                                poin: pelanggaran.poin
                            };
                            return data;
                        }),
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

pelanggaran.put("/:id", (req, res) => {
    const newData = req.body;

    db.Pelanggaran.findByIdAndUpdate(req.params.id, newData)
        .then(() => {
            res.json({
                status: "1",
                massage: "Data Pelanggaran berhasil diubah",
                pelanggaran: newData
            });
        })
        .catch(err => {
            res.json(err);
        });
});

pelanggaran.delete("/:id", (req, res) => {
    db.Pelanggaran.findByIdAndDelete(req.params.id)
        .then(user => {
            if (user) {
                res.json({
                    status: "1",
                    massage: "Data Pelanggaran berhasil dihapus"
                });
            } else {
                res.json({ status: "1", massage: "Data tidak ditemukan" });
            }
        })
        .catch(err => {
            res.json(err);
        });
});

module.exports = pelanggaran;
