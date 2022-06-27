import {ApolloProvider} from "@apollo/client";
import client from "../config/apollo";
import DataState from "../context/DataState";

const MyApp = ({Component, pageProps}) => {
    return (
        <ApolloProvider client={client}>

            <DataState>
                <Component {...pageProps} />
            </DataState>
        </ApolloProvider>
    );
}

export default MyApp;
