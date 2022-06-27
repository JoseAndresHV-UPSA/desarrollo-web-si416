import React, {useState} from "react";
import {useRouter} from "next/router";
import Layout from "../../components/Layout";
import {gql, useQuery, useMutation} from "@apollo/client";
import {Formik} from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import Select from "react-select";

const OBTENER_CUENTA_DTO = gql`
    query ObtenerCuentaDTO($obtenerCuentaDtoId: ID!) {
        obtenerCuentaDTO(id: $obtenerCuentaDtoId) {
            id
            numeroCuenta
            saldoCuenta
            tipoCuenta
            cliente {
                id
                nombre
            }
            banco {
                id
                nombre
            }
            sucursal {
                id
                nombre
            }
        }
    }
`;

const ACTUALIZAR_CUENTA = gql`
    mutation ActualizarCuenta($actualizarCuentaId: ID!, $input: CuentaInput) {
        actualizarCuenta(id: $actualizarCuentaId, input: $input) {
            id
            numeroCuenta
            saldoCuenta
            tipoCuenta
            cliente
            banco
            sucursal
        }
    }
`;

const optionsTipoCuenta = [
    {value: 'CAJA_DE_AHORRO', label: 'CAJA_DE_AHORRO'},
    {value: 'CUENTA_CORRIENTE', label: 'CUENTA_CORRIENTE'},
]

const EditarCuenta = () => {
    //Obtener ID
    const router = useRouter();
    const {query: {id}} = router;

    //Consulta
    const {data, loading, error} = useQuery(OBTENER_CUENTA_DTO, {
        variables: {
            obtenerCuentaDtoId: id
        }
    });

    //Select
    const [tipoCuenta, setTipoCuenta] = useState([]);
    const seleccionarTipoCuenta = tipoCuenta => {
        setTipoCuenta(tipoCuenta);
    }

    //Mutation
    const [actualizarCuenta] = useMutation(ACTUALIZAR_CUENTA);

    if (loading) return "Cargando...";
    if (!data) return "Accion no permitida";

    const {obtenerCuentaDTO} = data;

    //Modificar
    const actualizarInfoCuenta = async valores => {
        const {numeroCuenta, saldoCuenta} = valores;

        try {
            const {data} = await actualizarCuenta({
                variables: {
                    actualizarCuentaId: id,
                    input: {
                        numeroCuenta,
                        saldoCuenta,
                        tipoCuenta: tipoCuenta.value,
                        cliente: obtenerCuentaDTO.cliente.id,
                        sucursal: obtenerCuentaDTO.sucursal.id
                    }
                }
            });
            //Alerta
            Swal.fire(
                'Actualizado',
                'Cuenta actualizada correctamente',
                'success'
            );
            //Redirecciones
            router.push("/cuentas")

        } catch (e) {
            console.log(e);
        }
    }

    //Schema de Validacion
    const validationSchema = Yup.object({
        numeroCuenta: Yup.number()
            .required("El Numero Cuenta es obligatorio")
            .positive("No se acepta numeros negativos")
            .integer("Solo numeros enteros"),
        saldoCuenta: Yup.number()
            .required("La Saldo Cuenta es obligatorio")
            .positive("No se acepta numeros negativos"),
    })


    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Sucursal</h1>

            <div className="flex justify-center mt-5">
                <div className="w-ful max-w-lg">

                    <Formik
                        validationSchema={validationSchema}
                        enableReinitialize
                        initialValues={obtenerCuentaDTO}
                        onSubmit={(valores) => {
                            actualizarInfoCuenta(valores);
                        }}
                    >
                        {props => {
                            return (
                                <form
                                    className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                    onSubmit={props.handleSubmit}
                                >
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numeroCuenta">
                                            Numero Cuenta
                                        </label>
                                        <input
                                            className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="numeroCuenta"
                                            type="number"
                                            placeholder="Numero Cuenta"
                                            value={props.values.numeroCuenta}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.numeroCuenta && props.errors.numeroCuenta ? (
                                        <div className="my-2 bg-red-100 border-l-4 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.numeroCuenta}</p>
                                        </div>
                                    ) : null}

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="saldoCuenta">
                                            Saldo Cuenta
                                        </label>
                                        <input
                                            className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="saldoCuenta"
                                            type="number"
                                            placeholder="Saldo Cuenta"
                                            value={props.values.saldoCuenta}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.saldoCuenta && props.errors.saldoCuenta ? (
                                        <div className="my-2 bg-red-100 border-l-4 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.saldoCuenta}</p>
                                        </div>
                                    ) : null}

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tipoCliente">
                                            Tipo Cuenta
                                        </label>
                                        <Select
                                            className="mt-2"
                                            options={optionsTipoCuenta}
                                            onChange={opcion => seleccionarTipoCuenta(opcion)}
                                            defaultValue={optionsTipoCuenta.find(x => x.value === obtenerCuentaDTO.tipoCuenta)}
                                            getOptionValue={option => option.value}
                                            getOptionLabel={option => option.label}
                                            placeholder="Seleccionar Tipo Cuenta"
                                            noOptionsMessage={() => "No hay resultados"}
                                        />
                                    </div>

                                    <input
                                        className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                        type="submit"
                                        value="Editar Cuenta"
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

export default EditarCuenta;