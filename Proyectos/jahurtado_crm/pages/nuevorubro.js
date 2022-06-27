import React, {useEffect, useState, useContext} from "react";
import Layout from "../components/Layout";
import {useFormik} from "formik";
import * as Yup from "yup";
import {gql, useMutation} from "@apollo/client";
import {useRouter} from "next/router";
import Swal from "sweetalert2";
import Select from 'react-select'
import DataContext from "../context/DataContext";
import AsignarCliente from "../components/selects/AsignarCliente";

const NUEVO_RUBRO = gql`
    mutation NuevoRubro($input: RubroInput) {
        nuevoRubro(input: $input) {
            id
            cliente
            oficialDeCredito
            tipoRubro
            descripcion
        }
    }
`;

const OBTENER_RUBROS = gql`
    query ObtenerRubros {
        obtenerRubros {
            id
            cliente {
                id
                nombre
            }
            oficialDeCredito {
                id
                nombre
                apellido
            }
            tipoRubro
            descripcion
        }
    }
`;

const optionsTipoRubro = [
    {value: 'COMERCIAL', label: 'COMERCIAL'},
    {value: 'INDUSTRIAL', label: 'INDUSTRIAL'},
    {value: 'EDUCACION', label: 'EDUCACION'}
]

const NuevoRubro = () => {
    //Context
    const dataContext = useContext(DataContext);
    const {cliente} = dataContext;

    const validarSelects = () => {
        return (!cliente) ? "opacity-50 cursor-not-allowed" : "";
    }

    const router = useRouter();

    //Select
    const [tipoRubro, setTipoRubro] = useState([]);
    const seleccionarTipoRubro = tipoRubro => {
        setTipoRubro(tipoRubro);
    }

    //Mensaje
    const [mensaje, guardarMensaje] = useState(null);

    //Mutation
    const [nuevoRubro] = useMutation(NUEVO_RUBRO, {
        update(cache, {data: {nuevoRubro}}) {
            //Obtener objeto de cache a actualizar
            const {obtenerRubros} = cache.readQuery({query: OBTENER_RUBROS});
            //Reescribir cache
            cache.writeQuery({
                query: OBTENER_RUBROS,
                data: {
                    obtenerRubros: [...obtenerRubros, nuevoRubro]
                }
            })
        }
    });

    //Validaciones
    const formik = useFormik({
        initialValues: {
            descripcion: ""
        },
        validationSchema: Yup.object({
            descripcion: Yup.string()
                .required("La Descripcion es obligatoria"),
        }),
        onSubmit: async valores => {
            const {descripcion} = valores;
            try {
                const {data} = await nuevoRubro({
                    variables: {
                        input: {
                            cliente: cliente.id,
                            tipoRubro: tipoRubro.value,
                            descripcion,
                        }
                    }
                });
                //Alerta
                Swal.fire(
                    'Creado!',
                    'Rubro creado exitosamente',
                    'success'
                );

                //Redireccionar
                router.push("/rubros");

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
                {mensaje} -
                <span className="font-bold">Campos no seleccionados</span>
            </div>
        );
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Rubro</h1>
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
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tipoRubro">
                                Tipo Rubro
                            </label>
                            <Select
                                className="mt-2"
                                options={optionsTipoRubro}
                                onChange={opcion => seleccionarTipoRubro(opcion)}
                                getOptionValue={option => option.value}
                                getOptionLabel={option => option.label}
                                placeholder="Seleccionar Tipo Rubro"
                                noOptionsMessage={() => "No hay resultados"}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="">
                                Descripcion
                            </label>
                            <input
                                className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="descripcion"
                                type="text"
                                placeholder="Descripcion"
                                value={formik.values.descripcion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.descripcion && formik.errors.descripcion ? (
                            <div className="my-2 bg-red-100 border-l-4 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.descripcion}</p>
                            </div>
                        ) : null}

                        <input
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                            type="submit"
                            value="Registrar Rubro"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoRubro;