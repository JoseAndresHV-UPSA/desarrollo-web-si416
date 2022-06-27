const mongoose = require('mongoose');

const DepositoPlazoFijoSchema = mongoose.Schema({
    oficialDeCredito: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cliente'
    },
    sucursal: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Sucursal'
    },
    fecha: {
        type: Date,
        default: Date.now()
    },
    plazo: {
        type: String,
        required: true,
    },
    moneda: {
        type: String,
        required: true,
    },
    monto: {
        type: Number,
        required: true,
        trim: true
    },
});

module.exports = mongoose.model('DepositoPlazoFijo', DepositoPlazoFijoSchema);