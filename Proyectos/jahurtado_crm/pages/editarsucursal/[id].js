import React from "react";
import {useRouter} from "next/router";
import Layout from "../../components/Layout";
import {gql, useQuery, useMutation} from "@apollo/client";
import {Formik} from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const OBTENER_SUCURSAL_POR_ID = gql`
    query ObtenerSucursalPorID($obtenerSucursalPorIdId: ID!) {
        obtenerSucursalPorID(id: $obtenerSucursalPorIdId) {
            id
            nombre
            direccion
            banco
        }
    }
`;

const ACTUALIZAR_SUCURSAL = gql`
    mutation ActualizarSucursal($actualizarSucursalId: ID!, $input: SucursalInput) {
        actualizarSucursal(id: $actualizarSucursalId, input: $input) {
            id
            nombre
            direccion
            banco
        }
    }
`;

const EditarSucursal = () => {
    //Obtener ID
    const router = useRouter();
    const {query: {id}} = router;

    //Consulta
    const {data, loading, error} = useQuery(OBTENER_SUCURSAL_POR_ID, {
        variables: {
            obtenerSucursalPorIdId: id
        }
    });

    //Mutation
    const [actualizarSucursal] = useMutation(ACTUALIZAR_SUCURSAL);

    if (loading) return "Cargando...";
    if (!data) return "Accion no permitida";

    const {obtenerSucursalPorID} = data;

    //Modificar
    const actualizarInfoSucursal = async valores => {
        const {nombre, direccion, banco} = valores;

        try {
            const {data} = await actualizarSucursal({
                variables: {
                    actualizarSucursalId: id,
                    input: {
                        nombre,
                        direccion,
                        banco: obtenerSucursalPorID.banco
                    }
                }
            });
            //Alerta
            Swal.fire(
                'Actualizado',
                'Sucursal actualizada correctamente',
                'success'
            );
            //Redirecciones
            router.push("/sucursales")

        } catch (e) {
            console.log(e);
        }
    }

    //Schema de Validacion
    const validationSchema = Yup.object({
        nombre: Yup.string()
            .required("El Nombre es obligatorio"),
        direccion: Yup.string()
            .required("La Direccion es obligatoria"),
    })


    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Sucursal</h1>

            <div className="flex justify-center mt-5">
                <div className="w-ful max-w-lg">

                    <Formik
                        validationSchema={validationSchema}
                        enableReinitialize
                        initialValues={obtenerSucursalPorID}
                        onSubmit={(valores) => {
                            actualizarInfoSucursal(valores);
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

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="direccion">
                                            Direccion
                                        </label>
                                        <input
                                            className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="direccion"
                                            type="text"
                                            placeholder="Direccion Cliente"
                                            value={props.values.direccion}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.direccion && props.errors.direccion ? (
                                        <div className="my-2 bg-red-100 border-l-4 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.direccion}</p>
                                        </div>
                                    ) : null}

                                    <input
                                        className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                        type="submit"
                                        value="Editar Sucursal"
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

export default EditarSucursal;