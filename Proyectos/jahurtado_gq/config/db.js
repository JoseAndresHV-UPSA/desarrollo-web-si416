const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});
const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('La Base de Datos esta conectada');
    } catch (error) {
        console.log('No se pudo conectar a la Base de Datos');
        console.log(error);
        process.exit(1);
    }
}
module.exports = conectarDB;
