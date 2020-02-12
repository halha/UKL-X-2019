const express = require("express");
const siswa = express.Router();
const jwt = require("jsonwebtoken");

// Require all models
const db = require("../models/Models");

siswa.post("/", (req, res) => {
    var decoded = jwt.verify(
        req.headers["authorization"],
        process.env.SCRET_KEY
    );

    db.Guru.findOne({
        _id: decoded._id
    })
        .then(() => {
            const dataSiswa = {
                nama_siswa: req.body.nama_siswa,
                kelas: req.body.kelas,
                nis: req.body.nis
            };

            db.Siswa.create(dataSiswa)
                .then(() => {
                    res.json({
                        status: "1",
                        massage: "Data Siswa berhasil ditambahkan"
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

siswa.get("/", (req, res) => {
    var decoded = jwt.verify(
        req.headers["authorization"],
        process.env.SCRET_KEY
    );

    db.Guru.findOne({
        _id: decoded._id
    })
        .then(() => {
            db.Siswa.find({})
                .then(dbSiswa => {
                    res.json({
                        count: dbSiswa.map(siswa => siswa.id).length,
                        siswa: dbSiswa.map(siswa => {
                            const data = {
                                id: siswa.id,
                                nis: siswa.nis,
                                nama_siswa: siswa.nama_siswa,
                                kelas: siswa.kelas,
                                created_at: siswa.created_at,
                                updated_at: siswa.updated_at
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

siswa.put("/:id", (req, res) => {
    const newData = req.body;

    db.Siswa.findByIdAndUpdate(req.params.id, newData)
        .then(() => {
            res.json({
                status: "1",
                massage: "Data Siswa berhasil diubah",
                siswa: newData
            });
        })
        .catch(err => {
            res.json(err);
        });
});

siswa.delete("/:id", (req, res) => {
    db.Siswa.findByIdAndDelete(req.params.id)
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

module.exports = siswa;
