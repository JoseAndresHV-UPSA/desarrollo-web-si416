import {
    SELECCIONAR_BANCO,
    SELECCIONAR_CLIENTE,
    SELECCIONAR_SUCURSAL,
    SELECCIONAR_CUENTA_ORIGEN,
    SELECCIONAR_CUENTA_DESTINO
} from "/types"

export default (state, action) => {
    switch (action.type) {
        case SELECCIONAR_BANCO:
            return {
                ...state,
                banco: action.payload
            }
        case SELECCIONAR_CLIENTE:
            return {
                ...state,
                cliente: action.payload
            }
        case SELECCIONAR_SUCURSAL:
            return {
                ...state,
                sucursal: action.payload
            }
        case SELECCIONAR_CUENTA_ORIGEN:
            return {
                ...state,
                cuentaOrigen: action.payload
            }
        case SELECCIONAR_CUENTA_DESTINO:
            return {
                ...state,
                cuentaDestino: action.payload
            }

        default:
            return state;
    }
}