import * as Select from '@radix-ui/react-select';
import { type Control, Controller, useFieldArray } from 'react-hook-form';

import type { AutomationFormValues } from './DetailPanel';

import { ComparisonOperator, LogicalOperator } from '../gql/graphql';
import { ConditionRow } from './ConditionRow';

const LOGICAL_OPTIONS = [
  { value: LogicalOperator.And, label: 'AND' },
  { value: LogicalOperator.Or, label: 'OR' },
];

interface ConditionGroupEditorProps {
  control: Control<AutomationFormValues>;
  onImmediateSave: () => void;
  namePrefix?: string;
  nestingDepth?: number;
  isRoot?: boolean;
  onRemoveGroup?: () => void;
}

export function ConditionGroupEditor({
  control,
  onImmediateSave,
  namePrefix = 'conditionGroup',
  nestingDepth = 0,
  isRoot = true,
  onRemoveGroup,
}: ConditionGroupEditorProps) {
  const childrenName = `${namePrefix}.children` as 'conditionGroup.children';
  const operatorName = `${namePrefix}.operator` as 'conditionGroup.operator';

  const { fields, append, remove } = useFieldArray({
    control,
    name: childrenName,
  });

  return (
    <div className={nestingDepth > 0 ? 'border-l-2 border-gray-200 pl-4 dark:border-gray-600' : ''}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Match</span>
        <Controller
          name={operatorName}
          control={control}
          render={({ field }) => (
            <Select.Root
              value={field.value}
              onValueChange={(v) => {
                field.onChange(v);
                onImmediateSave();
              }}
            >
              <Select.Trigger className="inline-flex items-center justify-between rounded border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800">
                <Select.Value />
                <Select.Icon className="ml-2 text-gray-400">&#9662;</Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="overflow-hidden rounded border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <Select.Viewport className="p-1">
                    {LOGICAL_OPTIONS.map((opt) => (
                      <Select.Item
                        key={opt.value}
                        value={opt.value}
                        className="cursor-pointer rounded px-3 py-1.5 text-sm outline-none data-[highlighted]:bg-blue-50 dark:data-[highlighted]:bg-blue-950"
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
        <span className="text-sm text-gray-500">of the following</span>
        {!isRoot && onRemoveGroup && (
          <button
            type="button"
            onClick={() => {
              onRemoveGroup();
              onImmediateSave();
            }}
            className="ml-auto rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
          >
            Remove Group
          </button>
        )}
      </div>

      <div className="mt-3 space-y-2">
        {fields.map((field, index) => {
          const childPrefix = `${childrenName}.${index}`;

          // Check if this child is a group by looking at the field data
          const childData = field as Record<string, unknown>;
          if (childData.type === 'group') {
            return (
              <ConditionGroupEditor
                key={field.id}
                control={control}
                onImmediateSave={onImmediateSave}
                namePrefix={childPrefix}
                nestingDepth={nestingDepth + 1}
                isRoot={false}
                onRemoveGroup={() => remove(index)}
              />
            );
          }

          return (
            <ConditionRow
              key={field.id}
              control={control}
              namePrefix={childPrefix}
              onRemove={() => remove(index)}
              onImmediateSave={onImmediateSave}
            />
          );
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => {
            append({
              type: 'condition' as const,
              id: crypto.randomUUID(),
              field: '',
              operator: ComparisonOperator.Equals,
              value: '',
            });
            onImmediateSave();
          }}
          className="rounded border border-dashed border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500"
        >
          + Add Condition
        </button>
        <button
          type="button"
          onClick={() => {
            append({
              type: 'group' as const,
              id: crypto.randomUUID(),
              operator: LogicalOperator.And,
              children: [
                {
                  type: 'condition' as const,
                  id: crypto.randomUUID(),
                  field: '',
                  operator: ComparisonOperator.Equals,
                  value: '',
                },
              ],
            } as unknown as AutomationFormValues['conditionGroup']['children'][number]);
            onImmediateSave();
          }}
          className="rounded border border-dashed border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500"
        >
          + Add Group
        </button>
      </div>
    </div>
  );
}
