import React, {useContext, useState} from "react";
import {useRouter} from "next/router";
import Layout from "../components/Layout";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useMutation, gql} from "@apollo/client";
import AsignarBanco from "../components/selects/AsignarBanco";
import DataContext from "../context/DataContext";

const NUEVO_USUARIO = gql`
    mutation NuevoUsuario($input: UsuarioInput) {
        nuevoUsuario(input: $input) {
            id
            nombre
            apellido
            email
            creado
            banco
        }
    }
`;

const NuevoUsuario = () => {
    //Context
    const dataContext = useContext(DataContext);
    const {banco} = dataContext;

    const validarBanco = () => {
        return (!banco) ? "opacity-50 cursor-not-allowed" : "";
    }

    //State para el mensaje
    const [mensaje, guardarMensaje] = useState(null);

    //Mututation para crear nuevos usuarios
    const [nuevoUsuario] = useMutation(NUEVO_USUARIO);

    //Routing
    const router = useRouter();

    //Validacion del formulario
    const formik = useFormik({
        initialValues: {
            nombre: "",
            apellido: "",
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .required("El Nombre es obligatorio"),
            apellido: Yup.string()
                .required("El Apellido es obligatorio"),
            email: Yup.string()
                .email("El Email no es valido")
                .required("El Email es obligatorio"),
            password: Yup.string()
                .required("La Password es obligatoria")
                .min(6, "La Password debe ser de al menos 6 caracteres"),
        }),
        onSubmit: async valores => {
            const {nombre, apellido, email, password} = valores;

            try {
                const {data} = await nuevoUsuario({
                   variables: {
                       input: {
                           nombre,
                           apellido,
                           email,
                           password,
                           banco: banco.id
                       }
                   }
                });
                //Mensaje
                guardarMensaje("Usuario creado correctamente");
                //Redirigir
                setTimeout(() => {
                    guardarMensaje(null);
                    router.push("/login");
                }, 3000);

            } catch (e) {
                guardarMensaje(e.message);
                setTimeout(() => {
                    guardarMensaje(null);
                }, 3000);
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
        <>
            <Layout>
                <h1 className="text-center text-2xl text-white font-light">Crear Nuevo Usuario</h1>
                {mensaje && mostrarMensaje()}

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form
                            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
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
                                    placeholder="Nombre Usuario"
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                    Apellido
                                </label>
                                <input
                                    className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="apellido"
                                    type="text"
                                    placeholder="Apellido Usuario"
                                    value={formik.values.apellido}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.apellido && formik.errors.apellido ? (
                                <div className="my-2 bg-red-100 border-l-4 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.apellido}</p>
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="Email Usuario"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.email && formik.errors.email ? (
                                <div className="my-2 bg-red-100 border-l-4 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.email}</p>
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    placeholder="Password Usuario"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.password && formik.errors.password ? (
                                <div className="my-2 bg-red-100 border-l-4 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.password}</p>
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <AsignarBanco/>
                            </div>

                            <input
                                className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarBanco()}`}
                                type="submit"
                                value="Crear Nuevo Usuario"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default NuevoUsuario;