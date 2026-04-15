import { useQuery } from '@apollo/client/react';

import type { AutomationListFieldsFragment } from '../gql/graphql';

import { useFragment } from '../gql/fragment-masking';
import { AutomationListFieldsFragmentDoc, AutomationsDocument } from '../gql/graphql';

export function useAutomations() {
  const { data, loading, error } = useQuery(AutomationsDocument);

  const automations: AutomationListFieldsFragment[] = (data?.automations ?? []).map((a) =>
    useFragment(AutomationListFieldsFragmentDoc, a),
  );

  return { automations, loading, error };
}
