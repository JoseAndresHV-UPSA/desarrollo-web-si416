const {ApolloServer} = require('apollo-server');
const typeDefs = require('./db/schemas');
const resolvers = require('./db/resolvers');
const conectarDB = require('./config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'})

//Levantar la Base de Datos
conectarDB();

//Definir el servidor
const servidor = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        const token = (req.headers['authorization'] || '').replace("Bearer ", "");
        //Verificar si es un token válido de un usuario
        if (token) {
            try {
                const usuario = jwt.verify(token, process.env.FIRMA_SECRETA);
                return {usuario}
            } catch (error) {
                console.log('Hubo un error');
                console.log(error);
            }
        }
    }
})
//Levantado el servidor
servidor.listen().then(({url}) => {
    console.log(`El servidor esta levantado en la URL ${url}`);
});
