import Layout from "../components/Layout";
import Transaccion from "../components/Transaccion";
import {gql, useQuery} from "@apollo/client";
import Link from "next/link";

const OBTENER_TRANSACCIONES_DTO = gql`
    query ObtenerTransaccionesDTO {
        obtenerTransaccionesDTO {
            id
            cuentaOrigen {
                id
                numeroCuenta
                saldoCuenta
            }
            cuentaDestino {
                id
                numeroCuenta
                saldoCuenta
            }
            monto
            referencia
            clienteOrigen {
                id
                nombre
            }
            clienteDestino {
                id
                nombre
            }
            sucursalOrigen {
                id
                nombre
            }
            sucursalDestino {
                id
                nombre
            }
            banco {
                id
                nombre
            }
            fecha
        }
    }
`;

const Cuentas = () => {
    //Consulta
    const {data, loading, error} = useQuery(OBTENER_TRANSACCIONES_DTO);

    if (loading) return "Cargando...";

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Transacciones</h1>

                <Link href="/nuevatransaccion">
                    <a className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
                        Nueva Transaccion
                    </a>
                </Link>

                <table className="table-auto shadow-md mt-10 w-full w-lg">
                    <thead className="bg-gray-800">
                    <tr className="text-white">
                        <th className="w-1/10 py-2">Cuenta Origen</th>
                        <th className="w-1/10 py-2">Cuenta Destino</th>
                        <th className="w-1/10 py-2">Monto</th>
                        <th className="w-1/10 py-2">Referencia</th>
                        <th className="w-1/10 py-2">Fecha</th>
                        <th className="w-1/10 py-2">Cliente Origen</th>
                        <th className="w-1/10 py-2">Cliente Destino</th>
                        <th className="w-1/10 py-2">Sucursal Origen</th>
                        <th className="w-1/10 py-2">Sucursal Destino</th>
                        <th className="w-1/10 py-2">Revertir</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                    {data.obtenerTransaccionesDTO.map(transaccion => (
                        <Transaccion
                            key={transaccion.id}
                            transaccion={transaccion}
                        />
                    ))}
                    </tbody>
                </table>
            </Layout>
        </div>
    );
}

export default Cuentas;
