export type Condition = {
  __typename: 'Condition';
  id: string;
  field: string;
  operator: string;
  value: string;
};

export type ConditionGroup = {
  __typename: 'ConditionGroup';
  id: string;
  operator: string;
  conditions: ConditionEntry[];
};

export type ConditionEntry = Condition | ConditionGroup;

export type DeviceEventTrigger = {
  __typename: 'DeviceEventTrigger';
  id: string;
  event: string;
};

export type ThresholdTrigger = {
  __typename: 'ThresholdTrigger';
  id: string;
  metric: string;
  operator: string;
  value: number;
  duration: number | null;
};

export type ScheduleTrigger = {
  __typename: 'ScheduleTrigger';
  id: string;
  frequency: string;
  interval: number;
};

export type Trigger = DeviceEventTrigger | ThresholdTrigger | ScheduleTrigger;

export type SendNotificationAction = {
  __typename: 'SendNotificationAction';
  id: string;
  recipients: string[];
  subject: string;
  body: string;
};

export type RunScriptAction = {
  __typename: 'RunScriptAction';
  id: string;
  script: string;
  args: string[] | null;
  timeout: number | null;
};

export type Action = SendNotificationAction | RunScriptAction;

export type Automation = {
  id: string;
  name: string;
  description: string | null;
  enabled: boolean;
  trigger: Trigger;
  conditionGroup: ConditionGroup;
  actions: Action[];
  createdAt: string;
  updatedAt: string;
};

const id = () => crypto.randomUUID();
const now = new Date().toISOString();

export const automations: Automation[] = [
  // Automation 1: simple — flat conditions
  {
    id: id(),
    name: 'High CPU Alert',
    description: 'Alerts when CPU usage exceeds 90% on production servers',
    enabled: true,
    trigger: {
      __typename: 'ThresholdTrigger',
      id: id(),
      metric: 'CPU',
      operator: 'GREATER_THAN',
      value: 90,
      duration: 300,
    },
    conditionGroup: {
      __typename: 'ConditionGroup',
      id: id(),
      operator: 'AND',
      conditions: [
        {
          __typename: 'Condition',
          id: id(),
          field: 'device_type',
          operator: 'EQUALS',
          value: 'server',
        },
        {
          __typename: 'Condition',
          id: id(),
          field: 'environment',
          operator: 'EQUALS',
          value: 'production',
        },
      ],
    },
    actions: [
      {
        __typename: 'SendNotificationAction',
        id: id(),
        recipients: ['ops@company.com'],
        subject: 'High CPU Alert',
        body: 'CPU usage has exceeded 90% for more than 5 minutes on a production server.',
      },
    ],
    createdAt: now,
    updatedAt: now,
  },

  // Automation 2: moderate — 2 levels deep
  {
    id: id(),
    name: 'Disk Space Management',
    description: 'Monitors disk usage and runs cleanup on Windows and Linux servers',
    enabled: true,
    trigger: {
      __typename: 'ScheduleTrigger',
      id: id(),
      frequency: 'HOURS',
      interval: 6,
    },
    conditionGroup: {
      __typename: 'ConditionGroup',
      id: id(),
      operator: 'AND',
      conditions: [
        {
          __typename: 'Condition',
          id: id(),
          field: 'disk_usage',
          operator: 'GREATER_THAN',
          value: '85',
        },
        {
          __typename: 'ConditionGroup',
          id: id(),
          operator: 'OR',
          conditions: [
            {
              __typename: 'Condition',
              id: id(),
              field: 'os_type',
              operator: 'EQUALS',
              value: 'windows',
            },
            {
              __typename: 'Condition',
              id: id(),
              field: 'os_type',
              operator: 'EQUALS',
              value: 'linux',
            },
          ],
        },
      ],
    },
    actions: [
      {
        __typename: 'SendNotificationAction',
        id: id(),
        recipients: ['storage-team@company.com'],
        subject: 'Disk Space Warning',
        body: 'Disk usage has exceeded 85% on a monitored server.',
      },
      {
        __typename: 'RunScriptAction',
        id: id(),
        script: 'cleanup-temp-files',
        args: ['--older-than', '7d'],
        timeout: 120,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },

  // Automation 3: complex — 3 levels deep
  {
    id: id(),
    name: 'Critical Infrastructure Monitor',
    description: 'Monitors critical production infrastructure and triggers failover checks',
    enabled: true,
    trigger: {
      __typename: 'DeviceEventTrigger',
      id: id(),
      event: 'OFFLINE',
    },
    conditionGroup: {
      __typename: 'ConditionGroup',
      id: id(),
      operator: 'AND',
      conditions: [
        {
          __typename: 'Condition',
          id: id(),
          field: 'environment',
          operator: 'EQUALS',
          value: 'production',
        },
        {
          __typename: 'ConditionGroup',
          id: id(),
          operator: 'OR',
          conditions: [
            {
              __typename: 'Condition',
              id: id(),
              field: 'role',
              operator: 'EQUALS',
              value: 'database',
            },
            {
              __typename: 'ConditionGroup',
              id: id(),
              operator: 'AND',
              conditions: [
                {
                  __typename: 'Condition',
                  id: id(),
                  field: 'role',
                  operator: 'EQUALS',
                  value: 'web-server',
                },
                {
                  __typename: 'Condition',
                  id: id(),
                  field: 'region',
                  operator: 'CONTAINS',
                  value: 'us-',
                },
              ],
            },
          ],
        },
        {
          __typename: 'Condition',
          id: id(),
          field: 'uptime_hours',
          operator: 'GREATER_THAN',
          value: '720',
        },
      ],
    },
    actions: [
      {
        __typename: 'SendNotificationAction',
        id: id(),
        recipients: ['oncall@company.com', 'infra-lead@company.com'],
        subject: 'Critical: Production Server Offline',
        body: 'A critical production server has gone offline. Immediate investigation required.',
      },
      {
        __typename: 'RunScriptAction',
        id: id(),
        script: 'failover-check',
        args: ['--priority', 'critical'],
        timeout: 60,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
];
