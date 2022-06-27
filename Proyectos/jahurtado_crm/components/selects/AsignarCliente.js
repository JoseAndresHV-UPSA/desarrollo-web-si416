import React, {useState, useEffect, useContext} from "react";
import Select from "react-select";
import {gql, useQuery} from "@apollo/client";
import DataContext from "../../context/DataContext";

const OBTENER_CLIENTES_OFICIAL_DE_CREDITO = gql`
    query ObtenerClientesOficialDeCredito {
        obtenerClientesOficialDeCredito {
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

const AsignarCliente = ({defaultValue}) => {
    const [cliente, setCliente] = useState([]);

    //Context
    const dataContext = useContext(DataContext);
    const {agregarCliente} = dataContext;

    //Consulta
    const {data, loading, error} = useQuery(OBTENER_CLIENTES_OFICIAL_DE_CREDITO);

    useEffect(() => {
        agregarCliente(cliente);
    }, [cliente]);

    const seleccionarCliente = cliente => {
        setCliente(cliente);
    }

    if (loading) return "Cargando...";

    const {obtenerClientesOficialDeCredito} = data;

    return (
        <>
            <p className="block text-gray-700 text-sm font-bold mb-2">
                Cliente
            </p>
            <Select
                className="mt-2"
                options={obtenerClientesOficialDeCredito}
                onChange={opcion => seleccionarCliente(opcion)}
                defaultValue={obtenerClientesOficialDeCredito.find(x => x.id === defaultValue)}
                getOptionValue={option => option.id}
                getOptionLabel={option => option.nombre}
                placeholder="Seleccionar Cliente"
                noOptionsMessage={() => "No hay resultados"}
            />
        </>
    );
}

export default AsignarCliente;