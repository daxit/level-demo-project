import * as Select from '@radix-ui/react-select';
import { type Control, Controller, useFormState } from 'react-hook-form';

import type { AutomationFormValues } from './DetailPanel';

import { ComparisonOperator, Metric } from '../gql/graphql';

const METRIC_OPTIONS = [
  { value: Metric.Cpu, label: 'CPU' },
  { value: Metric.Memory, label: 'Memory' },
  { value: Metric.Disk, label: 'Disk' },
];

const OPERATOR_OPTIONS = [
  { value: ComparisonOperator.Equals, label: '=' },
  { value: ComparisonOperator.NotEquals, label: '!=' },
  { value: ComparisonOperator.GreaterThan, label: '>' },
  { value: ComparisonOperator.LessThan, label: '<' },
  { value: ComparisonOperator.GreaterThanOrEquals, label: '>=' },
  { value: ComparisonOperator.LessThanOrEquals, label: '<=' },
  { value: ComparisonOperator.Contains, label: 'contains' },
  { value: ComparisonOperator.NotContains, label: 'not contains' },
];

interface ThresholdFieldsProps {
  control: Control<AutomationFormValues>;
}

function SelectField({
  name,
  control,
  options,
  label,
}: {
  name: 'trigger.threshold.metric' | 'trigger.threshold.operator';
  control: Control<AutomationFormValues>;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <Controller
        name={name}
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
                  {options.map((opt) => (
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

export function ThresholdFields({ control }: ThresholdFieldsProps) {
  const { errors } = useFormState({ control });

  return (
    <div className="space-y-3">
      <SelectField
        name="trigger.threshold.metric"
        control={control}
        options={METRIC_OPTIONS}
        label="Metric"
      />
      <SelectField
        name="trigger.threshold.operator"
        control={control}
        options={OPERATOR_OPTIONS}
        label="Operator"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Value</label>
        <Controller
          name="trigger.threshold.value"
          control={control}
          rules={{ required: 'Value is required' }}
          render={({ field }) => (
            <input
              type="number"
              step="any"
              {...field}
              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            />
          )}
        />
        {errors.trigger?.threshold?.value && (
          <p className="mt-1 text-xs text-red-600">{errors.trigger.threshold.value.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Duration (seconds, optional)
        </label>
        <Controller
          name="trigger.threshold.duration"
          control={control}
          render={({ field }) => (
            <input
              type="number"
              step="1"
              {...field}
              value={field.value ?? ''}
              onChange={(e) =>
                field.onChange(e.target.value === '' ? null : Number(e.target.value))
              }
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            />
          )}
        />
      </div>
    </div>
  );
}
