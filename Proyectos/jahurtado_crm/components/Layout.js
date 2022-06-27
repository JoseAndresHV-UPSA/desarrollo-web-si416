import React from "react";
import Head from "next/head";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {useRouter} from "next/router";

const Layout = ({children}) => {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Proyecto Banco</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
                      integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w=="
                      crossOrigin="anonymous" referrerPolicy="no-referrer"/>
                <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"/>
            </Head>

            {router.pathname === "/login"||  router.pathname === "/nuevousuario" ? (
                <div className="bg-gray-800 min-h-screen flex flex-col justify-center">
                    <div>
                        {children}
                    </div>
                </div>
            ) : (
                <div className="bg-gray-200 min-h-screen">
                    <div className="flex min-h-screen">
                        <Sidebar/>

                        <main className="sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5">
                            <Header/>
                            {children}
                        </main>

                    </div>
                </div>
            )}
        </>
    );
}

export default Layout;