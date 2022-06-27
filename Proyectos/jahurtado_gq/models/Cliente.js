const mongoose = require('mongoose');

const ClienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    direccion: {
        type: String,
        trim: true
    },
    telefono: {
        type: String,
        trim: true
    },
    saldoTotal: {
        type: Number,
        trim: true,
        default: 0
    },
    tipoCliente: {
        type: String,
        required: true,
    },
    oficialDeCredito: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Cliente', ClienteSchema);