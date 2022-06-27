import React from "react";
import Layout from "../components/Layout";
import {BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {gql, useQuery} from "@apollo/client";

const MAYOR_DEPOSITO = gql`
    query ObtenerMayorDepositoPlazoFijo {
        obtenerMayorDepositoPlazoFijo {
            nombreCliente
            monto
            moneda
            plazo
            oficialDeCredito
        }
    }
`;

const MejoresOficiales = () => {
    const {data, loading, error} = useQuery(MAYOR_DEPOSITO);

    if (loading) return "Cargando...";

    const {obtenerMayorDepositoPlazoFijo} = data;

    const depositoGrafica = [{
        cliente: obtenerMayorDepositoPlazoFijo.nombreCliente,
        monto: obtenerMayorDepositoPlazoFijo.monto,
        moneda: obtenerMayorDepositoPlazoFijo.moneda
    }];


    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Mayor Deposito</h1>

            <BarChart
                className="mt-10"
                width={600}
                height={500}
                data={depositoGrafica}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="cliente"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Bar dataKey="monto" fill="#3182CE"/>
            </BarChart>

        </Layout>
    );
}

export default MejoresOficiales;