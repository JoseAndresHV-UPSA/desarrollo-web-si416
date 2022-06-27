import React, {useState} from "react";
import Layout from "../components/Layout";
import {useFormik} from "formik";
import * as Yup from "yup";
import {gql, useMutation} from "@apollo/client";
import {useRouter} from "next/router";
import Swal from "sweetalert2";

const NUEVO_BANCO = gql`
    mutation NuevoBanco($input: BancoInput) {
        nuevoBanco(input: $input) {
            id
            nombre
        }
    }
`;

const OBTENER_BANCOS = gql`
    query ObtenerBancos {
        obtenerBancos {
            id
            nombre
        }
    }
`;

const NuevoBanco = () => {
    const router = useRouter();

    //Mensaje
    const [mensaje, guardarMensaje] = useState(null);

    //Mutation
    const [nuevoBanco] = useMutation(NUEVO_BANCO, {
        update(cache, {data: {nuevoBanco}}) {
            //Obtener objeto de cache a actualizar
            const {obtenerBancos} = cache.readQuery({query: OBTENER_BANCOS});
            //Reescribir cache
            cache.writeQuery({
                query: OBTENER_BANCOS,
                data: {
                    obtenerBancos: [...obtenerBancos, nuevoBanco]
                }
            })
        }
    });

    //Validaciones
    const formik = useFormik({
        initialValues: {
            nombre: "",
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .required("El Nombre es obligatorio"),
        }),
        onSubmit: async valores => {
            const {nombre} = valores;
            try {
                const {data} = await nuevoBanco({
                    variables: {
                        input: {
                            nombre,
                        }
                    }
                });

                //Alerta
                Swal.fire(
                    'Creado!',
                    'Banco creado exitosamente',
                    'success'
                );

                //Redireccionar
                router.push("/bancos");

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
                                placeholder="Nombre Banco"
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

                        <input
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                            type="submit"
                            value="Registrar Banco"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoBanco;