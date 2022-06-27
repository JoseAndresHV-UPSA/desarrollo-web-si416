const mongoose = require('mongoose');

const TransaccionSchema = mongoose.Schema({
    cuentaOrigen: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cuenta'
    },
    cuentaDestino: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cuenta'
    },
    monto: {
        type: Number,
        required: true,
        trim: true
    },
    referencia: {
        type: String,
        required: true,
        trim: true
    },
    clienteOrigen: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cliente'
    },
    clienteDestino: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cliente'
    },
    sucursalOrigen: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Sucursal'
    },
    sucursalDestino: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Sucursal'
    },
    banco: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Banco'
    },
    fecha: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('Transaccion', TransaccionSchema);