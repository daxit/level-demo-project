import { ApolloProvider } from '@apollo/client/react';
import { createRootRoute, Outlet } from '@tanstack/react-router';

import '../index.css';
import { client } from '../lib/apollo';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <Outlet />
    </ApolloProvider>
  );
}
