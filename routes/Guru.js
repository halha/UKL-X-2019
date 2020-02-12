const express = require("express");
const guru = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Require all models
const db = require("../models/Models");

// env
process.env.SCRET_KEY = "secret";

// Register Guru
guru.post("/register", (req, res) => {
    const today = new Date();
    const guruData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        created_at: today,
        updated_at: today
    };

    db.Guru.findOne({
        email: req.body.email
    })
        .then(user => {
            if (!user) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    guruData.password = hash;
                    db.Guru.create(guruData)
                        .then(user => {
                            res.json({ status: user.email + " registered!" });
                        })
                        .catch(err => {
                            res.json("error: " + err);
                        });
                });
            } else {
                res.json({ error: "Guru already exist" });
            }
        })
        .catch(err => {
            res.send("error: " + err);
        });
});

// Login Guru
guru.post("/login", (req, res) => {
    db.Guru.findOne({
        email: req.body.email
    })
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    const payload = {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        created_at: user.created_at,
                        updated_at: user.updated_at
                    };
                    let token = jwt.sign(payload, process.env.SCRET_KEY, {
                        expiresIn: "24h"
                    });
                    res.json({
                        logged: true,
                        token: token,
                        massage: "Login berhasil"
                    });
                } else {
                    res.json({ error: "User does not exist" });
                }
            } else {
                res.json({ error: "User does not exist" });
            }
        })
        .catch(err => {
            res.send("err " + err);
        });
});

guru.get("/login/check", (req, res) => {
    var decoded = jwt.verify(
        req.headers["authorization"],
        process.env.SCRET_KEY
    );

    db.Guru.findOne({
        _id: decoded._id
    })
        .then(dbUser => {
            res.json({
                auth: true,
                user: {
                    id: dbUser._id,
                    name: dbUser.username,
                    email: dbUser.email,
                    role: dbUser.role,
                    created_at: dbUser.created_at,
                    updated_at: dbUser.updated_at
                }
            });
        })
        .catch(err => {
            res.json(err);
        });
});

guru.post("/petugas", (req, res) => {
    var decoded = jwt.verify(
        req.headers["authorization"],
        process.env.SCRET_KEY
    );

    db.Guru.findOne({
        _id: decoded._id
    })
        .then(() => {
            const dataPetugas = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            };

            db.Guru.findOne({
                email: req.body.email
            })
                .then(user => {
                    if (!user) {
                        bcrypt.hash(req.body.password, 10, (err, hash) => {
                            dataPetugas.password = hash;
                            db.Guru.create(dataPetugas)
                                .then(() => {
                                    res.json({
                                        status: "1",
                                        massage: "Petugas berhasil ditambahkan"
                                    });
                                })
                                .catch(err => {
                                    res.json("error: " + err);
                                });
                        });
                    } else {
                        res.json({ error: "User already exist" });
                    }
                })
                .catch(err => {
                    res.send("error: " + err);
                });
        })
        .catch(err => {
            res.json(err);
        });
});

guru.get("/petugas", (req, res) => {
    var decoded = jwt.verify(
        req.headers["authorization"],
        process.env.SCRET_KEY
    );

    db.Guru.findOne({
        _id: decoded._id
    })
        .then(() => {
            db.Guru.find({})
                .then(dbUsers => {
                    res.json({
                        count: dbUsers.map(users => users.id).length,
                        petugas: dbUsers.map(users => {
                            const data = {
                                id: users.id,
                                name: users.username,
                                role: users.role,
                                email: users.email,
                                created_at: users.created_at,
                                updated_at: users.updated_at
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

guru.put("/petugas/:id", (req, res) => {
    const newData = req.body;

    db.Guru.findByIdAndUpdate(req.params.id, newData)
        .then(() => {
            res.json({
                status: "1",
                massage: "Petugas berhasil diubah",
                user: newData
            });
        })
        .catch(err => {
            res.json(err);
        });
});

guru.delete("/petugas/:id", (req, res) => {
    db.Guru.findByIdAndDelete(req.params.id)
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

module.exports = guru;
