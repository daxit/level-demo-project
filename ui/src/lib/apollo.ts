import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { onError } from '@apollo/client/link/error';

const errorLink = onError(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (const err of error.errors) {
      console.error(`[GraphQL error] ${operation.operationName}:`, err.message);
    }
  } else {
    console.error(`[Network error] ${operation.operationName}:`, error);
  }
});

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });

export const client = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache({
    possibleTypes: {
      ConditionEntry: ['Condition', 'ConditionGroup'],
      Trigger: ['DeviceEventTrigger', 'ThresholdTrigger', 'ScheduleTrigger'],
      Action: ['SendNotificationAction', 'RunScriptAction'],
    },
  }),
});
