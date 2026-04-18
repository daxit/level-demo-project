import { Controller, useFormContext, useFormState } from 'react-hook-form';

import { AutomationFormValues } from '../utilities/automationTransform';
import { RecipientChipInput } from './RecipientChipInput';

export function SendNotificationAction({ index }: { index: number }) {
  const { control } = useFormContext<AutomationFormValues>();
  const { errors } = useFormState({ control });
  const actionErrors = errors.actions?.[index];

  return (
    <div className="space-y-2">
      <Controller
        name={`actions.${index}.sendNotification.recipients`}
        rules={{ required: 'At least one recipient is required' }}
        render={({ field }) => (
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
              Recipients
            </label>
            <RecipientChipInput value={field.value ?? []} onChange={field.onChange} />
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
