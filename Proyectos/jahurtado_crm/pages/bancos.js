import Layout from "../components/Layout";
import Banco from "../components/Banco";
import {gql, useQuery} from "@apollo/client";
import Link from "next/link";

const OBTENER_BANCOS = gql`
    query ObtenerBancos {
        obtenerBancos {
            id
            nombre
        }
    }
`;

const Bancos = () => {
    //Consulta
    const {data, loading, error} = useQuery(OBTENER_BANCOS);

    if (loading) return "Cargando...";

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Bancos</h1>

                <Link href="/nuevobanco">
                    <a className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
                        Nuevo Banco
                    </a>
                </Link>

                <table className="table-auto shadow-md mt-10 w-1/2 w-lg">
                    <thead className="bg-gray-800">
                    <tr className="text-white">
                        <th className="w-2/4 py-2">Nombre</th>
                        <th className="w-1/4 py-2">Editar</th>
                        <th className="w-1/4 py-2">Eliminar</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                    {data.obtenerBancos.map(banco => (
                        <Banco
                            key={banco.id}
                            banco={banco}
                        />
                    ))}
                    </tbody>
                </table>
            </Layout>
        </div>
    );
}

export default Bancos;
