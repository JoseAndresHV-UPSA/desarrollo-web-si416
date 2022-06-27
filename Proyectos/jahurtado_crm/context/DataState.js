import React, {useReducer} from "react";
import DataContext from "./DataContext"
import DataReducer from "./DataReducer"

import {
    SELECCIONAR_BANCO, SELECCIONAR_CLIENTE, SELECCIONAR_SUCURSAL, SELECCIONAR_CUENTA_ORIGEN, SELECCIONAR_CUENTA_DESTINO
} from "../types"


const DataState = ({children}) => {
    //State de Sucursal
    const initialState = {
        banco: {},
        cliente: {},
        sucursal: {},
        cuentaOrigen: {},
        cuentaDestino: {},
    }

    const [state, dispatch] = useReducer(DataReducer, initialState);

    //Modificar
    const agregarBanco = banco => {
        dispatch({
            type: SELECCIONAR_BANCO,
            payload: banco
        });
    }
    const agregarCliente = cliente => {
        dispatch({
            type: SELECCIONAR_CLIENTE,
            payload: cliente
        });
    }
    const agregarSucursal = sucursal => {
        dispatch({
            type: SELECCIONAR_SUCURSAL,
            payload: sucursal
        });
    }
    const agregarCuentaOrigen = cuentaOrigen => {
        dispatch({
            type: SELECCIONAR_CUENTA_ORIGEN,
            payload: cuentaOrigen
        });
    }
    const agregarCuentaDestino = cuentaDestino => {
        dispatch({
            type: SELECCIONAR_CUENTA_DESTINO,
            payload: cuentaDestino
        });
    }

    return (
        <DataContext.Provider
            value={{
                banco: state.banco,
                agregarBanco,
                cliente: state.cliente,
                agregarCliente,
                sucursal: state.sucursal,
                agregarSucursal,
                cuentaOrigen: state.cuentaOrigen,
                agregarCuentaOrigen,
                cuentaDestino: state.cuentaDestino,
                agregarCuentaDestino,
            }}
        > {children}

        </DataContext.Provider>
    );
}

export default DataState;