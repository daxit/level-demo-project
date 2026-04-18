import { Controller, useFormContext, useFormState } from 'react-hook-form';

import type { AutomationFormValues } from '../utilities/automationTransform';

interface RunScriptActionProps {
  index: number;
}

export function RunScriptAction({ index }: RunScriptActionProps) {
  const { control } = useFormContext<AutomationFormValues>();
  const { errors } = useFormState({ control });
  const actionErrors = errors.actions?.[index];

  return (
    <div className="space-y-2">
      <Controller
        name={`actions.${index}.runScript.script`}
        rules={{
          required: 'Script name is required',
          validate: (v) => !v || (!v.includes('/') && !v.includes('\\')) || 'Invalid filename',
        }}
        render={({ field }) => (
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
              Script Name
            </label>
            <input
              {...field}
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
            />
            {actionErrors?.runScript?.script && (
              <p className="mt-0.5 text-xs text-red-600">{actionErrors.runScript.script.message}</p>
            )}
          </div>
        )}
      />
      <Controller
        name={`actions.${index}.runScript.args`}
        render={({ field }) => (
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
              Arguments (one per line)
            </label>
            <textarea
              value={(field.value ?? []).join('\n')}
              onChange={(e) => field.onChange(e.target.value ? e.target.value.split('\n') : [])}
              rows={2}
              className="mt-1 w-full min-h-[2.25rem] resize-none rounded border border-gray-300 px-2 py-1.5 font-mono text-sm [field-sizing:content] dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
        )}
      />
      <Controller
        name={`actions.${index}.runScript.timeout`}
        render={({ field }) => (
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
              Timeout (seconds, optional)
            </label>
            <input
              type="number"
              step={1}
              value={field.value ?? ''}
              onChange={(e) =>
                field.onChange(e.target.value === '' ? null : Number(e.target.value))
              }
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
        )}
      />
    </div>
  );
}
