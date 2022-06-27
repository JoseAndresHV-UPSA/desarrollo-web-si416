import React, {useState} from "react";
import Layout from "../components/Layout";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useMutation, gql} from "@apollo/client";
import {useRouter} from "next/router";
import Link from "next/link";

const AUTENTICAR_USUARIO = gql`
    mutation AutenticarUsuario($input: AutenticarInput) {
        autenticarUsuario(input: $input) {
            token
        }
    }
`;

const Login = () => {
    //Routing
    const router = useRouter();

    //State para el mensaje
    const [mensaje, guardarMensaje] = useState(null);

    //Mutation para autenticar usuario
    const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

    //Validacion del formulario
    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("El Email no es valido")
                .required("El Email es obligatorio"),
            password: Yup.string()
                .required("La Password es obligatorio")
        }),
        onSubmit: async valores => {
            const {email, password} = valores;
            try {
                const {data} = await autenticarUsuario({
                   variables: {
                       input: {
                           email,
                           password
                       }
                   }
                });
                //Mensaje
                guardarMensaje("Autenticando...");
                //Guardar token
                const {token} = data.autenticarUsuario;
                localStorage.setItem("token", token);
                //Redirigir
                setTimeout(() => {
                    guardarMensaje(null);
                    router.push("/");
                }, 2000);
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
                <h1 className="text-center text-2xl text-white font-light">Login</h1>
                {mensaje && mostrarMensaje()}

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form
                            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                            onSubmit={formik.handleSubmit}
                        >
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

                            <div className="flex justify-content-center">
                                <Link href="/nuevousuario">
                                    <a className="text-gray-700 font-bold mx-auto my-2 underline underline-offset-1">
                                        Crear un nuevo usuario
                                    </a>
                                </Link>
                            </div>


                            <input
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                type="submit"
                                value="Iniciar Sesion"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default Login;