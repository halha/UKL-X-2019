const express = require("express");
const poinSiswa = express.Router();
const jwt = require("jsonwebtoken");

// Require all models
const db = require("../models/Models");

// GET ALL
poinSiswa.get("/", (req, res) => {
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
                        poinSiswa: dbPoin.map(poin => poin),
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

poinSiswa.post("/", (req, res) => {
    var decoded = jwt.verify(
        req.headers["authorization"],
        process.env.SCRET_KEY
    );

    db.Guru.findOne({
        _id: decoded._id
    })
        .then(() => {
            db.Poin.findOne({
                id_siswa: req.body.cari
            })
                .populate("id_siswa")
                .populate("id_pelanggaran")
                .then(dataSiswa => {
                    res.json(dataSiswa);
                })
                .catch(err => {
                    res.json(err);
                });
        })
        .catch(err => {
            res.json(err);
        });
});

module.exports = poinSiswa;
