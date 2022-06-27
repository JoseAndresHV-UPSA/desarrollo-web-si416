import React from "react";
import Swal from "sweetalert2";
import {gql, useMutation} from "@apollo/client";
import Router from "next/router";

const ELIMINAR_RUBRO = gql`
    mutation EliminarRubro($eliminarRubroId: ID!) {
        eliminarRubro(id: $eliminarRubroId)
    }
`;

const OBTENER_RUBROS = gql`
    query ObtenerRubros {
        obtenerRubros {
            id
            cliente {
                id
                nombre
            }
            oficialDeCredito {
                id
                nombre
                apellido
            }
            tipoRubro
            descripcion
        }
    }
`;

const Rubro = ({rubro}) => {
    const {id, cliente, oficialDeCredito, tipoRubro, descripcion} = rubro;

    //Mutation
    const [eliminarRubro] = useMutation(ELIMINAR_RUBRO, {
        update(cache) {
            //Obtener copia de la cache
            const {obtenerRubros} = cache.readQuery({query: OBTENER_RUBROS});

            //Reescribir cache
            cache.writeQuery({
                query: OBTENER_RUBROS,
                data: {
                    obtenerRubros: obtenerRubros
                        .filter(rubroActual => rubroActual.id !== id)
                }
            });
        }
    });

    //Eliminar
    const confirmarEliminarRubro = () => {
        Swal.fire({
            title: "Estas seguro de eliminar este Rubro?",
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
                    const {data} = await eliminarRubro({
                        variables: {
                            eliminarRubroId: id
                        }
                    });

                    //Alerta
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarRubro,
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
            <td className="border px-4 py-2">{cliente.nombre}</td>
            <td className="border px-4 py-2">{`${oficialDeCredito.nombre} ${oficialDeCredito.apellido}`}</td>
            <td className="border px-4 py-2">{tipoRubro}</td>
            <td className="border px-4 py-2">{descripcion}</td>
            <td className="border px-4 py-2">
                <button
                    className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                    type="button"
                    onClick={() => confirmarEliminarRubro()}
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

export default Rubro;
