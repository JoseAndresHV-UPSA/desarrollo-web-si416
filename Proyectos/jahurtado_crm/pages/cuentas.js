import Layout from "../components/Layout";
import Cuenta from "../components/Cuenta";
import {gql, useQuery} from "@apollo/client";
import Link from "next/link";

const OBTENER_CUENTAS_DTO = gql`
    query ObtenerCuentasDTOs {
        obtenerCuentasDTOs {
            id
            numeroCuenta
            saldoCuenta
            tipoCuenta
            cliente {
                id
                nombre
            }
            banco {
                id
                nombre
            }
            sucursal {
                id
                nombre
            }
        }
    }
`;

const Cuentas = () => {
    //Consulta
    const {data, loading, error} = useQuery(OBTENER_CUENTAS_DTO);

    if (loading) return "Cargando...";

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Cuentas</h1>

                <Link href="/nuevacuenta">
                    <a className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
                        Nueva Cuenta
                    </a>
                </Link>

                <table className="table-auto shadow-md mt-10 w-full w-lg">
                    <thead className="bg-gray-800">
                    <tr className="text-white">
                        <th className="w-1/7 py-2">Numero Cuenta</th>
                        <th className="w-1/7 py-2">Saldo</th>
                        <th className="w-1/7 py-2">Tipo Cuenta</th>
                        <th className="w-1/7 py-2">Cliente</th>
                        <th className="w-1/7 py-2">Sucursal</th>
                        <th className="w-1/7 py-2">Editar</th>
                        <th className="w-1/7 py-2">Eliminar</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                    {data.obtenerCuentasDTOs.map(cuenta => (
                        <Cuenta
                            key={cuenta.id}
                            cuenta={cuenta}
                        />
                    ))}
                    </tbody>
                </table>
            </Layout>
        </div>
    );
}

export default Cuentas;
