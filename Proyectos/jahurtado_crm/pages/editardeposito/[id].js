import React, {useState, useContext} from "react";
import {useRouter} from "next/router";
import Layout from "../../components/Layout";
import {gql, useQuery, useMutation} from "@apollo/client";
import {Formik} from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import Select from "react-select";
import DataContext from "../../context/DataContext";
import AsignarCliente from "../../components/selects/AsignarCliente";
import AsignarSucursal from "../../components/selects/AsignarSucursal";

const OBTENER_DEPOSITO_DTO = gql`
    query ObtenerDepositoPlazoFijoDTO($obtenerDepositoPlazoFijoDtoId: ID!) {
        obtenerDepositoPlazoFijoDTO(id: $obtenerDepositoPlazoFijoDtoId) {
            id
            oficialDeCredito
            cliente {
                id
                nombre
            }
            sucursal {
                id
                nombre
            }
            fecha
            plazo
            moneda
            monto
        }
    }
`;

const ACTUALIZAR_DEPOSITO = gql`
    mutation ActualizarDepositoPlazoFijo($actualizarDepositoPlazoFijoId: ID!, $input: DepositoPlazoFijoInput) {
        actualizarDepositoPlazoFijo(id: $actualizarDepositoPlazoFijoId, input: $input) {
            id
            oficialDeCredito
            cliente
            sucursal
            fecha
            plazo
            moneda
            monto
        }
    }
`;

const optionsPlazo = [
    {value: 'MESES_6', label: 'MESES_6'},
    {value: 'MESES_12', label: 'MESES_12'},
    {value: 'MESES_24', label: 'MESES_24'}
]

const optionsMoneda = [
    {value: 'BOL', label: 'BOL'},
    {value: 'USD', label: 'USD'},
]

const EditarDeposito = () => {
    //Context
    const dataContext = useContext(DataContext);
    const {cliente, sucursal} = dataContext;

    const validarSelects = () => {
        return (!cliente || !sucursal) ? "opacity-50 cursor-not-allowed" : "";
    }

    //Obtener ID
    const router = useRouter();
    const {query: {id}} = router;

    //Consulta
    const {data, loading, error} = useQuery(OBTENER_DEPOSITO_DTO, {
        variables: {
            obtenerDepositoPlazoFijoDtoId: id
        }
    });

    //Select
    const [plazo, setPlazo] = useState([]);
    const seleccionarPlazo = plazo => {
        setPlazo(plazo);
    }
    const [moneda, setMoneda] = useState([]);
    const seleccionarMoneda = moneda => {
        setMoneda(moneda);
    }

    //Mutation
    const [actualizarDepositoPlazoFijo] = useMutation(ACTUALIZAR_DEPOSITO);

    if (loading) return "Cargando...";
    if (!data) return "Accion no permitida";

    const {obtenerDepositoPlazoFijoDTO} = data;

    //Modificar
    const actualizarInfoDeposito = async valores => {
        const {monto} = valores;

        try {
            const {data} = await actualizarDepositoPlazoFijo({
                variables: {
                    actualizarDepositoPlazoFijoId: id,
                    input: {
                        cliente: cliente.id,
                        sucursal: sucursal.id,
                        plazo: plazo.value,
                        moneda: moneda.value,
                        monto,
                    }
                }
            });
            //Alerta
            Swal.fire(
                'Actualizado',
                'Deposito actualizado correctamente',
                'success'
            );
            //Redirecciones
            router.push("/depositos")

        } catch (e) {
            console.log(e);
        }
    }

    //Schema de Validacion
    const validationSchema = Yup.object({
        monto: Yup.number()
            .required("El Monto es obligatorio")
            .min(1, "El Monto debe ser mayor a 0"),
    })

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Deposito</h1>

            <div className="flex justify-center mt-5">
                <div className="w-ful max-w-lg">

                    <Formik
                        validationSchema={validationSchema}
                        enableReinitialize
                        initialValues={obtenerDepositoPlazoFijoDTO}
                        onSubmit={(valores) => {
                            actualizarInfoDeposito(valores);
                        }}
                    >
                        {props => {
                            return (
                                <form
                                    className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                    onSubmit={props.handleSubmit}
                                >
                                    <div className="mb-4">
                                        <AsignarCliente
                                            defaultValue={obtenerDepositoPlazoFijoDTO.cliente.id}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <AsignarSucursal
                                            defaultValue={obtenerDepositoPlazoFijoDTO.sucursal.id}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="plazo">
                                            Plazo
                                        </label>
                                        <Select
                                            className="mt-2"
                                            options={optionsPlazo}
                                            onChange={opcion => seleccionarPlazo(opcion)}
                                            defaultValue={optionsPlazo.find(x => x.value === obtenerDepositoPlazoFijoDTO.plazo)}
                                            getOptionValue={option => option.value}
                                            getOptionLabel={option => option.label}
                                            placeholder="Seleccionar Plazo"
                                            noOptionsMessage={() => "No hay resultados"}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="moneda">
                                            Moneda
                                        </label>
                                        <Select
                                            className="mt-2"
                                            options={optionsMoneda}
                                            onChange={opcion => seleccionarMoneda(opcion)}
                                            defaultValue={optionsMoneda.find(x => x.value === obtenerDepositoPlazoFijoDTO.moneda)}
                                            getOptionValue={option => option.value}
                                            getOptionLabel={option => option.label}
                                            placeholder="Seleccionar Moneda"
                                            noOptionsMessage={() => "No hay resultados"}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="monto">
                                            Monto
                                        </label>
                                        <input
                                            className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="monto"
                                            type="number"
                                            placeholder="Monto"
                                            value={props.values.monto}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.monto && props.errors.monto ? (
                                        <div className="my-2 bg-red-100 border-l-4 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.monto}</p>
                                        </div>
                                    ) : null}

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

export default EditarDeposito;