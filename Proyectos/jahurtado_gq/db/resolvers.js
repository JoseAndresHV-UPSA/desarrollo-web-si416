const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Banco = require('../models/Banco');
const Sucursal = require('../models/Sucursal');
const Cliente = require('../models/Cliente');
const Cuenta = require('../models/Cuenta');
const Transaccion = require('../models/Transaccion');
const DepositoPlazoFijo = require('../models/DepositoPlazoFijo');
const Rubro = require('../models/Rubro');

require('dotenv').config({path: 'variables.env'})

const CrearToken = (usuario, firma, expiresIn) => {
    const {id, email, nombre, apellido, banco, creado} = usuario;
    return jwt.sign({id, email, nombre, apellido, banco, creado}, firma, {expiresIn});
}

const resolvers = {
    Query: {
        //Usuarios
        obtenerUsuario: async (_, {}, ctx) => {
            return ctx.usuario;
        },
        obtenerUsuarioDTO: async (_, {}, ctx) => {
            const usuario = await Usuario.findById(ctx.usuario.id).populate('banco');
            return usuario;
        },

        //Bancos
        obtenerBancos: async () => {
            try {
                //Buscar todas las existencias
                const bancos = await Banco.find({});
                return bancos;
            } catch (e) {
                console.log(e);
            }
        },
        obtenerBancoPorID: async (_, {id}) => {
            //Verificar si existe
            const existeBanco = await Banco.findById(id);
            if (!existeBanco) {
                throw new Error(`El Banco con el ID ${id} no existe.`);
            }
            return existeBanco;
        },

        //Sucursales
        obtenerSucursales: async () => {
            try {
                //Buscar todas las existencias
                const sucursales = await Sucursal.find({});
                return sucursales;
            } catch (e) {
                console.log(e);
            }
        },
        obtenerSucursalPorID: async (_, {id}) => {
            //Verificar si existe
            const existeSucursal = await Sucursal.findById(id);
            if (!existeSucursal) {
                throw new Error(`La Sucursal con el ID ${id} no existe.`);
            }
            return existeSucursal;
        },
        obtenerSucursalesBanco: async (_, {}, ctx) => {
            const {banco} = ctx.usuario;
            //Verificar si existe
            const existeBanco = await Banco.findById(banco);
            if (!existeBanco) {
                throw new Error(`El Banco con el ID ${banco} no existe.`);
            }
            //Buscar todas las existencias
            const sucursales = await Sucursal.find({banco: banco});
            return sucursales;
        },

        //Clientes
        obtenerClientes: async () => {
            try {
                //Buscar todas las existencias
                const clientes = await Cliente.find({});
                return clientes;
            } catch (e) {
                console.log(e);
            }
        },
        obtenerClientePorID: async (_, {id}, ctx) => {
            //Verificar si existe
            const existeCliente = await Cliente.findById(id);
            if (!existeCliente) {
                throw new Error(`El Cliente con el ID ${id} no existe.`)
            }
            //Validar credenciales
            if (existeCliente.oficialDeCredito.toString() !== ctx.usuario.id) {
                throw new Error('No tiene las credenciales para ver ese Cliente')
            }
            //Mostrar
            return existeCliente;
        },
        obtenerClientesOficialDeCredito: async (_, {}, ctx) => {
            try {
                const cliente = await Cliente.find({oficialDeCredito: ctx.usuario.id.toString()});
                return cliente;
            } catch (e) {
                console.log(e);
            }
        },

        //Cuentas
        obtenerCuentas: async () => {
            try {
                //Buscar todas las existencias
                const cuentas = await Cuenta.find({});
                return cuentas;
            } catch (e) {
                console.log(e);
            }
        },
        obtenerCuentaPorId: async (_, {id}, ctx) => {
            //Verificar si existe
            const existeCuenta = await Cuenta.findById(id);
            if (!existeCuenta) {
                throw new Error(`La Cuenta con el ID ${id} no existe.`)
            }
            //Validar credenciales
            const cliente = await Cliente.findById(existeCuenta.cliente);
            if (cliente.oficialDeCredito.toString() !== ctx.usuario.id) {
                throw new Error('No tiene las credenciales para ver esta Cuenta')
            }
            //Mostrar
            return existeCuenta;
        },
        obtenerCuentaDTO: async (_, {id}, ctx) => {
            //Verificar si existe
            const existeCuenta = await Cuenta.findById(id).populate('banco').populate('sucursal').populate('cliente');
            ;
            if (!existeCuenta) {
                throw new Error(`La Cuenta con el ID ${id} no existe.`)
            }
            //Validar credenciales
            if (existeCuenta.cliente.oficialDeCredito.toString() !== ctx.usuario.id) {
                throw new Error('No tiene las credenciales para ver esta Cuenta')
            }
            //Mostrar
            return existeCuenta;
        },
        obtenerCuentasCliente: async (_, {id}, ctx) => {
            //Verificar si existe
            let existeCliente = await Cliente.findById(id);
            if (!existeCliente) {
                throw new Error(`El Cliente con el ID ${id} no existe.`)
            }
            //Validar credenciales
            if (existeCliente.oficialDeCredito.toString() !== ctx.usuario.id) {
                throw new Error('No tiene las credenciales para ver estas Cuentas')
            }
            //Mostrar
            const cuentas = await Cuenta.find({cliente: id});
            return cuentas;
        },
        obtenerCuentasOficialDeCredito: async (_, {}, ctx) => {
            try {
                //Buscar todas las existencias
                const cuentas = await Cuenta.find({});
                let cuentasCliente = []
                //Filtrar
                for (const cuenta of cuentas) {
                    const cliente = await Cliente.findById(cuenta.cliente);
                    if (cliente.oficialDeCredito.toString() === ctx.usuario.id) {
                        cuentasCliente.push(cuenta);
                    }
                }
                return cuentasCliente;
            } catch (e) {
                console.log(e);
            }
        },
        obtenerCuentasDTOs: async (_, {}, ctx) => {
            try {
                //Buscar todas las existencias
                const cuentas = await Cuenta.find({}).populate('banco').populate('sucursal').populate('cliente');
                let cuentasCliente = []
                //Filtrar
                for (const cuenta of cuentas) {
                    if (cuenta.cliente.oficialDeCredito.toString() === ctx.usuario.id) {
                        cuentasCliente.push(cuenta);
                    }
                }
                return cuentasCliente;
            } catch (e) {
                console.log(e);
            }
        },

        //Transacciones
        obtenerTransacciones: async () => {
            try {
                //Buscar todas las existencias
                const transacciones = await Transaccion.find({});
                return transacciones;
            } catch (e) {
                console.log(e);
            }
        },
        obtenerTransaccionesDTO: async (_, {}, ctx) => {
            const transacciones = await Transaccion.find({banco: ctx.usuario.banco.toString()})
                .populate('cuentaOrigen').populate('cuentaDestino')
                .populate('clienteOrigen').populate('clienteDestino')
                .populate('sucursalOrigen').populate('sucursalDestino')
                .populate('banco');
            return transacciones;
        },
        obtenerTransaccionPorId: async (_, {id}, ctx) => {
            //Verificar si existe
            const existeTransaccion = await Transaccion.findById(id);
            if (!existeTransaccion) {
                throw new Error(`La Transaccion con el ID ${id} no existe.`)
            }
            //Validar credenciales
            const clienteOrigen = await Cliente.findById(existeTransaccion.clienteOrigen);
            const clienteDestino = await Cliente.findById(existeTransaccion.clienteDestino);
            if (clienteOrigen.oficialDeCredito.toString() !== ctx.usuario.id || clienteDestino.oficialDeCredito.toString() !== ctx.usuario.id) {
                throw new Error('No tiene las credenciales para ver esta Cuenta')
            }
            //Mostrar
            return existeTransaccion;
        },
        obtenerTransaccionesCliente: async (_, {id}, ctx) => {
            //Verificar si existe
            let existeCliente = await Cliente.findById(id);
            if (!existeCliente) {
                throw new Error(`El Cliente con el ID ${id} no existe.`)
            }
            //Validar credenciales
            if (existeCliente.oficialDeCredito.toString() !== ctx.usuario.id) {
                throw new Error('No tiene las credenciales para ver esta Cuenta')
            }
            //Mostrar
            const transacciones = await Transaccion.find({clienteOrigen: id});
            return transacciones;
        },

        //Busquedas Avanzadas
        obtenerSaldosDeClientesPorSucursal: async (_, {id}, ctx) => {
            //Verificar si existe
            const existeSucursal = await Sucursal.findById(id);
            if (!existeSucursal) {
                throw new Error(`La Sucursal con el ID ${id} no existe.`);
            }
            //Validar credenciales
            if (existeSucursal.banco.toString() !== ctx.usuario.banco) {
                throw new Error('No tiene las credenciales para ver estas Cuentas')
            }
            //Mostrar
            const cuentas = Cuenta.find({sucursal: id});
            return cuentas;
        },
        obtenerClienteConMasTransaccionesPorSucursal: async (_, {id}, ctx) => {
            //Verificar si existe
            const existeSucursal = await Sucursal.findById(id);
            if (!existeSucursal) {
                throw new Error(`La Sucursal con el ID ${id} no existe.`);
            }
            //Validar credenciales
            if (existeSucursal.banco.toString() !== ctx.usuario.banco) {
                throw new Error('No tiene las credenciales para ver estas informacion')
            }
            //Mostrar
            const clienteConMasTransacciones = {
                cliente: null, sucursal: existeSucursal, montoTotal: 0, cantidadTransacciones: 0
            };

            const cuentas = Cuenta.find({sucursal: id});
            for await (const cuenta of cuentas) {
                const {cliente} = cuenta;
                const cantTransacciones = await Transaccion.count({clienteOrigen: cliente, sucursalOrigen: id});
                if (cantTransacciones > clienteConMasTransacciones.cantidadTransacciones) {
                    clienteConMasTransacciones.cliente = await Cliente.findById(cliente);
                    const transacciones = await Transaccion.find({clienteOrigen: cliente, sucursalOrigen: id});
                    let acumMonto = 0;
                    for await (const transaccion of transacciones) {
                        acumMonto += transaccion.monto;
                    }
                    clienteConMasTransacciones.montoTotal = acumMonto;
                    clienteConMasTransacciones.cantidadTransacciones = cantTransacciones;
                }
            }
            return clienteConMasTransacciones;
        },
        mejorOficialDeCredito: async () => {
            const usuarios = await Usuario.find({});
            const mejorOficial = {
                cantidadClientes: 0, usuario: null
            };
            for await (const usuario of usuarios) {
                const {id} = usuario;
                const cantClientes = await Cliente.count({oficialDeCredito: id});
                if (cantClientes > mejorOficial.cantidadClientes) {
                    mejorOficial.cantidadClientes = cantClientes;
                    mejorOficial.usuario = usuario;
                }
            }
            return mejorOficial;
        },

        //Depositos Plazo Fijo
        obtenerDepositosPlazoFijo: async () => {
            try {
                //Buscar todas las existencias
                const depositos = await DepositoPlazoFijo.find({});
                return depositos;
            } catch (e) {
                console.log(e);
            }
        },
        obtenerDepositosPlazoFijoDTO: async (_, {}, ctx) => {
            try {
                //Buscar todas las existencias
                const depositos = await DepositoPlazoFijo.find({oficialDeCredito: ctx.usuario.id.toString()})
                    .populate('cliente').populate('sucursal');
                return depositos;
            } catch (e) {
                console.log(e);
            }
        },
        obtenerDepositoPlazoFijoDTO: async (_, {id}, ctx) => {
            //Verificar si existe
            const existeDeposito = await DepositoPlazoFijo.findById(id)
                .populate('cliente').populate('sucursal');
            if (!existeDeposito) {
                throw new Error(`El Deposito a plazo fijo con el ID ${id} no existe.`)
            }
            //Validar credenciales
            if (existeDeposito.cliente.oficialDeCredito.toString() !== ctx.usuario.id) {
                throw new Error('No tiene las credenciales para ver esta Cuenta')
            }
            //Mostrar
            return existeDeposito;
        },
        obtenerDepositoPlazoFijoPorId: async (_, {id}, ctx) => {
            //Verificar si existe
            const existeDeposito = await DepositoPlazoFijo.findById(id);
            if (!existeDeposito) {
                throw new Error(`El Deposito a plazo fijo con el ID ${id} no existe.`)
            }
            //Validar credenciales
            const cliente = await Cliente.findById(existeDeposito.cliente);
            if (cliente.oficialDeCredito.toString() !== ctx.usuario.id) {
                throw new Error('No tiene las credenciales para ver esta Cuenta')
            }
            //Mostrar
            return existeDeposito;
        },
        obtenerMayorDepositoPlazoFijo: async (_, {}, ctx) => {
            let mayorDeposito = {
                nombreCliente: "",
                monto: 0,
                moneda: "",
                plazo: "",
                oficialDeCredito: ""
            };
            const depositos = await DepositoPlazoFijo.find({oficialDeCredito: ctx.usuario.id});
            for await (const deposito of depositos) {
                const {cliente, monto} = deposito;
                if (monto > mayorDeposito.monto) {
                    const existeCliente = await Cliente.findById(cliente);
                    mayorDeposito = {
                        nombreCliente: existeCliente.nombre,
                        monto: deposito.monto,
                        moneda: deposito.moneda,
                        plazo: deposito.plazo,
                        oficialDeCredito: `${ctx.usuario.nombre} ${ctx.usuario.apellido}`
                    };
                }
            }
            return mayorDeposito;
        },

        //Rubros
        obtenerRubros: async (_, {}, ctx) => {
            const rubros = await Rubro.find({oficialDeCredito: ctx.usuario.id.toString()})
                .populate('cliente').populate('oficialDeCredito');
            return rubros;
        },
        obtenerRubro: async (_, {id}, ctx) => {
            //Verificar si existe
            const existeRubro = await Rubro.findById(id)
                .populate('cliente').populate('oficialDeCredito');
            //Verificar si existe
            if (!existeRubro) {
                throw new Error(`El Rubro con el ID ${id} no existe.`);
            }
            //Validar credenciales
            if (existeRubro.oficialDeCredito.id === ctx.usuario.id.toString()) {
                throw new Error(`No tiene las credenciales para ver esta informacion.`);
            }
            return existeRubro;
        },
    },

    Mutation: {
        //Usuarios
        nuevoUsuario: async (_, {input}) => {
            const {email, password} = input;
            //Verificar si ya fue registrado
            const existeUsuario = await Usuario.findOne({email});
            if (existeUsuario) {
                throw new Error(`El usuario con el mail ${email} ya fue registrado`);
            }
            //Hashear la password
            const salt = await bcryptjs.genSaltSync(10);
            input.password = await bcryptjs.hash(password, salt);
            try {
                const usuario = new Usuario(input);
                await usuario.save();
                return usuario;
            } catch (error) {
                console.log(error);
            }
            return 'Creando Usuario';
        },
        autenticarUsuario: async (_, {input}) => {
            const {email, password} = input;
            //Verificar que el usuario exista
            const existeUsuario = await Usuario.findOne({email});
            if (!existeUsuario) {
                throw new Error(`El usuario con el mail ${email} no existe.`);
            }
            //Verificar si el password es correcto
            const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
            if (!passwordCorrecto) {
                throw new Error(`El password es incorrecto.`);
            }
            //Crear el Token
            return {
                token: CrearToken(existeUsuario, process.env.FIRMA_SECRETA, 300000)
            }
        },

        //Bancos
        nuevoBanco: async (_, {input}) => {
            const {nombre} = input;
            //Verificar que exista
            const existeBanco = await Banco.findOne({nombre});
            if (existeBanco) {
                throw new Error(`El Banco con el nombre ${nombre} ya existe`)
            }
            //Guardar
            const banco = new Banco(input);
            const resultado = await banco.save();
            return resultado;
        },
        actualizarBanco: async (_, {id, input}) => {
            const {nombre} = input;
            //Verificar si existe
            const existeBanco = await Banco.findById(id);
            if (!existeBanco) {
                throw new Error(`El Banco con el ID ${id} no existe`);
            }
            //Verificar si existe el nombre
            const existeNombreBanco = await Banco.findOne({nombre});
            if (existeNombreBanco) {
                throw new Error(`El Banco con el nombre ${nombre} ya existe`);
            }
            //Actualizar
            const resultado = await Banco.findByIdAndUpdate({_id: id}, input, {new: true});
            return resultado;
        },
        eliminarBanco: async (_, {id}) => {
            //Verificar si existe
            const existeBanco = await Banco.findById(id);
            if (!existeBanco) {
                throw new Error(`El Banco con el ID ${id} no existe`);
            }
            //Eliminar
            await Banco.findByIdAndDelete(id);
            return "Banco eliminado";
        },

        //Sucursales
        nuevaSucursal: async (_, {input}) => {
            const {nombre, direccion, banco} = input;
            //Verificar que no se repita la direccion
            const existeDireccion = await Sucursal.findOne({direccion});
            if (existeDireccion) {
                throw new Error(`La Sucursal con la direccion ${direccion} ya existe`)
            }
            //Verificar que no se repita el nombre de la sucursal en el banco
            const sucursales = await Sucursal.find({banco});
            for (const sucursal of sucursales) {
                if (sucursal.nombre === nombre) {
                    throw new Error(`La Sucursal con el nombre ${nombre} ya existe`)
                }
            }
            //Guardar
            const sucursal = new Sucursal(input);
            const resultado = await sucursal.save();
            return resultado;
        },
        actualizarSucursal: async (_, {id, input}) => {
            const {nombre, direccion, banco} = input;
            //Verificar si existe
            const existeSucursal = await Sucursal.findById(id);
            if (!existeSucursal) {
                throw new Error(`La Sucursal con el ID ${id} no existe`);
            }
            //Actualizar
            const resultado = await Sucursal.findByIdAndUpdate({_id: id}, input, {new: true});
            return resultado;
        },
        eliminarSucursal: async (_, {id}) => {
            //Verificar si existe
            const existeSucursal = await Sucursal.findById(id);
            if (!existeSucursal) {
                throw new Error(`La Sucursal con el ID ${id} no existe`);
            }
            //Eliminar
            await Sucursal.findByIdAndDelete(id);
            return "Sucursal eliminada";
        },

        //Clientes
        nuevoCliente: async (_, {input}, ctx) => {
            const {nombre} = input;
            //Verificar que exista
            const existeCliente = await Cliente.findOne({nombre});
            if (existeCliente) {
                throw new Error(`El Cliente con el nombre ${nombre} ya existe`)
            }
            const nuevoCliente = new Cliente(input);
            //Asignar el Oficial de Credito
            nuevoCliente.oficialDeCredito = ctx.usuario.id;
            //Guardar
            const resultado = await nuevoCliente.save();
            return resultado;
        },
        actualizarCliente: async (_, {id, input}, ctx) => {
            //Verificar si existe
            const existeCliente = await Cliente.findById(id);
            if (!existeCliente) {
                throw new Error(`El Cliente con el ID ${id} no existe.`)
            }
            //Validar credenciales
            if (existeCliente.oficialDeCredito.toString() !== ctx.usuario.id) {
                throw new Error('No tiene las credenciales para realizar esta operación')
            }
            //Actualizar
            const resultado = await Cliente.findByIdAndUpdate({_id: id}, input, {new: true});
            return resultado;
        },
        eliminarCliente: async (_, {id}, ctx) => {
            //Verificar si existe
            const existeCliente = await Cliente.findById(id);
            if (!existeCliente) {
                throw new Error(`El Cliente con el ID ${id} no existe.`)
            }
            //Validar credenciales
            if (existeCliente.oficialDeCredito.toString() !== ctx.usuario.id) {
                throw new Error('No tiene las credenciales para realizar esta operación')
            }
            //Eliminar
            await Cliente.findByIdAndDelete(id);
            return "Cliente eliminado";
        },

        //Cuentas
        nuevaCuenta: async (_, {input}, ctx) => {
            const {numeroCuenta, cliente, saldoCuenta, sucursal} = input;
            //Verificar si existe el Cliente
            const existeCliente = await Cliente.findById(cliente);
            if (!existeCliente) {
                throw new Error(`El Cliente con el ID ${cliente} no existe.`)
            }
            //Verificar si existe la Sucursal
            const existeSucursal = await Sucursal.findById(sucursal);
            if (!existeSucursal) {
                throw new Error(`La Sucursal con el ID ${sucursal} no existe`);
            }
            //Validar Banco
            const banco = await Banco.findById(ctx.usuario.banco);
            if (existeSucursal.banco.toString() !== ctx.usuario.banco) {
                throw new Error(`La Sucursal ${existeSucursal.nombre} no pertenece al banco ${banco.nombre}`)
            }
            //Validar credenciales
            if (existeCliente.oficialDeCredito.toString() !== ctx.usuario.id) {
                throw new Error('No tiene las credenciales para realizar esta operación')
            }
            //Validar numero de cuenta
            const existeNumeroCuenta = await Cuenta.findOne({numeroCuenta});
            if (existeNumeroCuenta) {
                if (existeNumeroCuenta.banco.toString() === existeSucursal.banco.toString()) {
                    throw new Error(`El numero de cuenta ${numeroCuenta} ya existe en el banco`)
                }
            }
            //Validar saldo de cuenta
            if (saldoCuenta < 0) {
                throw new Error(`El saldo de cuenta ${saldoCuenta} no puede ser negativo`)
            }

            //Actualizar Cliente
            const actualizarCliente = await Cliente.findById(cliente);
            actualizarCliente.saldoTotal = actualizarCliente.saldoTotal + saldoCuenta;
            await Cliente.findByIdAndUpdate({_id: cliente}, actualizarCliente, {new: true});
            //Guardar
            const nuevaCuenta = new Cuenta(input);
            nuevaCuenta.banco = ctx.usuario.banco;
            const resultado = await nuevaCuenta.save();
            return resultado;
        },
        actualizarCuenta: async (_, {id, input}, ctx) => {
            const {numeroCuenta, cliente, saldoCuenta, sucursal} = input;
            //Verificar si existe
            const existeCuenta = await Cuenta.findById(id);
            if (!existeCuenta) {
                throw new Error(`La Cuenta con el ID ${id} no existe.`);
            }
            //Verificar si existe el Cliente
            const existeCliente = await Cliente.findById(cliente);
            if (!existeCliente) {
                throw new Error(`El Cliente con el ID ${cliente} no existe.`);
            }
            //Verificar si existe la Sucursal
            const existeSucursal = await Sucursal.findById(sucursal);
            if (!existeSucursal) {
                throw new Error(`La Sucursal con el ID ${sucursal} no existe`);
            }
            //Validar Banco
            const banco = await Banco.findById(ctx.usuario.banco);
            if (existeSucursal.banco.toString() !== ctx.usuario.banco) {
                throw new Error(`La Sucursal ${existeSucursal.nombre} no pertenece al banco ${banco.nombre}`)
            }
            //Validar credenciales
            if (existeCliente.oficialDeCredito.toString() !== ctx.usuario.id) {
                throw new Error('No tiene las credenciales para realizar esta operación')
            }
            //Validar numero de cuenta
            if (numeroCuenta !== existeCuenta.numeroCuenta) {
                const existeNumeroCuenta = await Cuenta.findOne({numeroCuenta});
                if (existeNumeroCuenta) {
                    if (existeNumeroCuenta.banco.toString() === existeSucursal.banco.toString()) {
                        throw new Error(`El numero de cuenta ${numeroCuenta} ya existe en el banco`)
                    }
                }
            }
            //Validar saldo de cuenta
            if (saldoCuenta < 0) {
                throw new Error(`El saldo de cuenta ${saldoCuenta} no puede ser negativo`)
            }

            //Actualizar Cliente
            const diferenciaSaldo = saldoCuenta - existeCuenta.saldoCuenta;
            const actualizarCliente = await Cliente.findById(cliente);
            actualizarCliente.saldoTotal = actualizarCliente.saldoTotal + diferenciaSaldo;
            await Cliente.findByIdAndUpdate({_id: cliente}, actualizarCliente, {new: true});
            //Guardar
            const resultado = await Cuenta.findByIdAndUpdate({_id: id}, input, {new: true});
            return resultado;
        },
        eliminarCuenta: async (_, {id}, ctx) => {
            //Verificar si existe
            let existeCuenta = await Cuenta.findById(id);
            if (!existeCuenta) {
                throw new Error(`La Cuenta con el ID ${id} no existe.`)
            }
            //Validar credenciales
            const cliente = await Cliente.findById(existeCuenta.cliente);
            if (cliente.oficialDeCredito.toString() !== ctx.usuario.id) {
                throw new Error('No tiene las credenciales para realizar esta operación')
            }
            //Eliminar
            await Cuenta.findByIdAndDelete(id);
            return "Cuenta eliminada";
        },

        //Transacciones
        nuevaTransaccion: async (_, {input}, ctx) => {
            const {cuentaOrigen, cuentaDestino, monto} = input;
            //Verificar si existen las cuentas
            const existeCuentaOrigen = await Cuenta.findById(cuentaOrigen);
            if (!existeCuentaOrigen) {
                throw new Error(`La Cuenta de Origen con el ID ${cuentaOrigen} no existe.`);
            }
            const existeCuentaDestino = await Cuenta.findById(cuentaDestino);
            if (!existeCuentaDestino) {
                throw new Error(`La Cuenta de Destino con el ID ${existeCuentaDestino} no existe.`);
            }
            //Verificar credenciales
            const clienteOrigen = await Cliente.findById(existeCuentaOrigen.cliente);
            const clienteDestino = await Cliente.findById(existeCuentaDestino.cliente);
            if (clienteOrigen.oficialDeCredito.toString() !== ctx.usuario.id || clienteDestino.oficialDeCredito.toString() !== ctx.usuario.id) {
                throw new Error('No tiene las credenciales para realizar esta operación')
            }
            //Verificar monto
            if (monto <= 0) {
                throw new Error(`El monto debe ser mayor a cero`);
            }
            if (monto > existeCuentaOrigen.saldoCuenta) {
                throw new Error(`Saldo insuficiente en la cuenta de destino`);
            }
            //Actualizar Cliente
            clienteOrigen.saldoTotal = clienteOrigen.saldoTotal - monto;
            clienteDestino.saldoTotal = clienteDestino.saldoTotal + monto;
            if (clienteOrigen.id !== clienteDestino.id) {
                await Cliente.findByIdAndUpdate({_id: existeCuentaOrigen.cliente}, clienteOrigen, {new: true});
                await Cliente.findByIdAndUpdate({_id: existeCuentaDestino.cliente}, clienteDestino, {new: true});
            }

            //Actualizar Cuenta
            existeCuentaOrigen.saldoCuenta = existeCuentaOrigen.saldoCuenta - monto;
            existeCuentaDestino.saldoCuenta = existeCuentaDestino.saldoCuenta + monto;
            await Cuenta.findByIdAndUpdate({_id: cuentaOrigen}, existeCuentaOrigen, {new: true});
            await Cuenta.findByIdAndUpdate({_id: cuentaDestino}, existeCuentaDestino, {new: true});
            //Guardar
            try {
                const nuevaTransaccion = new Transaccion(input);
                nuevaTransaccion.clienteOrigen = existeCuentaOrigen.cliente;
                nuevaTransaccion.clienteDestino = existeCuentaDestino.cliente;
                nuevaTransaccion.sucursalOrigen = existeCuentaOrigen.sucursal;
                nuevaTransaccion.sucursalDestino = existeCuentaDestino.sucursal;
                nuevaTransaccion.banco = ctx.usuario.banco;
                const resultado = await nuevaTransaccion.save();
                return resultado;
            } catch (e) {
                console.log(e);
            }
        },
        revertirTransaccion: async (_, {id}, ctx) => {
            //Verificar si existe
            const existeTransaccion = await Transaccion.findById(id);
            if (!existeTransaccion) {
                throw new Error(`La Transaccion con el ID ${id} no existe.`)
            }
            //Validar credenciales
            const clienteOrigen = await Cliente.findById(existeTransaccion.clienteOrigen);
            const clienteDestino = await Cliente.findById(existeTransaccion.clienteDestino);
            if (clienteOrigen.oficialDeCredito.toString() !== ctx.usuario.id || clienteDestino.oficialDeCredito.toString() !== ctx.usuario.id) {
                throw new Error('No tiene las credenciales para realizar esta operación')
            }
            //Actualizar Cliente
            clienteOrigen.saldoTotal = clienteOrigen.saldoTotal + existeTransaccion.monto;
            clienteDestino.saldoTotal = clienteDestino.saldoTotal - existeTransaccion.monto;
            if (clienteOrigen.id !== clienteDestino.id) {
                await Cliente.findByIdAndUpdate({_id: existeTransaccion.clienteOrigen}, clienteOrigen, {new: true});
                await Cliente.findByIdAndUpdate({_id: existeTransaccion.clienteDestino}, clienteDestino, {new: true});
            }
            //Actualizar Cuenta
            const cuentaOrigen = await Cuenta.findById(existeTransaccion.cuentaOrigen)
            const cuentaDestino = await Cuenta.findById(existeTransaccion.cuentaDestino)
            cuentaOrigen.saldoCuenta = cuentaOrigen.saldoCuenta + existeTransaccion.monto;
            cuentaDestino.saldoCuenta = cuentaDestino.saldoCuenta - existeTransaccion.monto;
            await Cuenta.findByIdAndUpdate({_id: existeTransaccion.cuentaOrigen}, cuentaOrigen, {new: true});
            await Cuenta.findByIdAndUpdate({_id: existeTransaccion.cuentaDestino}, cuentaDestino, {new: true});
            //Guardar reversion
            try {
                const nuevaTransaccion = new Transaccion();
                nuevaTransaccion.cuentaOrigen = existeTransaccion.cuentaDestino;
                nuevaTransaccion.cuentaDestino = existeTransaccion.cuentaOrigen;
                nuevaTransaccion.monto = existeTransaccion.monto;
                nuevaTransaccion.referencia = "Reversion: " + existeTransaccion.referencia;
                nuevaTransaccion.clienteOrigen = existeTransaccion.clienteDestino;
                nuevaTransaccion.clienteDestino = existeTransaccion.clienteOrigen;
                nuevaTransaccion.sucursalOrigen = existeTransaccion.sucursalDestino;
                nuevaTransaccion.sucursalDestino = existeTransaccion.sucursalOrigen;
                nuevaTransaccion.banco = existeTransaccion.banco;
                const resultado = await nuevaTransaccion.save();
                return resultado;
            } catch (e) {
                console.log(e);
            }
        },

        //Depositos a Plazo Fijo
        nuevoDepositoPlazoFijo: async (_, {input}, ctx) => {
            const {cliente, sucursal, monto} = input;
            //Verificar si existe el Cliente
            const existeCliente = await Cliente.findById(cliente);
            if (!existeCliente) {
                throw new Error(`El Cliente con el ID ${cliente} no existe.`)
            }
            //Verificar si existe la Sucursal
            const existeSucursal = await Sucursal.findById(sucursal);
            if (!existeSucursal) {
                throw new Error(`La Sucursal con el ID ${sucursal} no existe`);
            }
            //Validar banco
            if (existeSucursal.banco.toString() !== ctx.usuario.banco) {
                throw new Error(`La Sucursal ${existeSucursal.nombre} no pertenece al Banco del Oficial`)
            }

            //Validar credenciales
            if (existeCliente.oficialDeCredito.toString() !== ctx.usuario.id) {
                throw new Error('No tiene las credenciales para realizar esta operación')
            }

            //Validar monto
            if (monto < 0) {
                throw new Error('El monto no puede ser negativo')
            }

            const nuevoDeposito = new DepositoPlazoFijo(input);
            //Asignar el Oficial de Credito
            nuevoDeposito.oficialDeCredito = ctx.usuario.id;
            //Guardar
            const resultado = await nuevoDeposito.save();
            return resultado;
        },
        actualizarDepositoPlazoFijo: async (_, {id, input}, ctx) => {
            const {cliente, sucursal, monto} = input;
            //Verificar si existe
            const existeDeposito = await DepositoPlazoFijo.findById(id);
            if (!existeDeposito) {
                throw new Error(`El Deposito a plazo fijo con el ID ${id} no existe.`)
            }
            //Verificar si existe el Cliente
            const existeCliente = await Cliente.findById(cliente);
            if (!existeCliente) {
                throw new Error(`El Cliente con el ID ${cliente} no existe.`)
            }
            //Verificar si existe la Sucursal
            const existeSucursal = await Sucursal.findById(sucursal);
            if (!existeSucursal) {
                throw new Error(`La Sucursal con el ID ${sucursal} no existe`);
            }
            //Validar banco
            if (existeSucursal.banco.toString() !== ctx.usuario.banco) {
                throw new Error(`La Sucursal ${existeSucursal.nombre} no pertenece al Banco del Oficial`)
            }
            //Validar credenciales
            if (existeCliente.oficialDeCredito.toString() !== ctx.usuario.id) {
                throw new Error('No tiene las credenciales para realizar esta operación')
            }
            //Validar monto
            if (monto < 0) {
                throw new Error('El monto no puede ser negativo')
            }
            //Actualizar
            const resultado = await DepositoPlazoFijo.findByIdAndUpdate({_id: id}, input, {new: true});
            return resultado;
        },
        eliminarDepositoPlazoFijo: async (_, {id}, ctx) => {
            //Verificar si existe
            const existeDeposito = await DepositoPlazoFijo.findById(id);
            if (!existeDeposito) {
                throw new Error(`El Deposito a plazo fijo con el ID ${id} no existe.`)
            }
            //Validar credenciales
            const cliente = await Cliente.findById(existeDeposito.cliente);
            if (cliente.oficialDeCredito.toString() !== ctx.usuario.id) {
                throw new Error('No tiene las credenciales para ver esta Cuenta')
            }
            //Eliminar
            await DepositoPlazoFijo.findByIdAndDelete(id);
            return "Deposito a plazo fijo eliminado";
        },

        //Rubros
        nuevoRubro: async (_, {input}, ctx) => {
            const {cliente} = input;
            //Verificar si existe el Cliente
            const existeCliente = await Cliente.findById(cliente);
            if (!existeCliente) {
                throw new Error(`El Cliente con el ID ${cliente} no existe.`)
            }
            //Validar credenciales
            if (existeCliente.oficialDeCredito.toString() !== ctx.usuario.id.toString()) {
                throw new Error(`No tiene las credenciales para ver esta informacion`)
            }
            const nuevoRubro = new Rubro(input);
            //Asignar el Oficial de Credito
            nuevoRubro.oficialDeCredito = ctx.usuario.id.toString();
            //Guardar
            const resultado = await nuevoRubro.save();
            return resultado;
        },
        eliminarRubro: async (_, {id}, ctx) => {
            //Verificar si existe
            const existeRubro = await Rubro.findById(id);
            if (!existeRubro) {
                throw new Error(`El Rubro con el ID ${id} no existe.`)
            }
            //Validar credenciales
            if (existeRubro.oficialDeCredito.toString() !== ctx.usuario.id) {
                throw new Error('No tiene las credenciales para ver esta Cuenta')
            }
            //Eliminar
            await Rubro.findByIdAndDelete(id);
            return "Rubro eliminado";
        }
    }
}

module.exports = resolvers;