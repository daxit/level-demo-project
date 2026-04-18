import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';

import { useFragment } from '../gql/fragment-masking';
import { AutomationDetailFieldsFragmentDoc, AutomationDocument } from '../gql/graphql';

export function useAutomation(id: string | undefined) {
  const { data, loading, error } = useQuery(AutomationDocument, {
    variables: { id: id! },
    skip: !id,
  });

  const raw = data?.automation;
  const unmasked = raw ? useFragment(AutomationDetailFieldsFragmentDoc, raw) : null;

  // Stabilize the reference: useFragment is a pure cast that returns a new object every render.
  // Keying on id+updatedAt means consumers get a stable reference unless data actually changed.
  const automation = useMemo(() => unmasked, [unmasked?.id, unmasked?.updatedAt]);

  return { automation, loading, error };
}
