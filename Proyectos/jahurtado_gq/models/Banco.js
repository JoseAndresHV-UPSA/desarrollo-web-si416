const mongoose = require('mongoose');

const BancoSchema = mongoose.Schema({
    nombre: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
});

module.exports = mongoose.model('Banco', BancoSchema);