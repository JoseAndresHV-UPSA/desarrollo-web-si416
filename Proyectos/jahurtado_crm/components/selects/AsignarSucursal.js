import React, {useState, useEffect, useContext} from "react";
import Select from "react-select";
import {gql, useQuery} from "@apollo/client";
import DataContext from "../../context/DataContext";

const OBTENER_SUCURSALES_BANCO = gql`
    query ObtenerSucursalesBanco {
        obtenerSucursalesBanco {
            id
            nombre
            direccion
            banco
        }
    }
`;

const AsignarSucursal = ({defaultValue}) => {
    const [sucursal, setSucursal] = useState([]);

    //Context
    const dataContext = useContext(DataContext);
    const {agregarSucursal} = dataContext;

    //Consulta
    const {data, loading, error} = useQuery(OBTENER_SUCURSALES_BANCO);

    useEffect(() => {
        agregarSucursal(sucursal);
    }, [sucursal]);

    const seleccionarSucursal = sucursal => {
        setSucursal(sucursal);
    }

    if (loading) return "Cargando...";

    const {obtenerSucursalesBanco} = data;

    return (
        <>
            <p className="block text-gray-700 text-sm font-bold mb-2">
                Sucursal
            </p>
            <Select
                className="mt-2"
                options={obtenerSucursalesBanco}
                onChange={opcion => seleccionarSucursal(opcion)}
                defaultValue={obtenerSucursalesBanco.find(x => x.id === defaultValue)}
                getOptionValue={option => option.id}
                getOptionLabel={option => option.nombre}
                placeholder="Seleccionar Sucursal"
                noOptionsMessage={() => "No hay resultados"}
            />
        </>
    );
}

export default AsignarSucursal;