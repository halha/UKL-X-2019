const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pelanggaranSchema = new Schema({
    nama_pelanggaran: {
        type: String,
        required: true
    },
    kategori: {
        type: String,
        required: true
    },
    poin: {
        type: Number,
        required: true
    }
});

module.exports = Pelanggaran = mongoose.model("Pelanggaran", pelanggaranSchema);
