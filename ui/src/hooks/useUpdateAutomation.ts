import { useMutation } from '@apollo/client/react';

import { UpdateAutomationDocument } from '../gql/graphql';

export function useUpdateAutomation(onError?: (error: Error) => void) {
  const [mutate, { loading }] = useMutation(UpdateAutomationDocument, {
    onError: onError ? (err) => onError(err) : undefined,
  });

  return { updateAutomation: mutate, loading };
}
