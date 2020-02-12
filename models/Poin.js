const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const poinSchema = new Schema({
    id_siswa: {
        type: mongoose.Types.ObjectId,
        ref: "Siswa"
    },
    id_pelanggaran: {
        type: mongoose.Types.ObjectId,
        ref: "Pelanggaran"
    },
    tanggal: {
        type: String
    },
    keterangan: {
        type: String
    }
});

module.exports = Poin = mongoose.model("Poin", poinSchema);
