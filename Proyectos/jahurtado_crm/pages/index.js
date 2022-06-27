import Layout from "../components/Layout";
import Cliente from "../components/Cliente";
import {gql, useQuery} from "@apollo/client";
import {useRouter} from "next/router";
import Link from "next/link";

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

const Index = () => {
    const router = useRouter();

    //Consulta
    const {data, loading, error} = useQuery(OBTENER_CLIENTES_OFICIAL_DE_CREDITO);

    //Prevenir errores
    if (loading) return "Cargando...";
    if (!data.obtenerClientesOficialDeCredito) {
        return router.push("/login");
    }

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>

                <Link href="/nuevocliente">
                    <a className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold">
                        Nuevo Cliente
                    </a>
                </Link>

                <table className="table-auto shadow-md mt-10 w-full w-lg">
                    <thead className="bg-gray-800">
                    <tr className="text-white">
                        <th className="w-1/7 py-2">Nombre</th>
                        <th className="w-1/7 py-2">Direccion</th>
                        <th className="w-1/7 py-2">Telefono</th>
                        <th className="w-1/7 py-2">Saldo Total</th>
                        <th className="w-1/7 py-2">Tipo Cliente</th>
                        <th className="w-1/7 py-2">Editar</th>
                        <th className="w-1/7 py-2">Eliminar</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white">
                    {data.obtenerClientesOficialDeCredito.map(cliente => (
                        <Cliente
                            key={cliente.id}
                            cliente={cliente}
                        />
                    ))}
                    </tbody>
                </table>
            </Layout>
        </div>
    );
}

export default Index;