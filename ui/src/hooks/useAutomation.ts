import { useQuery } from '@apollo/client/react';

import { useFragment } from '../gql/fragment-masking';
import { AutomationDetailFieldsFragmentDoc, AutomationDocument } from '../gql/graphql';

export function useAutomation(id: string | undefined) {
  const { data, loading, error } = useQuery(AutomationDocument, {
    variables: { id: id! },
    skip: !id,
  });

  const raw = data?.automation;
  const automation = raw ? useFragment(AutomationDetailFieldsFragmentDoc, raw) : null;

  return { automation, loading, error };
}
