import React from "react";
import Swal from "sweetalert2";
import {gql, useMutation} from "@apollo/client";
import Router from "next/router";

const REVERTIR_TRANSACCION = gql`
    mutation RevertirTransaccion($revertirTransaccionId: ID!) {
        revertirTransaccion(id: $revertirTransaccionId) {
            id
            cuentaOrigen
            cuentaDestino
            monto
            referencia
            clienteOrigen
            clienteDestino
            sucursalOrigen
            sucursalDestino
            banco
            fecha
        }
    }
`;

const Transaccion = ({transaccion}) => {
    const {id, cuentaOrigen, cuentaDestino,
        monto, referencia,
        clienteOrigen, clienteDestino,
        sucursalOrigen, sucursalDestino,
        banco, fecha} = transaccion;

    //Mutation
    const [revertirTransaccion] = useMutation(REVERTIR_TRANSACCION);

    //Eliminar
    const confirmarRevertirTransaccion = () => {
        Swal.fire({
            title: "Estas seguro de revertir esta transaccion?",
            text: "Esta accion puede afectar las cuentas.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar"

        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    //Eliminar
                    const {data} = await revertirTransaccion({
                        variables: {
                            revertirTransaccionId: id
                        }
                    });

                    //Alerta
                    Swal.fire(
                        'Completado!',
                        'Transaccion revertida',
                        'success'
                    );
                } catch (e) {
                    console.log(e.message);
                }
            }
        });
    }

    return (
        <tr>
            <td className="border px-4 py-2">{cuentaOrigen.numeroCuenta}</td>
            <td className="border px-4 py-2">{cuentaDestino.numeroCuenta}</td>
            <td className="border px-4 py-2">{monto}</td>
            <td className="border px-4 py-2">{referencia}</td>
            <td className="border px-4 py-2">{(new Date(parseInt(fecha))).toLocaleDateString()}</td>
            <td className="border px-4 py-2">{clienteOrigen.nombre}</td>
            <td className="border px-4 py-2">{clienteDestino.nombre}</td>
            <td className="border px-4 py-2">{sucursalOrigen.nombre}</td>
            <td className="border px-4 py-2">{sucursalDestino.nombre}</td>
            <td className="border px-4 py-2">
                <button
                    className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    type="button"
                    onClick={() => confirmarRevertirTransaccion()}
                >
                    Revertir
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </button>
            </td>
        </tr>
    );
}

export default Transaccion;
