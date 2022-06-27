import React, {useState, useEffect, useContext} from "react";
import Select from "react-select";
import {gql, useQuery} from "@apollo/client";
import DataContext from "../../context/DataContext";

const OBTENER_BANCOS = gql`
    query ObtenerBancos {
        obtenerBancos {
            id
            nombre
        }
    }
`;

const AsignarBanco = () => {
    const [banco, setBanco] = useState([]);

    //Context
    const dataContext = useContext(DataContext);
    const {agregarBanco} = dataContext;

    //Consulta
    const {data, loading, error} = useQuery(OBTENER_BANCOS);

    useEffect(() => {
        agregarBanco(banco);
    }, [banco]);

    const seleccionarBanco = banco => {
        setBanco(banco);
    }

    if (loading) return "Cargando...";

    const {obtenerBancos} = data;

    return (
        <>
            <p className="block text-gray-700 text-sm font-bold mb-2">
                Banco
            </p>
            <Select
                className="mt-2"
                options={obtenerBancos}
                onChange={opcion => seleccionarBanco(opcion)}
                getOptionValue={option => option.id}
                getOptionLabel={option => option.nombre}
                placeholder="Seleccionar Banco"
                noOptionsMessage={() => "No hay resultados"}
            />
        </>
    );
}

export default AsignarBanco;