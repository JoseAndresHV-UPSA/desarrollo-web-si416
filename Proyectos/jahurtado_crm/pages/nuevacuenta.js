import React, {useEffect, useState, useContext} from "react";
import Layout from "../components/Layout";
import {useFormik} from "formik";
import * as Yup from "yup";
import {gql, useMutation} from "@apollo/client";
import {useRouter} from "next/router";
import Swal from "sweetalert2";
import Select from 'react-select'
import AsignarCliente from "../components/selects/AsignarCliente";
import AsignarSucursal from "../components/selects/AsignarSucursal";
import DataContext from "../context/DataContext";

const NUEVA_CUENTA = gql`
    mutation NuevaCuenta($input: CuentaInput) {
        nuevaCuenta(input: $input) {
            id
            numeroCuenta
            saldoCuenta
            tipoCuenta
            cliente
            banco
            sucursal
        }
    }
`;

const OBTENER_CUENTAS_DTO = gql`
    query ObtenerCuentasDTOs {
        obtenerCuentasDTOs {
            id
            numeroCuenta
            saldoCuenta
            tipoCuenta
            cliente {
                id
                nombre
            }
            banco {
                id
                nombre
            }
            sucursal {
                id
                nombre
            }
        }
    }
`;

const optionsTipoCuenta = [
    {value: 'CAJA_DE_AHORRO', label: 'CAJA_DE_AHORRO'},
    {value: 'CUENTA_CORRIENTE', label: 'CUENTA_CORRIENTE'},
]

const NuevaCuenta = () => {
    //Context
    const dataContext = useContext(DataContext);
    const {cliente, sucursal} = dataContext;

    const validarSelects = () => {
        return (!cliente || !sucursal) ? "opacity-50 cursor-not-allowed" : "";
    }

    const router = useRouter();

    //Select
    const [tipoCuenta, setTipoCuenta] = useState([]);
    const seleccionarTipoCuenta = tipoCuenta => {
        setTipoCuenta(tipoCuenta);
    }

    //Mensaje
    const [mensaje, guardarMensaje] = useState(null);

    //Mutation
    const [nuevaCuenta] = useMutation(NUEVA_CUENTA, {
        update(cache, {data: {nuevaCuenta}}) {
            //Obtener objeto de cache a actualizar
            const {obtenerCuentasDTOs} = cache.readQuery({query: OBTENER_CUENTAS_DTO});
            //Reescribir cache
            cache.writeQuery({
                query: OBTENER_CUENTAS_DTO,
                data: {
                    obtenerCuentasDTOs: [...obtenerCuentasDTOs, nuevaCuenta]
                }
            })
        }
    });

    //Validaciones
    const formik = useFormik({
        initialValues: {
            numeroCuenta: 0,
            saldoCuenta: 0,
        },
        validationSchema: Yup.object({
            numeroCuenta: Yup.number()
                .required("El Numero Cuenta es obligatorio")
                .min(1, "El Numero Cuenta debe ser mayor a 0")
                .integer("Solo numeros enteros"),
            saldoCuenta: Yup.number()
                .required("La Saldo Cuenta es obligatorio")
                .min(0, "El Saldo Cuenta no puede ser negativo"),
        }),
        onSubmit: async valores => {
            const {numeroCuenta, saldoCuenta} = valores;
            try {
                const {data} = await nuevaCuenta({
                    variables: {
                        input: {
                            numeroCuenta,
                            saldoCuenta,
                            tipoCuenta: tipoCuenta.value,
                            cliente: cliente.id,
                            sucursal: sucursal.id
                        }
                    }
                });
                //Alerta
                Swal.fire(
                    'Creado!',
                    'Cuenta creada exitosamente',
                    'success'
                );

                //Redireccionar
                router.push("/cuentas");

            } catch (e) {
                guardarMensaje(e.message);
                setTimeout(() => {
                    guardarMensaje(null);
                }, 2000);
            }
        }
    });

    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                {mensaje}
            </div>
        );
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Nueva Cuenta</h1>
            {mensaje && mostrarMensaje()}

            <div className="flex justify-center mt-5">
                <div className="w-ful max-w-lg">
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numeroCuenta">
                                Numero Cuenta
                            </label>
                            <input
                                className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="numeroCuenta"
                                type="number"
                                placeholder="Numero Cuenta"
                                value={formik.values.numeroCuenta}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.numeroCuenta && formik.errors.numeroCuenta ? (
                            <div className="my-2 bg-red-100 border-l-4 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.numeroCuenta}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="saldoCuenta">
                                Saldo Cuenta
                            </label>
                            <input
                                className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="saldoCuenta"
                                type="number"
                                placeholder="Saldo Cuenta"
                                value={formik.values.saldoCuenta}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.saldoCuenta && formik.errors.saldoCuenta ? (
                            <div className="my-2 bg-red-100 border-l-4 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.saldoCuenta}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tipoCliente">
                                Tipo Cuenta
                            </label>
                            <Select
                                className="mt-2"
                                options={optionsTipoCuenta}
                                onChange={opcion => seleccionarTipoCuenta(opcion)}
                                getOptionValue={option => option.value}
                                getOptionLabel={option => option.label}
                                placeholder="Seleccionar Tipo Cuenta"
                                noOptionsMessage={() => "No hay resultados"}
                            />
                        </div>

                        <div className="mb-4">
                            <AsignarCliente/>
                        </div>

                        <div className="mb-4">
                            <AsignarSucursal/>
                        </div>

                        <input
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                            type="submit"
                            value="Registrar Cuenta"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevaCuenta;