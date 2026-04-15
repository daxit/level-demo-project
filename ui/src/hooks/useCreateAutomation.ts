import { useMutation } from '@apollo/client/react';

import { AutomationsDocument, CreateAutomationDocument } from '../gql/graphql';

export function useCreateAutomation() {
  const [mutate, { loading }] = useMutation(CreateAutomationDocument, {
    refetchQueries: [{ query: AutomationsDocument }],
  });

  return { createAutomation: mutate, loading };
}
