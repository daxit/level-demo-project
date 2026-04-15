import * as Select from '@radix-ui/react-select';
import { type Control, Controller, useFormState } from 'react-hook-form';

import type { AutomationFormValues } from './DetailPanel';

import { ComparisonOperator } from '../gql/graphql';

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

interface ConditionRowProps {
  control: Control<AutomationFormValues>;
  namePrefix: string;
  onRemove: () => void;
  onImmediateSave: () => void;
}

export function ConditionRow({
  control,
  namePrefix,
  onRemove,
  onImmediateSave,
}: ConditionRowProps) {
  const { errors } = useFormState({ control });

  return (
    <div className="flex items-start gap-2">
      <Controller
        name={`${namePrefix}.field` as `conditionGroup.children.${number}.field`}
        control={control}
        rules={{
          required: 'Field is required',
          validate: (v: string) => v.trim() !== '' || 'Field is required',
        }}
        render={({ field }) => (
          <div className="flex-1">
            <input
              {...field}
              placeholder="Field"
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
        )}
      />
      <Controller
        name={`${namePrefix}.operator` as `conditionGroup.children.${number}.operator`}
        control={control}
        render={({ field }) => (
          <Select.Root
            value={field.value}
            onValueChange={(v) => {
              field.onChange(v);
              onImmediateSave();
            }}
          >
            <Select.Trigger className="inline-flex w-28 items-center justify-between rounded border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800">
              <Select.Value />
              <Select.Icon className="ml-1 text-gray-400">&#9662;</Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="overflow-hidden rounded border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <Select.Viewport className="p-1">
                  {OPERATOR_OPTIONS.map((opt) => (
                    <Select.Item
                      key={opt.value}
                      value={opt.value}
                      className="cursor-pointer rounded px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-blue-50 dark:data-[highlighted]:bg-blue-950"
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
      <Controller
        name={`${namePrefix}.value` as `conditionGroup.children.${number}.value`}
        control={control}
        rules={{ required: 'Value is required' }}
        render={({ field }) => (
          <div className="flex-1">
            <input
              {...field}
              placeholder="Value"
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
        )}
      />
      <button
        type="button"
        onClick={() => {
          onRemove();
          onImmediateSave();
        }}
        className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
      >
        &times;
      </button>
    </div>
  );
}
