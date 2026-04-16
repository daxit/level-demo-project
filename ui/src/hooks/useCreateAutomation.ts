import { useMutation } from '@apollo/client/react';

import { useFragment } from '../gql/fragment-masking';
import {
  AutomationsDocument,
  AutomationDetailFieldsFragmentDoc,
  CreateAutomationDocument,
  DeviceEvent,
  LogicalOperator,
} from '../gql/graphql';

interface UseCreateAutomationOptions {
  onCreated: (id: string) => void;
}

export function useCreateAutomation({ onCreated }: UseCreateAutomationOptions) {
  const [mutate, { loading }] = useMutation(CreateAutomationDocument, {
    refetchQueries: [{ query: AutomationsDocument }],
  });

  const createAutomation = async () => {
    const result = await mutate({
      variables: {
        input: {
          name: 'New Automation',
          enabled: false,
          trigger: { deviceEvent: { event: DeviceEvent.Online } },
          conditionGroup: { operator: LogicalOperator.And, conditions: [] },
          actions: [],
        },
      },
    });

    if (result.data?.createAutomation) {
      const created = useFragment(AutomationDetailFieldsFragmentDoc, result.data.createAutomation);
      onCreated(created.id);
    }
  };

  return { createAutomation, loading };
}
