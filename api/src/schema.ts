export const typeDefs = `#graphql
  enum LogicalOperator {
    AND
    OR
  }

  enum ComparisonOperator {
    EQUALS
    NOT_EQUALS
    GREATER_THAN
    LESS_THAN
    GREATER_THAN_OR_EQUALS
    LESS_THAN_OR_EQUALS
    CONTAINS
    NOT_CONTAINS
  }

  enum DeviceEvent {
    ONLINE
    OFFLINE
    HARDWARE_CHANGE
  }

  enum Metric {
    CPU
    MEMORY
    DISK
  }

  enum Frequency {
    MINUTES
    HOURS
    DAYS
  }

  type Condition {
    id: ID!
    field: String!
    operator: ComparisonOperator!
    value: String!
  }

  type ConditionGroup {
    id: ID!
    operator: LogicalOperator!
    conditions: [ConditionEntry!]!
  }

  union ConditionEntry = Condition | ConditionGroup

  type DeviceEventTrigger {
    id: ID!
    event: DeviceEvent!
  }

  type ThresholdTrigger {
    id: ID!
    metric: Metric!
    operator: ComparisonOperator!
    value: Float!
    duration: Int
  }

  type ScheduleTrigger {
    id: ID!
    frequency: Frequency!
    interval: Int!
  }

  union Trigger = DeviceEventTrigger | ThresholdTrigger | ScheduleTrigger

  type SendNotificationAction {
    id: ID!
    recipients: [String!]!
    subject: String!
    body: String!
  }

  type RunScriptAction {
    id: ID!
    script: String!
    args: [String!]
    timeout: Int
  }

  union Action = SendNotificationAction | RunScriptAction

  type Automation {
    id: ID!
    name: String!
    description: String
    enabled: Boolean!
    trigger: Trigger!
    conditionGroup: ConditionGroup!
    actions: [Action!]!
    actionsCount: Int!
    conditionsCount: Int!
    conditionsDepth: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    automations: [Automation!]!
    automation(id: ID!): Automation
  }

  type Mutation {
    createAutomation(input: CreateAutomationInput!): Automation!
    updateAutomation(id: ID!, input: UpdateAutomationInput!): Automation!
    deleteAutomation(id: ID!): DeleteAutomationResult!
  }

  type DeleteAutomationResult {
    success: Boolean!
    id: ID!
  }

  input ConditionInput {
    field: String!
    operator: ComparisonOperator!
    value: String!
  }

  input ConditionGroupInput {
    operator: LogicalOperator!
    conditions: [ConditionEntryInput!]!
  }

  input ConditionEntryInput {
    condition: ConditionInput
    group: ConditionGroupInput
  }

  input DeviceEventTriggerInput {
    event: DeviceEvent!
  }

  input ThresholdTriggerInput {
    metric: Metric!
    operator: ComparisonOperator!
    value: Float!
    duration: Int
  }

  input ScheduleTriggerInput {
    frequency: Frequency!
    interval: Int!
  }

  input TriggerInput {
    deviceEvent: DeviceEventTriggerInput
    threshold: ThresholdTriggerInput
    schedule: ScheduleTriggerInput
  }

  input SendNotificationActionInput {
    recipients: [String!]!
    subject: String!
    body: String!
  }

  input RunScriptActionInput {
    script: String!
    args: [String!]
    timeout: Int
  }

  input ActionInput {
    sendNotification: SendNotificationActionInput
    runScript: RunScriptActionInput
  }

  input CreateAutomationInput {
    name: String!
    description: String
    enabled: Boolean
    trigger: TriggerInput!
    conditionGroup: ConditionGroupInput
    actions: [ActionInput!]!
  }

  input UpdateAutomationInput {
    name: String
    description: String
    enabled: Boolean
    trigger: TriggerInput
    conditionGroup: ConditionGroupInput
    actions: [ActionInput]
  }
`;
