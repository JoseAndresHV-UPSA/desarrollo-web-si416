import React, {useEffect, useState, useContext} from "react";
import Layout from "../components/Layout";
import {useFormik} from "formik";
import * as Yup from "yup";
import {gql, useMutation} from "@apollo/client";
import {useRouter} from "next/router";
import Swal from "sweetalert2";
import DataContext from "../context/DataContext";
import AsignarCuentaDestino from "../components/selects/AsignarCuentaDestino";
import AsignarCuentaOrigen from "../components/selects/AsignarCuentaOrigen";
import AsignarCliente from "../components/selects/AsignarCliente";
import AsignarSucursal from "../components/selects/AsignarSucursal";
import Select from "react-select";

const NUEVO_DEPOSITO = gql`
    mutation NuevoDepositoPlazoFijo($input: DepositoPlazoFijoInput) {
        nuevoDepositoPlazoFijo(input: $input) {
            id
            oficialDeCredito
            cliente
            sucursal
            fecha
            plazo
            moneda
            monto
        }
    }
`;

const OBTENER_DEPOSITOS_DTO = gql`
    query ObtenerDepositosPlazoFijoDTO {
        obtenerDepositosPlazoFijoDTO {
            id
            oficialDeCredito
            cliente {
                id
                nombre
            }
            sucursal {
                id
                nombre
            }
            fecha
            plazo
            moneda
            monto
        }
    }
`;

const optionsPlazo = [
    {value: 'MESES_6', label: 'MESES_6'},
    {value: 'MESES_12', label: 'MESES_12'},
    {value: 'MESES_24', label: 'MESES_24'}
]

const optionsMoneda = [
    {value: 'BOL', label: 'BOL'},
    {value: 'USD', label: 'USD'},
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
    const [plazo, setPlazo] = useState([]);
    const seleccionarPlazo = plazo => {
        setPlazo(plazo);
    }
    const [moneda, setMoneda] = useState([]);
    const seleccionarMoneda = moneda => {
        setMoneda(moneda);
    }

    //Mensaje
    const [mensaje, guardarMensaje] = useState(null);

    //Mutation
    const [nuevoDepositoPlazoFijo] = useMutation(NUEVO_DEPOSITO, {
        update(cache, {data: {nuevoDepositoPlazoFijo}}) {
            //Obtener objeto de cache a actualizar
            const {obtenerDepositosPlazoFijoDTO} = cache.readQuery({query: OBTENER_DEPOSITOS_DTO});
            //Reescribir cache
            cache.writeQuery({
                query: OBTENER_DEPOSITOS_DTO,
                data: {
                    obtenerDepositosPlazoFijoDTO: [...obtenerDepositosPlazoFijoDTO, nuevoDepositoPlazoFijo]
                }
            })
        }
    });

    //Validaciones
    const formik = useFormik({
        initialValues: {
            monto: 0,
        },
        validationSchema: Yup.object({
            monto: Yup.number()
                .required("El Monto es obligatorio")
                .min(1, "El Monto debe ser mayor a 0"),
        }),
        onSubmit: async valores => {
            const {monto} = valores;
            try {
                const {data} = await nuevoDepositoPlazoFijo({
                    variables: {
                        input: {
                            cliente: cliente.id,
                            sucursal: sucursal.id,
                            plazo: plazo.value,
                            moneda: moneda.value,
                            monto,
                        }
                    }
                });
                //Alerta
                Swal.fire(
                    'Creado!',
                    'Deposito creado exitosamente',
                    'success'
                );

                //Redireccionar
                router.push("/depositos");

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
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Deposito</h1>
            {mensaje && mostrarMensaje()}

            <div className="flex justify-center mt-5">
                <div className="w-ful max-w-lg">
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="mb-4">
                            <AsignarCliente/>
                        </div>


                        <div className="mb-4">
                            <AsignarSucursal/>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="plazo">
                                Plazo
                            </label>
                            <Select
                                className="mt-2"
                                options={optionsPlazo}
                                onChange={opcion => seleccionarPlazo(opcion)}
                                getOptionValue={option => option.value}
                                getOptionLabel={option => option.label}
                                placeholder="Seleccionar Plazo"
                                noOptionsMessage={() => "No hay resultados"}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="moneda">
                                Moneda
                            </label>
                            <Select
                                className="mt-2"
                                options={optionsMoneda}
                                onChange={opcion => seleccionarMoneda(opcion)}
                                getOptionValue={option => option.value}
                                getOptionLabel={option => option.label}
                                placeholder="Seleccionar Moneda"
                                noOptionsMessage={() => "No hay resultados"}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="monto">
                                Monto
                            </label>
                            <input
                                className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="monto"
                                type="number"
                                placeholder="Monto"
                                value={formik.values.numeroCuenta}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.monto && formik.errors.monto ? (
                            <div className="my-2 bg-red-100 border-l-4 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.monto}</p>
                            </div>
                        ) : null}

                        <input
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                            type="submit"
                            value="Registrar Deposito"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevaCuenta;