import { useState, useRef } from 'react';
import { z } from 'zod';

const isValidEmail = (email: string) => z.email().safeParse(email).success;

export function RecipientChipInput({
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
        const valid = isValidEmail(email);
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
