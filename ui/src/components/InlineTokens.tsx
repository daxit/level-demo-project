import * as Select from '@radix-ui/react-select';

export function InlineSelect<T extends string>({
  value,
  options,
  onChange,
  width = 'auto',
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  width?: string;
}) {
  return (
    <Select.Root value={value} onValueChange={(v) => onChange(v as T)}>
      <Select.Trigger
        className="group inline-flex cursor-pointer items-center gap-1 rounded-sm border-b border-blue-200 px-2 py-1 text-sm text-blue-700 hover:bg-blue-50 focus:outline-none dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950"
        style={width !== 'auto' ? { minWidth: width } : undefined}
      >
        <Select.Value />
        <Select.Icon className="opacity-0 transition-opacity group-hover:opacity-100 text-blue-400 dark:text-blue-500">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className="z-50 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <Select.Viewport className="p-1">
            {options.map((opt) => (
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
  );
}

export function InlineNumber({
  value,
  onChange,
  onBlur,
  min,
  max,
  placeholder,
  width = '6ch',
  autoWidth,
}: {
  value: number | null | '';
  onChange: (v: number | null) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  placeholder?: string;
  width?: string;
  autoWidth?: { min: string; max: string };
}) {
  const dynamicWidth = autoWidth
    ? `clamp(${autoWidth.min}, ${String(value ?? '').length + 4}ch, ${autoWidth.max})`
    : width;

  return (
    <input
      type="number"
      min={min}
      max={max}
      step="any"
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
      onBlur={onBlur}
      style={{ width: dynamicWidth }}
      className="inline-block rounded-sm border-b border-blue-200 px-1.5 py-1 text-sm text-blue-700 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950 dark:focus:bg-blue-950"
    />
  );
}

export function InlineText({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`inline-block min-w-[6ch] rounded-sm border-b border-blue-200 bg-transparent px-2 py-1 text-sm text-gray-800 placeholder:text-gray-300 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none dark:border-blue-800 dark:text-gray-200 dark:placeholder:text-gray-600 dark:hover:bg-blue-950 dark:focus:bg-blue-950 ${className ?? ''}`}
    />
  );
}
