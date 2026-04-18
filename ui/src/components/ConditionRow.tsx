import { X } from 'lucide-react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import type { AutomationFormValues } from '../utilities/automationTransform';

import { ComparisonOperator } from '../gql/graphql';
import { InlineNumber, InlineSelect, InlineText } from './InlineTokens';

const NUMERIC_OPERATORS = new Set([
  ComparisonOperator.GreaterThan,
  ComparisonOperator.LessThan,
  ComparisonOperator.GreaterThanOrEquals,
  ComparisonOperator.LessThanOrEquals,
]);

const OPERATOR_OPTIONS = [
  { value: ComparisonOperator.Equals, label: 'is' },
  { value: ComparisonOperator.NotEquals, label: 'is not' },
  { value: ComparisonOperator.GreaterThan, label: '>' },
  { value: ComparisonOperator.LessThan, label: '<' },
  { value: ComparisonOperator.GreaterThanOrEquals, label: '≥' },
  { value: ComparisonOperator.LessThanOrEquals, label: '≤' },
  { value: ComparisonOperator.Contains, label: 'contains' },
  { value: ComparisonOperator.NotContains, label: "doesn't contain" },
];

interface ConditionRowProps {
  namePrefix: string;
  onRemove: () => void;
}

export function ConditionRow({ namePrefix, onRemove }: ConditionRowProps) {
  const { control, setValue } = useFormContext<AutomationFormValues>();
  const operator = useWatch({
    control,
    name: `${namePrefix}.operator` as `conditionGroup.children.${number}.operator`,
  }) as ComparisonOperator;
  const isNumeric = NUMERIC_OPERATORS.has(operator);

  return (
    <div className="group flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
      <Controller
        control={control}
        name={`${namePrefix}.field` as `conditionGroup.children.${number}.field`}
        rules={{
          required: 'Field is required',
          validate: (v: string) => v.trim() !== '' || 'Field is required',
        }}
        render={({ field }) => (
          <InlineText value={field.value} onChange={field.onChange} placeholder="field" />
        )}
      />
      <Controller
        control={control}
        name={`${namePrefix}.operator` as `conditionGroup.children.${number}.operator`}
        render={({ field }) => (
          <InlineSelect
            value={field.value}
            options={OPERATOR_OPTIONS}
            onChange={(v) => {
              const wasNumeric = NUMERIC_OPERATORS.has(field.value as ComparisonOperator);
              const willBeNumeric = NUMERIC_OPERATORS.has(v as ComparisonOperator);
              if (wasNumeric !== willBeNumeric) {
                setValue(`${namePrefix}.value` as `conditionGroup.children.${number}.value`, '');
              }
              field.onChange(v);
            }}
          />
        )}
      />
      <Controller
        control={control}
        name={`${namePrefix}.value` as `conditionGroup.children.${number}.value`}
        render={({ field }) =>
          isNumeric ? (
            <InlineNumber
              value={field.value === '' ? null : Number(field.value)}
              onChange={(v) => field.onChange(v == null ? '' : String(v))}
              placeholder="0"
            />
          ) : (
            <InlineText value={field.value} onChange={field.onChange} placeholder="value" />
          )
        }
      />
      <button
        type="button"
        onClick={onRemove}
        className="cursor-pointer rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
      >
        <X size={14} />
      </button>
    </div>
  );
}
