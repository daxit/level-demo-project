import { Controller, useFormContext, useWatch } from 'react-hook-form';

import type { AutomationFormValues } from '../utilities/automationTransform';

import { ComparisonOperator, DeviceEvent, Frequency, Metric } from '../gql/graphql';
import { InlineNumber, InlineSelect } from './InlineTokens';

type TriggerType = 'deviceEvent' | 'threshold' | 'schedule';

const DEVICE_EVENT_OPTIONS = [
  { value: DeviceEvent.Online, label: 'Online' },
  { value: DeviceEvent.Offline, label: 'Offline' },
  { value: DeviceEvent.HardwareChange, label: 'Hardware Change' },
];

const METRIC_OPTIONS = [
  { value: Metric.Cpu, label: 'CPU' },
  { value: Metric.Memory, label: 'Memory' },
  { value: Metric.Disk, label: 'Disk' },
];

const OPERATOR_OPTIONS = [
  { value: ComparisonOperator.GreaterThan, label: '>' },
  { value: ComparisonOperator.LessThan, label: '<' },
  { value: ComparisonOperator.GreaterThanOrEquals, label: '>=' },
  { value: ComparisonOperator.LessThanOrEquals, label: '<=' },
  { value: ComparisonOperator.Equals, label: '=' },
  { value: ComparisonOperator.NotEquals, label: '≠' },
  { value: ComparisonOperator.Contains, label: 'contains' },
  { value: ComparisonOperator.NotContains, label: 'not contains' },
];

const FREQUENCY_OPTIONS = [
  { value: Frequency.Minutes, label: 'minutes' },
  { value: Frequency.Hours, label: 'hours' },
  { value: Frequency.Days, label: 'days' },
];

const TRIGGER_TYPE_SWITCH_OPTIONS: { value: TriggerType; label: string }[] = [
  { value: 'deviceEvent', label: 'When (device event)' },
  { value: 'threshold', label: 'When (metric threshold)' },
  { value: 'schedule', label: 'Every (schedule)' },
];

export function TriggerEditor() {
  const { control, setValue } = useFormContext<AutomationFormValues>();
  const trigger = useWatch({ control, name: 'trigger' });
  const currentType: TriggerType = trigger?.threshold
    ? 'threshold'
    : trigger?.schedule
      ? 'schedule'
      : 'deviceEvent';

  const handleTypeChange = (newType: TriggerType) => {
    if (newType === currentType) return;
    switch (newType) {
      case 'deviceEvent':
        setValue('trigger', { deviceEvent: { event: DeviceEvent.Online } }, { shouldDirty: true });
        break;
      case 'threshold':
        setValue(
          'trigger',
          {
            threshold: {
              metric: Metric.Cpu,
              operator: ComparisonOperator.GreaterThan,
              value: 0,
              duration: null,
            },
          },
          { shouldDirty: true },
        );
        break;
      case 'schedule':
        setValue(
          'trigger',
          { schedule: { frequency: Frequency.Minutes, interval: 5 } },
          { shouldDirty: true },
        );
        break;
    }
  };

  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-sm text-gray-800 dark:text-gray-200">
        <InlineSelect
          value={currentType}
          options={TRIGGER_TYPE_SWITCH_OPTIONS}
          onChange={handleTypeChange}
        />

        {currentType === 'deviceEvent' && (
          <>
            <span className="text-gray-500">a device goes</span>
            <Controller
              name="trigger.deviceEvent.event"
              render={({ field: f }) => (
                <InlineSelect
                  value={f.value}
                  options={DEVICE_EVENT_OPTIONS}
                  onChange={f.onChange}
                />
              )}
            />
          </>
        )}

        {currentType === 'threshold' && (
          <>
            <Controller
              name="trigger.threshold.metric"
              render={({ field: f }) => (
                <InlineSelect value={f.value} options={METRIC_OPTIONS} onChange={f.onChange} />
              )}
            />
            <Controller
              name="trigger.threshold.operator"
              render={({ field: f }) => (
                <InlineSelect value={f.value} options={OPERATOR_OPTIONS} onChange={f.onChange} />
              )}
            />
            <Controller
              name="trigger.threshold.value"
              render={({ field: f }) => (
                <InlineNumber value={f.value as number} onChange={(v) => f.onChange(v ?? 0)} />
              )}
            />
            <Controller
              name="trigger.threshold.duration"
              render={({ field: f }) =>
                f.value != null ? (
                  <>
                    <span className="text-gray-500">for</span>
                    <InlineNumber value={f.value} onChange={f.onChange} min={1} placeholder="s" />
                    <span className="text-gray-500">s</span>
                    <button
                      type="button"
                      onClick={() => f.onChange(null)}
                      className="cursor-pointer text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => f.onChange(1)}
                    className="cursor-pointer text-xs text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    + for duration
                  </button>
                )
              }
            />
          </>
        )}

        {currentType === 'schedule' && (
          <>
            <Controller
              name="trigger.schedule.interval"
              render={({ field: f }) => (
                <InlineNumber
                  value={f.value as number}
                  onChange={(v) => f.onChange(v ?? 1)}
                  min={1}
                  max={999}
                />
              )}
            />
            <Controller
              name="trigger.schedule.frequency"
              render={({ field: f }) => (
                <InlineSelect value={f.value} options={FREQUENCY_OPTIONS} onChange={f.onChange} />
              )}
            />
          </>
        )}
      </p>
      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
        {currentType === 'deviceEvent' && 'Fires once when a device status changes.'}
        {currentType === 'threshold' && 'Fires while the metric continuously meets the condition.'}
        {currentType === 'schedule' && 'Fires on a repeating schedule.'}
      </p>
    </div>
  );
}
