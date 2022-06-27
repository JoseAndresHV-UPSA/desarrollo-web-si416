import React from "react";
import {useRouter} from "next/router";
import Layout from "../../components/Layout";
import {gql, useQuery, useMutation} from "@apollo/client";
import {Formik} from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {useState} from "@types/react";

const OBTENER_BANCO_POR_ID = gql`
    query ObtenerBancoPorID($obtenerBancoPorIdId: ID!) {
        obtenerBancoPorID(id: $obtenerBancoPorIdId) {
            id
            nombre
        }
    }
`;

const ACTUALIZAR_BANCO = gql`
    mutation ActualizarBanco($actualizarBancoId: ID!, $input: BancoInput) {
        actualizarBanco(id: $actualizarBancoId, input: $input) {
            id
            nombre
        }
    }
`;

const EditarBanco = () => {
    //Obtener ID
    const router = useRouter();
    const {query: {id}} = router;

    //Consulta
    const {data, loading, error} = useQuery(OBTENER_BANCO_POR_ID, {
        variables: {
            obtenerBancoPorIdId: id
        }
    });

    //Mutation
    const [actualizarBanco] = useMutation(ACTUALIZAR_BANCO);

    if (loading) return "Cargando...";
    if (!data) return "Accion no permitida";

    const {obtenerBancoPorID} = data;

    //Modificar
    const actualizarInfoBanco = async valores => {
        const {nombre} = valores;

        try {
            const {data} = await actualizarBanco({
                variables: {
                    actualizarBancoId: id,
                    input: {
                        nombre,
                    }
                }
            });
            //Alerta
            Swal.fire(
                'Actualizado',
                'Banco actualizado correctamente',
                'success'
            );
            //Redirecciones
            router.push("/bancos")

        } catch (e) {
            console.log(e);
        }
    }

    //Schema de Validacion
    const validationSchema = Yup.object({
        nombre: Yup.string()
            .required("El Nombre es obligatorio"),
    })


    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Banco</h1>
            {/*{mensaje && mostrarMensaje()}*/}

            <div className="flex justify-center mt-5">
                <div className="w-ful max-w-lg">

                    <Formik
                        validationSchema={validationSchema}
                        enableReinitialize
                        initialValues={obtenerBancoPorID}
                        onSubmit={(valores) => {
                            actualizarInfoBanco(valores);
                        }}
                    >
                        {props => {
                            return (
                                <form
                                    className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                    onSubmit={props.handleSubmit}
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
                                            value={props.values.nombre}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.nombre && props.errors.nombre ? (
                                        <div className="my-2 bg-red-100 border-l-4 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.nombre}</p>
                                        </div>
                                    ) : null}

                                    <input
                                        className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                        type="submit"
                                        value="Editar Banco"
                                    />
                                </form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </Layout>
    );

}

export default EditarBanco;