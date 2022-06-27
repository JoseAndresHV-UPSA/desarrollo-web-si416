const mongoose = require('mongoose');

const CuentaSchema = mongoose.Schema({
    numeroCuenta: {
        type: Number,
        required: true,
        trim: true
    },
    saldoCuenta: {
        type: Number,
        required: true,
        trim: true
    },
    tipoCuenta: {
        type: String,
        required: true,
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cliente'
    },
    banco: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Banco'
    },
    sucursal: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Sucursal'
    },
});

module.exports = mongoose.model('Cuenta', CuentaSchema);