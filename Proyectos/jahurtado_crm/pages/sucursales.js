import Layout from "../components/Layout";
import Sucursal from "../components/Sucursal";
import {gql, useQuery} from "@apollo/client";
import Link from "next/link";

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

const Sucursales = () => {
    //Consulta
    const {data, loading, error} = useQuery(OBTENER_SUCURSALES_BANCO);

    if (loading) return "Cargando...";

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Sucursales</h1>

                <Link href="/nuevasucursal">
                    <a className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
                        Nueva Sucursal
                    </a>
                </Link>

                <table className="table-auto shadow-md mt-10 w-2/3 w-lg">
                    <thead className="bg-gray-800">
                    <tr className="text-white">
                        <th className="w-2/6 py-2">Nombre</th>
                        <th className="w-2/6 py-2">Direccion</th>
                        <th className="w-1/6 py-2">Editar</th>
                        <th className="w-1/6 py-2">Eliminar</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                    {data.obtenerSucursalesBanco.map(sucursal => (
                        <Sucursal
                            key={sucursal.id}
                            sucursal={sucursal}
                        />
                    ))}
                    </tbody>
                </table>
            </Layout>
        </div>
    );
}

export default Sucursales;
