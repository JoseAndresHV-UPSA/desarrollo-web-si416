const {gql} = require('apollo-server');

const typeDefs = gql`
    #---TYPES---
    #Usuarios
    type Usuario {
        id: ID
        nombre: String
        apellido: String
        email: String
        creado: String
        banco: ID
    }
    type UsuarioDTO {
        id: ID
        nombre: String
        apellido: String
        email: String
        creado: String
        banco: Banco
    }
    type Token {
        token: String
    }

    #Bancos
    type Banco {
        id: ID
        nombre: String
    }

    #Sucursales
    type Sucursal {
        id: ID
        nombre: String
        direccion: String
        banco: ID
    }

    #Clientes
    type Cliente {
        id: ID
        nombre: String
        direccion: String
        telefono: String
        saldoTotal: Float
        tipoCliente: tipoCliente
        oficialDeCredito: ID
    }

    #Cuentas
    type Cuenta {
        id: ID
        numeroCuenta: Int
        saldoCuenta: Float
        tipoCuenta: tipoCuenta
        cliente: ID
        banco: ID
        sucursal: ID
    }
    type CuentaDTO {
        id: ID
        numeroCuenta: Int
        saldoCuenta: Float
        tipoCuenta: tipoCuenta
        cliente: Cliente
        banco: Banco
        sucursal: Sucursal
    }

    #Transacciones
    type Transaccion {
        id: ID
        cuentaOrigen: ID
        cuentaDestino: ID
        monto: Float
        referencia: String
        clienteOrigen: ID
        clienteDestino: ID
        sucursalOrigen: ID
        sucursalDestino: ID
        banco: ID
        fecha: String
    }
    type TransaccionDTO {
        id: ID
        cuentaOrigen: Cuenta
        cuentaDestino: Cuenta
        monto: Float
        referencia: String
        clienteOrigen: Cliente
        clienteDestino: Cliente
        sucursalOrigen: Sucursal
        sucursalDestino: Sucursal
        banco: Banco
        fecha: String
    }
    
    #Rubro
    type Rubro {
        id: ID,
        cliente: ID,
        oficialDeCredito: ID,
        tipoRubro: tipoRubro,
        descripcion: String
    }

    type RubroDTO {
        id: ID,
        cliente: Cliente,
        oficialDeCredito: Usuario,
        tipoRubro: tipoRubro,
        descripcion: String
    }

    #Depositos Plazo Fijo
    type DepositoPlazoFijo {
        id: ID
        oficialDeCredito: ID
        cliente: ID
        sucursal: ID
        fecha: String
        plazo: tipoPlazo
        moneda: tipoMoneda
        monto: Float
    }
    type DepositoPlazoFijoDTO {
        id: ID
        oficialDeCredito: ID
        cliente: Cliente
        sucursal: Sucursal
        fecha: String
        plazo: tipoPlazo
        moneda: tipoMoneda
        monto: Float
    }
    type mayorDepositoPlazoFijo {
        nombreCliente: String
        monto: Float
        moneda: tipoMoneda
        plazo: tipoPlazo
        oficialDeCredito: String
    }

    #Busquedas Avanzadas
    type saldoCliente {
        id: ID
        cliente: ID
        saldoCuenta: Float
    }
    type topOficialDeCredito {
        cantidadClientes: Int
        usuario: Usuario
    }
    type transaccionesClienteSucursal {
        cliente: Cliente
        sucursal: Sucursal
        montoTotal: Float
        cantidadTransacciones: Int
    }

    #---ENUMS---
    #Clientes
    enum tipoCliente {
        CATEGORIA_A
        CATEGORIA_B
        CATEGORIA_C
    }

    #Cuentas
    enum tipoCuenta {
        CAJA_DE_AHORRO
        CUENTA_CORRIENTE
    }

    #Depositos Plazo Fijo
    enum tipoPlazo {
        MESES_6
        MESES_12
        MESES_24
    }
    enum tipoMoneda {
        BOL
        USD
    }
    
    #Rubro
    enum tipoRubro {
        COMERCIAL
        INDUSTRIAL
        EDUCACION
    }

    #---INPUTS---
    #Usuarios
    input UsuarioInput {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
        banco: ID!
    }
    input AutenticarInput {
        email: String!
        password: String!
    }

    #Bancos
    input BancoInput {
        nombre: String!
    }

    #Sucursales
    input SucursalInput {
        nombre: String!
        direccion: String!
        banco: ID!
    }

    #Clientes
    input ClienteInput {
        nombre: String!
        direccion: String
        telefono: String
        tipoCliente: tipoCliente!
    }

    #Cuentas
    input CuentaInput {
        numeroCuenta: Int!
        saldoCuenta: Float!
        tipoCuenta: tipoCuenta!
        cliente: ID!
        sucursal: ID!
    }

    #Transacciones
    input TransaccionInput {
        cuentaOrigen: ID!
        cuentaDestino: ID!
        monto: Float!
        referencia: String!
    }

    #Depositos Plazo Fijo
    input DepositoPlazoFijoInput {
        cliente: ID!
        sucursal: ID!
        plazo: tipoPlazo!
        moneda: tipoMoneda!
        monto: Float!
    }
    
    #Rubros
    input RubroInput {
        cliente: ID!
        tipoRubro: tipoRubro!
        descripcion: String!
    }

    #---QUERIES---
    type Query {
        #Usuarios
        obtenerUsuario: Usuario
        obtenerUsuarioDTO: UsuarioDTO

        #Bancos
        obtenerBancos: [Banco]
        obtenerBancoPorID(id: ID!): Banco

        #Sucursales
        obtenerSucursales: [Sucursal]
        obtenerSucursalPorID(id: ID!): Sucursal
        obtenerSucursalesBanco: [Sucursal]

        #Clientes
        obtenerClientes: [Cliente]
        obtenerClientePorID(id: ID!): Cliente
        obtenerClientesOficialDeCredito: [Cliente]

        #Cuentas
        obtenerCuentas: [Cuenta]
        obtenerCuentaPorId(id: ID!): Cuenta
        obtenerCuentasCliente(id: ID!): [Cuenta]
        obtenerCuentasOficialDeCredito: [Cuenta]
        obtenerCuentasDTOs: [CuentaDTO]
        obtenerCuentaDTO(id: ID!): CuentaDTO

        #Transacciones
        obtenerTransacciones: [Transaccion]
        obtenerTransaccionesDTO: [TransaccionDTO]
        obtenerTransaccionPorId(id: ID!): Transaccion
        obtenerTransaccionesCliente(id: ID!): [Transaccion]

        #Busquedas Avanzadas
        obtenerSaldosDeClientesPorSucursal(id: ID!): [saldoCliente]
        obtenerClienteConMasTransaccionesPorSucursal(id: ID!): transaccionesClienteSucursal
        mejorOficialDeCredito: topOficialDeCredito

        #Depositos Plazo Fijo
        obtenerDepositosPlazoFijo: [DepositoPlazoFijo]
        obtenerDepositosPlazoFijoDTO: [DepositoPlazoFijoDTO]
        obtenerDepositoPlazoFijoPorId(id: ID!): DepositoPlazoFijo
        obtenerDepositoPlazoFijoDTO(id: ID!): DepositoPlazoFijoDTO
        obtenerMayorDepositoPlazoFijo: mayorDepositoPlazoFijo
        
        #Rubros
        obtenerRubros: [RubroDTO]
        obtenerRubro(id: ID!): RubroDTO
    }

    #---MUTATIONS---
    type Mutation {
        #Usuarios
        nuevoUsuario(input: UsuarioInput): Usuario
        autenticarUsuario(input: AutenticarInput): Token

        #Bancos
        nuevoBanco(input: BancoInput): Banco
        actualizarBanco(id: ID!, input: BancoInput): Banco
        eliminarBanco(id: ID!): String

        #Sucursales
        nuevaSucursal(input: SucursalInput): Sucursal
        actualizarSucursal(id: ID!, input: SucursalInput): Sucursal
        eliminarSucursal(id: ID!): String

        #Clientes
        nuevoCliente(input: ClienteInput): Cliente
        actualizarCliente(id: ID!, input: ClienteInput): Cliente
        eliminarCliente(id: ID!): String

        #Cuentas
        nuevaCuenta(input: CuentaInput): Cuenta
        actualizarCuenta(id: ID!, input: CuentaInput): Cuenta
        eliminarCuenta(id: ID!): String

        #Transacciones
        nuevaTransaccion(input: TransaccionInput): Transaccion
        revertirTransaccion(id: ID!): Transaccion

        #Depositos Plazo Fijo
        nuevoDepositoPlazoFijo(input: DepositoPlazoFijoInput): DepositoPlazoFijo
        actualizarDepositoPlazoFijo(id: ID!, input: DepositoPlazoFijoInput): DepositoPlazoFijo
        eliminarDepositoPlazoFijo(id: ID!): String
        
        #Rubros
        nuevoRubro(input: RubroInput): Rubro
        actualizarRubro(id: ID!, input: RubroInput): Rubro
        eliminarRubro(id: ID!): String
    }
`;

module.exports = typeDefs;