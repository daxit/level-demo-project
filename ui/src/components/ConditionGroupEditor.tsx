import { Plus, X } from 'lucide-react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import type { UIConditionGroup, UIConditionLeaf } from '../types/condition-tree';
import type { AutomationFormValues } from '../utilities/automationTransform';

import { ComparisonOperator, LogicalOperator } from '../gql/graphql';
import { ConditionRow } from './ConditionRow';
import { InlineSelect } from './InlineTokens';

const LOGICAL_OPTIONS = [
  { value: LogicalOperator.And, label: 'all' },
  { value: LogicalOperator.Or, label: 'any' },
];

interface ConditionGroupEditorProps {
  namePrefix?: string;
  nestingDepth?: number;
  isRoot?: boolean;
  onRemoveGroup?: () => void;
}

export function ConditionGroupEditor({
  namePrefix = 'conditionGroup',
  nestingDepth = 0,
  isRoot = true,
  onRemoveGroup,
}: ConditionGroupEditorProps) {
  const { control } = useFormContext<AutomationFormValues>();
  const childrenName = `${namePrefix}.children` as 'conditionGroup.children';
  const operatorName = `${namePrefix}.operator` as 'conditionGroup.operator';

  const { fields, append, remove } = useFieldArray({
    control,
    name: childrenName,
  });

  const cardClass =
    nestingDepth === 0
      ? ''
      : nestingDepth === 1
        ? 'rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/40'
        : 'rounded-lg border border-gray-200 bg-gray-100 p-3 dark:border-gray-700 dark:bg-gray-800/60';

  return (
    <div className={cardClass}>
      <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
        <span className="text-sm text-gray-500">If</span>
        <Controller
          name={operatorName}
          render={({ field }) => (
            <InlineSelect value={field.value} options={LOGICAL_OPTIONS} onChange={field.onChange} />
          )}
        />
        <span className="text-sm text-gray-500">of the following are true</span>
        {!isRoot && onRemoveGroup && (
          <button
            type="button"
            onClick={onRemoveGroup}
            className="ml-auto cursor-pointer text-gray-300 hover:text-red-400 dark:text-gray-600 dark:hover:text-red-400"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="mt-3 space-y-3">
        {fields.map((field, index) => {
          const childPrefix = `${childrenName}.${index}`;

          const childData = field as Record<string, unknown>;
          if (childData.type === 'group') {
            return (
              <ConditionGroupEditor
                key={field.id}
                namePrefix={childPrefix}
                nestingDepth={nestingDepth + 1}
                isRoot={false}
                onRemoveGroup={() => remove(index)}
              />
            );
          }

          return (
            <ConditionRow key={field.id} namePrefix={childPrefix} onRemove={() => remove(index)} />
          );
        })}
      </div>

      <div className="mt-3 flex gap-3 border-t border-gray-100 pt-2 dark:border-gray-700">
        <button
          type="button"
          onClick={() => {
            const leaf: UIConditionLeaf = {
              type: 'condition',
              id: crypto.randomUUID(),
              field: '',
              operator: ComparisonOperator.Equals,
              value: '',
            };
            append(leaf);
          }}
          className="flex cursor-pointer items-center gap-1 text-sm text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <Plus size={13} />
          condition
        </button>
        <button
          type="button"
          onClick={() => {
            const group: UIConditionGroup = {
              type: 'group',
              id: crypto.randomUUID(),
              operator: LogicalOperator.And,
              children: [
                {
                  type: 'condition',
                  id: crypto.randomUUID(),
                  field: '',
                  operator: ComparisonOperator.Equals,
                  value: '',
                },
              ],
            };
            append(group);
          }}
          className="flex cursor-pointer items-center gap-1 text-sm text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <Plus size={13} />
          group
        </button>
      </div>
    </div>
  );
}
