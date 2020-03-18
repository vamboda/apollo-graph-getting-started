import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Pages from './pages';
import Login from './pages/login';
import { resolvers, typeDefs } from './resolvers';
import injectStyles from './styles';

const cache = new InMemoryCache();
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    link: new HttpLink({
        uri: 'http://localhost:4000/graphql',

        headers: {
            authorization: localStorage.getItem('token'),
        },
    }),
    resolvers,
    typeDefs,
    
});

cache.writeData({
    data: {
        isLoggedIn: !!localStorage.getItem('token'),
        cartItems: [],
    },
});


const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

function IsLoggedIn() {
    const { data } = useQuery(IS_LOGGED_IN);
    return data.isLoggedIn ? <Pages /> : <Login />;
}

injectStyles();
ReactDOM.render(
    <ApolloProvider client={client}>
        <Pages />
    </ApolloProvider>,
    document.getElementById('root')
);