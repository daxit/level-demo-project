import { graphql } from '../gql/gql';

export const CreateAutomationMutation = graphql(`
  mutation CreateAutomation($input: CreateAutomationInput!) {
    createAutomation(input: $input) {
      ...AutomationDetailFields
    }
  }
`);

export const UpdateAutomationMutation = graphql(`
  mutation UpdateAutomation($id: ID!, $input: UpdateAutomationInput!) {
    updateAutomation(id: $id, input: $input) {
      ...AutomationDetailFields
    }
  }
`);

export const DeleteAutomationMutation = graphql(`
  mutation DeleteAutomation($id: ID!) {
    deleteAutomation(id: $id) {
      success
      id
    }
  }
`);
