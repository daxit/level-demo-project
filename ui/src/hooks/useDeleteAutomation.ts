import { useMutation } from '@apollo/client/react';

import { DeleteAutomationDocument } from '../gql/graphql';

export function useDeleteAutomation() {
  const [mutate, { loading }] = useMutation(DeleteAutomationDocument, {
    update(cache, { data }) {
      if (data?.deleteAutomation.success) {
        cache.evict({
          id: cache.identify({ __typename: 'Automation', id: data.deleteAutomation.id }),
        });
        cache.gc();
      }
    },
  });

  return { deleteAutomation: mutate, loading };
}
