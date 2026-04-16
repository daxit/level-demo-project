import { useRef, useState } from 'react';
import { Controller, useFormContext, useFormState } from 'react-hook-form';

import type { AutomationFormValues } from '../utilities/automationTransform';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RecipientChipInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      commit(input);
    } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.endsWith(',') || val.endsWith(' ')) {
      commit(val.slice(0, -1));
    } else {
      setInput(val);
    }
  };

  const handleBlur = () => {
    if (input.trim()) commit(input);
  };

  return (
    <div
      className="mt-1 flex min-h-[2.25rem] flex-wrap gap-1.5 rounded border border-gray-300 px-2 py-1.5 focus-within:border-blue-400 dark:border-gray-600 dark:bg-gray-800 dark:focus-within:border-blue-500"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((email, i) => {
        const valid = EMAIL_RE.test(email);
        return (
          <span
            key={i}
            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs ${
              valid
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
            }`}
          >
            {email}
            {!valid && (
              <span className="text-amber-500 dark:text-amber-400" title="Invalid email address">
                ⚠
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(value.filter((_, j) => j !== i));
              }}
              className="ml-0.5 cursor-pointer opacity-60 hover:opacity-100"
            >
              &times;
            </button>
          </span>
        );
      })}
      <input
        ref={inputRef}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={value.length === 0 ? 'email@example.com' : ''}
        className="min-w-[8ch] flex-1 bg-transparent text-sm outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600"
      />
    </div>
  );
}

interface ActionFormProps {
  index: number;
  actionType: 'sendNotification' | 'runScript';
}

export function ActionForm({ index, actionType }: ActionFormProps) {
  const { control } = useFormContext<AutomationFormValues>();
  const { errors } = useFormState({ control });
  const actionErrors = errors.actions?.[index];

  if (actionType === 'sendNotification') {
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
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
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
