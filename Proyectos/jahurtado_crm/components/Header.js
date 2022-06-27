import React from "react";
import {useQuery, gql} from "@apollo/client";
import {useRouter} from "next/router";

const OBTENER_USUARIO_DTO = gql`
    query ObtenerUsuarioDTO {
        obtenerUsuarioDTO {
            id
            nombre
            apellido
            email
            creado
            banco {
                id
                nombre
            }
        }
    }
`;

const Header = () => {
    const router = useRouter();

    //Consulta
    const {data, loading, error} = useQuery(OBTENER_USUARIO_DTO);

    //Prevenir errores
    if (loading) return null;
    if (!data) {
        return router.push("/login");

    }

    const {nombre, apellido, banco} = data.obtenerUsuarioDTO;

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        router.push("/login");
    }

    return (
        <div className="flex justify-between mb-6">
            <p className="mr-2"><span className="font-bold">{banco.nombre}: </span>Bienvenido, {nombre} {apellido}!</p>
            <button
                className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"
                type="button"
                onClick={() => cerrarSesion()}
            >
                Cerrar Sesion
            </button>
        </div>
    );
}

export default Header;