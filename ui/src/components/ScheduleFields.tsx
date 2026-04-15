import * as Select from '@radix-ui/react-select';
import { type Control, Controller, useFormState } from 'react-hook-form';

import type { AutomationFormValues } from './DetailPanel';

import { Frequency } from '../gql/graphql';

const FREQUENCY_OPTIONS = [
  { value: Frequency.Minutes, label: 'Minutes' },
  { value: Frequency.Hours, label: 'Hours' },
  { value: Frequency.Days, label: 'Days' },
];

interface ScheduleFieldsProps {
  control: Control<AutomationFormValues>;
}

export function ScheduleFields({ control }: ScheduleFieldsProps) {
  const { errors } = useFormState({ control });

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Frequency
        </label>
        <Controller
          name="trigger.schedule.frequency"
          control={control}
          render={({ field }) => (
            <Select.Root value={field.value} onValueChange={field.onChange}>
              <Select.Trigger className="mt-1 inline-flex w-full items-center justify-between rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800">
                <Select.Value />
                <Select.Icon className="ml-2 text-gray-400">&#9662;</Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="overflow-hidden rounded border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <Select.Viewport className="p-1">
                    {FREQUENCY_OPTIONS.map((opt) => (
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
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Interval (1-999)
        </label>
        <Controller
          name="trigger.schedule.interval"
          control={control}
          rules={{
            required: 'Interval is required',
            min: { value: 1, message: 'Minimum is 1' },
            max: { value: 999, message: 'Maximum is 999' },
          }}
          render={({ field }) => (
            <input
              type="number"
              min={1}
              max={999}
              step={1}
              {...field}
              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            />
          )}
        />
        {errors.trigger?.schedule?.interval && (
          <p className="mt-1 text-xs text-red-600">{errors.trigger.schedule.interval.message}</p>
        )}
      </div>
    </div>
  );
}
