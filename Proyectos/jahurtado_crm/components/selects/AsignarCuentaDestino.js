import React, {useState, useEffect, useContext} from "react";
import Select from "react-select";
import {gql, useQuery} from "@apollo/client";
import DataContext from "../../context/DataContext";

const OBTENER_CUENTAS_DTO = gql`
    query ObtenerCuentasDTOs {
        obtenerCuentasDTOs {
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

const AsignarCuentaDestino = () => {
    const [cuentaDestino, setCuentaDestino] = useState([]);

    //Context
    const dataContext = useContext(DataContext);
    const {agregarCuentaDestino} = dataContext;

    //Consulta
    const {data, loading, error} = useQuery(OBTENER_CUENTAS_DTO);

    useEffect(() => {
        agregarCuentaDestino(cuentaDestino);
    }, [cuentaDestino]);

    const seleccionarCuentaDestino = cuentaDestino => {
        setCuentaDestino(cuentaDestino);
    }

    if (loading) return "Cargando...";

    const {obtenerCuentasDTOs} = data;

    return (
        <>
            <p className="block text-gray-700 text-sm font-bold mb-2">
                Cuenta Destino
            </p>
            <Select
                className="mt-2"
                options={obtenerCuentasDTOs}
                onChange={opcion => seleccionarCuentaDestino(opcion)}
                getOptionValue={option => option.id}
                getOptionLabel={option => `${option.numeroCuenta} - ${option.cliente.nombre} - ${option.sucursal.nombre}`}
                placeholder="Seleccionar Cuenta Destino"
                noOptionsMessage={() => "No hay resultados"}
            />
        </>
    );
}

export default AsignarCuentaDestino;