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

const NUEVA_TRANSACCION = gql`
    mutation NuevaTransaccion($input: TransaccionInput) {
        nuevaTransaccion(input: $input) {
            id
            cuentaOrigen
            cuentaDestino
            monto
            referencia
            clienteOrigen
            clienteDestino
            sucursalOrigen
            sucursalDestino
            fecha
            banco
        }
    }
`;

const OBTENER_TRANSACCIONES_DTO = gql`
    query ObtenerTransaccionesDTO {
        obtenerTransaccionesDTO {
            id
            cuentaOrigen {
                id
                numeroCuenta
                saldoCuenta
            }
            cuentaDestino {
                id
                numeroCuenta
                saldoCuenta
            }
            monto
            referencia
            clienteOrigen {
                id
                nombre
            }
            clienteDestino {
                id
                nombre
            }
            sucursalOrigen {
                id
                nombre
            }
            sucursalDestino {
                id
                nombre
            }
            banco {
                id
                nombre
            }
            fecha
        }
    }
`;

const NuevaCuenta = () => {
    //Context
    const dataContext = useContext(DataContext);
    const {cuentaOrigen, cuentaDestino} = dataContext;

    const validarSelects = () => {
        return (!cuentaOrigen || !cuentaDestino) ? "opacity-50 cursor-not-allowed" : "";
    }

    const router = useRouter();

    //Mensaje
    const [mensaje, guardarMensaje] = useState(null);

    //Mutation
    const [nuevaTransaccion] = useMutation(NUEVA_TRANSACCION, {
        update(cache, {data: {nuevaTransaccion}}) {
            //Obtener objeto de cache a actualizar
            const {obtenerTransaccionesDTO} = cache.readQuery({query: OBTENER_TRANSACCIONES_DTO});
            //Reescribir cache
            cache.writeQuery({
                query: OBTENER_TRANSACCIONES_DTO,
                data: {
                    obtenerTransaccionesDTO: [...obtenerTransaccionesDTO, nuevaTransaccion]
                }
            })
        }
    });

    //Validaciones
    const formik = useFormik({
        initialValues: {
            monto: 0,
            referencia: "",
        },
        validationSchema: Yup.object({
            monto: Yup.number()
                .required("El Monto es obligatorio")
                .min(1, "El Monto debe ser mayor a 0"),
            referencia: Yup.string()
                .required("La Referencia es obligatorio")
                .min(5, "La Referencia debe tener una longitud mayor a 5"),
        }),
        onSubmit: async valores => {
            const {monto, referencia} = valores;
            try {
                const {data} = await nuevaTransaccion({
                    variables: {
                        input: {
                            cuentaOrigen: cuentaOrigen.id,
                            cuentaDestino: cuentaDestino.id,
                            monto,
                            referencia
                        }
                    }
                });
                //Alerta
                Swal.fire(
                    'Creado!',
                    'Transaccion realizada exitosamente',
                    'success'
                );

                //Redireccionar
                router.push("/transacciones");

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
            <h1 className="text-2xl text-gray-800 font-light">Nueva Transaccion</h1>
            {mensaje && mostrarMensaje()}

            <div className="flex justify-center mt-5">
                <div className="w-ful max-w-lg">
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="mb-4">
                            <AsignarCuentaOrigen/>
                        </div>


                        <div className="mb-4">
                            <AsignarCuentaDestino/>
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

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="referencia">
                                Referencia
                            </label>
                            <input
                                className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="referencia"
                                type="text"
                                placeholder="Referencia"
                                value={formik.values.referencia}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.referencia && formik.errors.referencia ? (
                            <div className="my-2 bg-red-100 border-l-4 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.referencia}</p>
                            </div>
                        ) : null}

                        <input
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                            type="submit"
                            value="Registrar Transaccion"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevaCuenta;