const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const mongoUrl = "mongodb://localhost:27017/ukldb";

app.use(bodyParser.json());
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

mongoose.Promise = global.Promise; // promise berfungsi untuk menciptakan sebuah API

// Connect MongoDB at default port 27017
mongoose
    .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected!"))
    .catch(err => console.log(err));

// Rute guru
var Guru = require("./routes/Guru");
app.use("/guru", Guru);

// Rute Siswa
var Siswa = require("./routes/Siswa");
app.use("/siswa", Siswa);

// Rute Pelanggaran
var Pelanggaran = require("./routes/Pelanggaran");
app.use("/pelanggaran", Pelanggaran);

// Rute Poin
var Poin = require("./routes/Poin");
app.use("/poin", Poin);

// Rute Poin Siswa
var PoinSiswa = require("./routes/poin_siswa");
app.use("/poin-siswa", PoinSiswa);

// Rute Dashboard
var Dashboard = require("./routes/Dashboard");
app.use("/beranda", Dashboard);

// PORT
app.listen(port, () => {
    console.log("Server running on port " + port);
});
