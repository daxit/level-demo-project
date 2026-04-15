import * as Select from '@radix-ui/react-select';
import { type Control, Controller } from 'react-hook-form';

import type { AutomationFormValues } from './DetailPanel';

import { DeviceEvent } from '../gql/graphql';

const EVENT_OPTIONS = [
  { value: DeviceEvent.Online, label: 'Online' },
  { value: DeviceEvent.Offline, label: 'Offline' },
  { value: DeviceEvent.HardwareChange, label: 'Hardware Change' },
];

interface DeviceEventFieldsProps {
  control: Control<AutomationFormValues>;
}

export function DeviceEventFields({ control }: DeviceEventFieldsProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event</label>
      <Controller
        name="trigger.deviceEvent.event"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select.Root value={field.value} onValueChange={field.onChange}>
            <Select.Trigger className="inline-flex w-full items-center justify-between rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800">
              <Select.Value />
              <Select.Icon className="ml-2 text-gray-400">&#9662;</Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="overflow-hidden rounded border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <Select.Viewport className="p-1">
                  {EVENT_OPTIONS.map((opt) => (
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
        )}
      />
    </div>
  );
}
