const mongoose = require('mongoose');

const RubroSchema = mongoose.Schema({
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
    tipoRubro: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
});

module.exports = mongoose.model('Rubro', RubroSchema);