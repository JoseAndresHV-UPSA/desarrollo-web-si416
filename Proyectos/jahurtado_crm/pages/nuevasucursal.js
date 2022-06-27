import React, {useState, useContext} from "react";
import Layout from "../components/Layout";
import {useFormik} from "formik";
import * as Yup from "yup";
import {gql, useMutation} from "@apollo/client";
import {useRouter} from "next/router";
import Swal from "sweetalert2";
import AsignarBanco from "../components/selects/AsignarBanco";

import DataContext from "../context/DataContext";


const NUEVA_SUCURSAL = gql`
    mutation NuevaSucursal($input: SucursalInput) {
        nuevaSucursal(input: $input) {
            id
            nombre
            direccion
            banco
        }
    }
`;

const OBTENER_SUCURSALES_BANCO = gql`
    query ObtenerSucursalesBanco {
        obtenerSucursalesBanco {
            id
            nombre
            direccion
            banco
        }
    }
`;

const NuevaSucursal = () => {
    //Context
    const dataContext = useContext(DataContext);
    const {banco} = dataContext;

    const validarBanco = () => {
        return (!banco) ? "opacity-50 cursor-not-allowed" : "";
    }

    const router = useRouter();

    //Mensaje
    const [mensaje, guardarMensaje] = useState(null);

    //Mutation
    const [nuevaSucursal] = useMutation(NUEVA_SUCURSAL, {
        update(cache, {data: {nuevaSucursal}}) {
            //Obtener objeto de cache a actualizar
            const {obtenerSucursalesBanco} = cache.readQuery({query: OBTENER_SUCURSALES_BANCO});
            //Reescribir cache
            cache.writeQuery({
                query: OBTENER_SUCURSALES_BANCO,
                data: {
                    obtenerSucursalesBanco: [...obtenerSucursalesBanco, nuevaSucursal]
                }
            })
        }
    });

    //Validaciones
    const formik = useFormik({
        initialValues: {
            nombre: "",
            direccion: "",
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .required("El Nombre es obligatorio"),
        }),
        onSubmit: async valores => {
            const {nombre, direccion} = valores;
            try {
                const {data} = await nuevaSucursal({
                    variables: {
                        input: {
                            nombre,
                            direccion,
                            banco: banco.id
                        }
                    }
                });

                //Alerta
                Swal.fire(
                    'Creado!',
                    'Sucursal creado exitosamente',
                    'success'
                );

                //Redireccionar
                router.push("/sucursales");

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
            <h1 className="text-2xl text-gray-800 font-light">Nueva Sucursal</h1>
            {mensaje && mostrarMensaje()}

            <div className="flex justify-center mt-5">
                <div className="w-ful max-w-lg">
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                Nombre
                            </label>
                            <input
                                className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="nombre"
                                type="text"
                                placeholder="Nombre Sucursal"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.nombre && formik.errors.nombre ? (
                            <div className="my-2 bg-red-100 border-l-4 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.nombre}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="direccion">
                                Direccion
                            </label>
                            <input
                                className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="direccion"
                                type="text"
                                placeholder="Direccion Cliente"
                                value={formik.values.direccion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.direccion && formik.errors.direccion ? (
                            <div className="my-2 bg-red-100 border-l-4 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.direccion}</p>
                            </div>
                        ) : null}


                        <AsignarBanco/>

                        <input
                            className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarBanco()}`}
                            type="submit"
                            value="Registrar Sucursal"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevaSucursal;