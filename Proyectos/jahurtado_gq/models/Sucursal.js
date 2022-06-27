const mongoose = require('mongoose');

const SucursalSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    direccion: {
        type: String,
        unique: true,
        trim: true
    },
    banco: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Banco'
    },
});

module.exports = mongoose.model('Sucursal', SucursalSchema);