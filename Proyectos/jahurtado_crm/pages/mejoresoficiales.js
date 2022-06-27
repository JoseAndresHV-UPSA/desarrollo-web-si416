import React from "react";
import Layout from "../components/Layout";
import {BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {gql, useQuery} from "@apollo/client";

const MEJOR_OFICIAL = gql`
    query MejorOficialDeCredito {
        mejorOficialDeCredito {
            cantidadClientes
            usuario {
                id
                nombre
                apellido
                email
                creado
                banco
            }
        }
    }
`;

const MejoresOficiales = () => {
    const {data, loading, error} = useQuery(MEJOR_OFICIAL);

    if (loading) return "Cargando...";

    const {mejorOficialDeCredito} = data;

    const oficialGrafica = [{
        oficial: `${mejorOficialDeCredito.usuario.nombre} ${mejorOficialDeCredito.usuario.apellido}`,
        clientes: mejorOficialDeCredito.cantidadClientes
    }];


    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Mejor Oficial de Credito</h1>

            <BarChart
                className="mt-10"
                width={600}
                height={500}
                data={oficialGrafica}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="oficial"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Bar dataKey="clientes" fill="#3182CE"/>
            </BarChart>

        </Layout>
    );
}

export default MejoresOficiales;