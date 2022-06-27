import React from "react";
import Swal from "sweetalert2";
import {gql, useMutation} from "@apollo/client";
import Router from "next/router";

const ELIMINAR_CLIENTE = gql`
    mutation EliminarCliente($eliminarClienteId: ID!) {
        eliminarCliente(id: $eliminarClienteId)
    }
`;

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

const Cliente = ({cliente}) => {
    //Mutation
    const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
        update(cache) {
            //Obtener copia de la cache
            const {obtenerClientesOficialDeCredito} = cache.readQuery({query: OBTENER_CLIENTES_OFICIAL_DE_CREDITO});

            //Reescribir cache
            cache.writeQuery({
                query: OBTENER_CLIENTES_OFICIAL_DE_CREDITO,
                data: {
                    obtenerClientesOficialDeCredito: obtenerClientesOficialDeCredito
                        .filter(clienteActual => clienteActual.id !== id)
                }
            });
        }
    });

    const {id, nombre, direccion, telefono, saldoTotal, tipoCliente} = cliente;

    //Editar Cliente
    const editarCliente = () => {
        Router.push({
            pathname: "/editarcliente/[id]",
            query: {id}
        })
    }

    //Eliminar Cliente
    const confirmarEliminarCliente = () => {
        Swal.fire({
            title: "Estas seguro de eliminar este cliente?",
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
                    const {data} = await eliminarCliente({
                        variables: {
                            eliminarClienteId: id
                        }
                    });

                    //Alerta
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarCliente,
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
            <td className="border px-4 py-2">{direccion}</td>
            <td className="border px-4 py-2">{telefono}</td>
            <td className="border px-4 py-2">{saldoTotal}</td>
            <td className="border px-4 py-2">{tipoCliente}</td>
            <td className="border px-4 py-2">
                <button
                    className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    type="button"
                    onClick={() => editarCliente()}
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
                    onClick={() => confirmarEliminarCliente()}
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

export default Cliente;