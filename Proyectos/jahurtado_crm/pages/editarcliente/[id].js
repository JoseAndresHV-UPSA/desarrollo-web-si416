import React, {useState} from "react";
import {useRouter} from "next/router";
import Layout from "../../components/Layout";
import {gql, useQuery, useMutation} from "@apollo/client";
import {Formik} from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import Select from "react-select";

const OBTENER_CLIENTE_POR_ID = gql`
    query ObtenerClientePorID($obtenerClientePorIdId: ID!) {
        obtenerClientePorID(id: $obtenerClientePorIdId) {
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

const ACTUALIZAR_CLIENTE = gql`
    mutation ActualizarCliente($actualizarClienteId: ID!, $input: ClienteInput) {
        actualizarCliente(id: $actualizarClienteId, input: $input) {
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

const EditarCliente = () => {
    //Obtener ID
    const router = useRouter();
    const {query: {id}} = router;

    //Consulta
    const {data, loading, error} = useQuery(OBTENER_CLIENTE_POR_ID, {
        variables: {
            obtenerClientePorIdId: id
        }
    });

    //Select
    const [tipoCliente, setTipoCliente] = useState([]);
    const seleccionarTipoCliente = tipoCliente => {
        setTipoCliente(tipoCliente);
    }

    //Mutation
    const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);

    if (loading) return "Cargando...";
    if (!data) return "Accion no permitida";

    const {obtenerClientePorID} = data;

    //Modifica el cliente
    const actualizarInfoCliente = async valores => {
        const {nombre, direccion, telefono} = valores;

        try {
            const {data} = await actualizarCliente({
                variables: {
                    actualizarClienteId: id,
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
                'Actualizado',
                'Cliente actualizado correctamente',
                'success'
            );
            //Redirecciones
            router.push("/")

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
            <h1 className="text-2xl text-gray-800 font-light">Editar Cliente</h1>

            <div className="flex justify-center mt-5">
                <div className="w-ful max-w-lg">

                    <Formik
                        validationSchema={validationSchema}
                        enableReinitialize
                        initialValues={obtenerClientePorID}
                        onSubmit={(valores) => {
                            actualizarInfoCliente(valores);
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
                                        <label className="block text-gray-700 text-sm font-bold mb-2"
                                               htmlFor="direccion">
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

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2"
                                               htmlFor="telefono">
                                            Telefono
                                        </label>
                                        <input
                                            className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="telefono"
                                            type="tel"
                                            placeholder="Telefono Cliente"
                                            value={props.values.telefono}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.telefono && props.errors.telefono ? (
                                        <div className="my-2 bg-red-100 border-l-4 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.telefono}</p>
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
                                            defaultValue={optionsTipoCliente.find(x => x.value === obtenerClientePorID.tipoCliente)}
                                            getOptionValue={option => option.value}
                                            getOptionLabel={option => option.label}
                                            placeholder="Seleccionar Tipo Cliente"
                                            noOptionsMessage={() => "No hay resultados"}
                                        />
                                    </div>

                                    <input
                                        className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                        type="submit"
                                        value="Editar Cliente"
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

export default EditarCliente;