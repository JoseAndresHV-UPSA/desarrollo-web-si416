import Layout from "../components/Layout";
import Deposito from "../components/Deposito";
import {gql, useQuery} from "@apollo/client";
import Link from "next/link";

const OBTENER_DEPOSITOS_DTO = gql`
    query ObtenerDepositosPlazoFijoDTO {
        obtenerDepositosPlazoFijoDTO {
            id
            oficialDeCredito
            cliente {
                id
                nombre
            }
            sucursal {
                id
                nombre
            }
            fecha
            plazo
            moneda
            monto
        }
    }
`;

const Depositos = () => {
    //Consulta
    const {data, loading, error} = useQuery(OBTENER_DEPOSITOS_DTO);

    if (loading) return "Cargando...";

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Depositos Plazo Fijo</h1>

                <Link href="/nuevodeposito">
                    <a className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
                        Nuevo Deposito
                    </a>
                </Link>

                <table className="table-auto shadow-md mt-10 w-full w-lg">
                    <thead className="bg-gray-800">
                    <tr className="text-white">
                        <th className="w-1/8 py-2">Cliente</th>
                        <th className="w-1/8 py-2">Sucursal</th>
                        <th className="w-1/8 py-2">Fecha</th>
                        <th className="w-1/8 py-2">Plazo</th>
                        <th className="w-1/8 py-2">Moneda</th>
                        <th className="w-1/8 py-2">Monto</th>
                        <th className="w-1/8 py-2">Editar</th>
                        <th className="w-1/8 py-2">Eliminar</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                    {data.obtenerDepositosPlazoFijoDTO.map(deposito => (
                        <Deposito
                            key={deposito.id}
                            deposito={deposito}
                        />
                    ))}
                    </tbody>
                </table>
            </Layout>
        </div>
    );
}

export default Depositos;
