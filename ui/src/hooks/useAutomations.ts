import { NetworkStatus } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import type { AutomationListFieldsFragment } from '../gql/graphql';

import { useFragment } from '../gql/fragment-masking';
import { AutomationListFieldsFragmentDoc, AutomationsDocument } from '../gql/graphql';

export function useAutomations() {
  const { data, loading, error, networkStatus } = useQuery(AutomationsDocument, {
    notifyOnNetworkStatusChange: true,
  });

  const automations: AutomationListFieldsFragment[] = (data?.automations ?? []).map((a) =>
    useFragment(AutomationListFieldsFragmentDoc, a),
  );

  const isRefetching = networkStatus === NetworkStatus.refetch;

  return { automations, loading, error, isRefetching };
}
