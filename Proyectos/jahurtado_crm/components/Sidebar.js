import React from "react";
import Link from 'next/link';
import {useRouter} from 'next/router';

const Sidebar = () => {
    const router = useRouter();

    return (
        <aside className="bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5">
            <div>
                <p className="text-white text-2xl font-black">Proyecto Banco</p>
            </div>

            <nav className="mt-5 list-none">
                <li className={router.pathname === "/" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/">
                        <a className="text-white block">
                            Clientes
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === "/cuentas" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/cuentas">
                        <a className="text-white block">
                            Cuentas
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === "/transacciones" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/transacciones">
                        <a className="text-white block">
                            Transacciones
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === "/depositos" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/depositos">
                        <a className="text-white block">
                            Depositos a Plazo Fijo
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === "/bancos" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/bancos">
                        <a className="text-white block">
                            Bancos
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === "/sucursales" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/sucursales">
                        <a className="text-white block">
                            Sucursales
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === "/rubros" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/rubros">
                        <a className="text-white block">
                            Rubros
                        </a>
                    </Link>
                </li>
            </nav>

            <div className="sm:mt-10">
                <p className="text-white text-2xl font-black">Reportes</p>
            </div>

            <nav className="mt-5 list-none">
                <li className={router.pathname === "/mejoresoficiales" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/mejoresoficiales">
                        <a className="text-white block">
                            Mejores Oficiales
                        </a>
                    </Link>
                </li>

                <li className={router.pathname === "/mayordeposito" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/mayordeposito">
                        <a className="text-white block">
                            Mayor Deposito
                        </a>
                    </Link>
                </li>
            </nav>
        </aside>
    );
}

export default Sidebar;