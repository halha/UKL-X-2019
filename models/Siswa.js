const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const siswaSchema = new Schema({
    nama_siswa: {
        type: String,
        required: true
    },
    kelas: {
        type: String,
        required: true
    },
    nis: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = Siswa = mongoose.model("Siswa", siswaSchema);
