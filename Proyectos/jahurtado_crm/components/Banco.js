import React from "react";
import Swal from "sweetalert2";
import {gql, useMutation} from "@apollo/client";
import Router from "next/router";

const ELIMINAR_BANCO = gql`
    mutation EliminarBanco($eliminarBancoId: ID!) {
        eliminarBanco(id: $eliminarBancoId)
    }
`;

const OBTENER_BANCOS = gql`
    query ObtenerBancos {
        obtenerBancos {
            id
            nombre
        }
    }
`;

const Banco = ({banco}) => {
    const {id, nombre} = banco;

    //Mutation
    const [eliminarBanco] = useMutation(ELIMINAR_BANCO, {
        update(cache) {
            //Obtener copia de la cache
            const {obtenerBancos} = cache.readQuery({query: OBTENER_BANCOS});

            //Reescribir cache
            cache.writeQuery({
                query: OBTENER_BANCOS,
                data: {
                    obtenerBancos: obtenerBancos
                        .filter(bancoActual => bancoActual.id !== id)
                }
            });
        }
    });

    //Editar Sucursal
    const editarBanco = () => {
        Router.push({
            pathname: "/editarbanco/[id]",
            query: {id}
        })
    }

    //Eliminar Banco
    const confirmarEliminarBanco = () => {
        Swal.fire({
            title: "Estas seguro de eliminar este banco?",
            text: "Esta accion no se puede deshacer.",
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
                    const {data} = await eliminarBanco({
                        variables: {
                            eliminarBancoId: id
                        }
                    });

                    //Alerta
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarBanco,
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
            <td className="border px-4 py-2">{nombre}</td>
            <td className="border px-4 py-2">
                <button
                    className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    type="button"
                    onClick={() => editarBanco()}
                >
                    Editar
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                </button>
            </td>
            <td className="border px-4 py-2">
                <button
                    className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    type="button"
                    onClick={() => confirmarEliminarBanco()}
                >
                    Eliminar
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

export default Banco;
