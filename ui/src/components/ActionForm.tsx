import { type Control, Controller, useFormState } from 'react-hook-form';

import type { AutomationFormValues } from './DetailPanel';

interface ActionFormProps {
  control: Control<AutomationFormValues>;
  index: number;
  actionType: 'sendNotification' | 'runScript';
}

export function ActionForm({ control, index, actionType }: ActionFormProps) {
  const { errors } = useFormState({ control });
  const actionErrors = errors.actions?.[index];

  if (actionType === 'sendNotification') {
    return (
      <div className="space-y-2">
        <Controller
          name={`actions.${index}.sendNotification.recipients`}
          control={control}
          rules={{ required: 'At least one recipient is required' }}
          render={({ field }) => (
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                Recipients (comma-separated emails)
              </label>
              <textarea
                value={(field.value ?? []).join(', ')}
                onChange={(e) =>
                  field.onChange(
                    e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  )
                }
                rows={2}
                className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
              />
              {actionErrors?.sendNotification?.recipients && (
                <p className="mt-0.5 text-xs text-red-600">
                  {actionErrors.sendNotification.recipients.message}
                </p>
              )}
            </div>
          )}
        />
        <Controller
          name={`actions.${index}.sendNotification.subject`}
          control={control}
          rules={{ required: 'Subject is required' }}
          render={({ field }) => (
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                Subject
              </label>
              <input
                {...field}
                className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
              />
              {actionErrors?.sendNotification?.subject && (
                <p className="mt-0.5 text-xs text-red-600">
                  {actionErrors.sendNotification.subject.message}
                </p>
              )}
            </div>
          )}
        />
        <Controller
          name={`actions.${index}.sendNotification.body`}
          control={control}
          rules={{ required: 'Body is required' }}
          render={({ field }) => (
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                Body
              </label>
              <textarea
                {...field}
                rows={3}
                className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
              />
              {actionErrors?.sendNotification?.body && (
                <p className="mt-0.5 text-xs text-red-600">
                  {actionErrors.sendNotification.body.message}
                </p>
              )}
            </div>
          )}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Controller
        name={`actions.${index}.runScript.script`}
        control={control}
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
        control={control}
        render={({ field }) => (
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
              Arguments (one per line)
            </label>
            <textarea
              value={(field.value ?? []).join('\n')}
              onChange={(e) => field.onChange(e.target.value ? e.target.value.split('\n') : [])}
              rows={2}
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
        )}
      />
      <Controller
        name={`actions.${index}.runScript.timeout`}
        control={control}
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
