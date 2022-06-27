import Layout from "../components/Layout";
import Rubro from "../components/Rubro";
import {gql, useQuery} from "@apollo/client";
import Link from "next/link";
import DataContext from "../context/DataContext";

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

const Rubros = () => {
    //Consulta
    const {data, loading, error} = useQuery(OBTENER_RUBROS);

    if (loading) return "Cargando...";

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Rubros</h1>

                <Link href="/nuevorubro">
                    <a className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
                        Nuevo Rubro
                    </a>
                </Link>

                <table className="table-auto shadow-md mt-10 w-2/3 w-lg">
                    <thead className="bg-gray-800">
                    <tr className="text-white">
                        <th className="w-1/5 py-2">Cliente</th>
                        <th className="w-1/5 py-2">Oficial de Credito</th>
                        <th className="w-1/5 py-2">Tipo Rubro</th>
                        <th className="w-1/5 py-2">Descripcion</th>
                        <th className="w-1/5 py-2">Eliminar</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                    {data.obtenerRubros.map(rubro => (
                        <Rubro
                            key={rubro.id}
                            rubro={rubro}
                        />
                    ))}
                    </tbody>
                </table>
            </Layout>
        </div>
    );
}

export default Rubros;
