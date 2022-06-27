import React, {useEffect, useState} from "react";
import Layout from "../components/Layout";
import {useFormik} from "formik";
import * as Yup from "yup";
import {gql, useMutation} from "@apollo/client";
import {useRouter} from "next/router";
import Swal from "sweetalert2";
import Select from 'react-select'

const NUEVO_CLIENTE = gql`
    mutation NuevoCliente($input: ClienteInput) {
        nuevoCliente(input: $input) {
            id
            nombre
            direccion
            telefono
            saldoTotal
            tipoCliente
        }
    }
`;

const OBTENER_CLIENTES_OFICIAL_DE_CREDITO = gql`
    query ObtenerClientesOficialDeCredito {
        obtenerClientesOficialDeCredito {
            id
            nombre
            direccion
            telefono
            saldoTotal
            tipoCliente
            oficialDeCredito
        }
    }
`;

const optionsTipoCliente = [
    {value: 'CATEGORIA_A', label: 'CATEGORIA_A'},
    {value: 'CATEGORIA_B', label: 'CATEGORIA_B'},
    {value: 'CATEGORIA_C', label: 'CATEGORIA_C'}
]

const NuevoCliente = () => {
    const router = useRouter();

    //Select
    const [tipoCliente, setTipoCliente] = useState([]);
    const seleccionarTipoCliente = tipoCliente => {
        setTipoCliente(tipoCliente);
    }

    //Mensaje
    const [mensaje, guardarMensaje] = useState(null);

    //Mutation
    const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
        update(cache, {data: {nuevoCliente}}) {
            //Obtener objeto de cache a actualizar
            const {obtenerClientesOficialDeCredito} = cache.readQuery({query: OBTENER_CLIENTES_OFICIAL_DE_CREDITO});
            //Reescribir cache
            cache.writeQuery({
                query: OBTENER_CLIENTES_OFICIAL_DE_CREDITO,
                data: {
                    obtenerClientesOficialDeCredito: [...obtenerClientesOficialDeCredito, nuevoCliente]
                }
            })
        }
    });

    //Validaciones
    const formik = useFormik({
        initialValues: {
            nombre: "",
            direccion: "",
            telefono: "",
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .required("El Nombre es obligatorio"),
        }),
        onSubmit: async valores => {
            const {nombre, direccion, telefono} = valores;
            try {
                const {data} = await nuevoCliente({
                    variables: {
                        input: {
                            nombre,
                            direccion,
                            telefono,
                            tipoCliente: tipoCliente.value
                        }
                    }
                });
                //Alerta
                Swal.fire(
                    'Creado!',
                    'Cliente creado exitosamente',
                    'success'
                );

                //Redireccionar
                router.push("/");

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
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Cliente</h1>
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
                                placeholder="Nombre Cliente"
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

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                                Telefono
                            </label>
                            <input
                                className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="telefono"
                                type="tel"
                                placeholder="Telefono Cliente"
                                value={formik.values.telefono}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.telefono && formik.errors.telefono ? (
                            <div className="my-2 bg-red-100 border-l-4 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.telefono}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tipoCliente">
                                Tipo Cliente
                            </label>
                            <Select
                                className="mt-2"
                                options={optionsTipoCliente}
                                onChange={opcion => seleccionarTipoCliente(opcion)}
                                getOptionValue={option => option.value}
                                getOptionLabel={option => option.label}
                                placeholder="Seleccionar Tipo Cliente"
                                noOptionsMessage={() => "No hay resultados"}
                            />
                        </div>

                        <input
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                            type="submit"
                            value="Registrar Cliente"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoCliente;