const mongoose = require('mongoose');
//Oficial de Credito
const UsuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    creado: {
        type: Date,
        default: Date.now()
    },
    banco: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Banco'
    }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);