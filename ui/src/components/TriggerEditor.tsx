import * as Select from '@radix-ui/react-select';
import { type Control, type UseFormSetValue, useWatch } from 'react-hook-form';

import type { AutomationFormValues } from './DetailPanel';

import { ComparisonOperator, DeviceEvent, Frequency, Metric } from '../gql/graphql';
import { DeviceEventFields } from './DeviceEventFields';
import { ScheduleFields } from './ScheduleFields';
import { ThresholdFields } from './ThresholdFields';

type TriggerType = 'deviceEvent' | 'threshold' | 'schedule';

const TRIGGER_OPTIONS = [
  { value: 'deviceEvent' as const, label: 'Device Event' },
  { value: 'threshold' as const, label: 'Threshold' },
  { value: 'schedule' as const, label: 'Schedule' },
];

interface TriggerEditorProps {
  control: Control<AutomationFormValues>;
  setValue: UseFormSetValue<AutomationFormValues>;
  onImmediateSave: () => void;
}

function detectTriggerType(trigger: AutomationFormValues['trigger'] | undefined): TriggerType {
  if (!trigger) return 'deviceEvent';
  if (trigger.threshold) return 'threshold';
  if (trigger.schedule) return 'schedule';
  return 'deviceEvent';
}

export function TriggerEditor({ control, setValue, onImmediateSave }: TriggerEditorProps) {
  const trigger = useWatch({ control, name: 'trigger' });
  const currentType = detectTriggerType(trigger);

  const handleTypeChange = (newType: TriggerType) => {
    if (newType === currentType) return;

    // Replace the entire trigger object in one call to avoid stale nested keys
    switch (newType) {
      case 'deviceEvent':
        setValue('trigger', { deviceEvent: { event: DeviceEvent.Online } });
        break;
      case 'threshold':
        setValue('trigger', {
          threshold: {
            metric: Metric.Cpu,
            operator: ComparisonOperator.GreaterThan,
            value: 0,
            duration: null,
          },
        });
        break;
      case 'schedule':
        setValue('trigger', { schedule: { frequency: Frequency.Minutes, interval: 5 } });
        break;
    }

    onImmediateSave();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Trigger Type
        </label>
        <Select.Root value={currentType} onValueChange={(v) => handleTypeChange(v as TriggerType)}>
          <Select.Trigger className="mt-1 inline-flex w-full items-center justify-between rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800">
            <Select.Value />
            <Select.Icon className="ml-2 text-gray-400">&#9662;</Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="overflow-hidden rounded border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <Select.Viewport className="p-1">
                {TRIGGER_OPTIONS.map((opt) => (
                  <Select.Item
                    key={opt.value}
                    value={opt.value}
                    className="cursor-pointer rounded px-3 py-2 text-sm outline-none data-[highlighted]:bg-blue-50 dark:data-[highlighted]:bg-blue-950"
                  >
                    <Select.ItemText>{opt.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      {currentType === 'deviceEvent' && <DeviceEventFields control={control} />}
      {currentType === 'threshold' && <ThresholdFields control={control} />}
      {currentType === 'schedule' && <ScheduleFields control={control} />}
    </div>
  );
}
