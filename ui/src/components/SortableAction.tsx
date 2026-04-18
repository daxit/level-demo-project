import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';

interface SortableActionProps {
  id: string;
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}

export function SortableAction({ id, title, onRemove, children }: SortableActionProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className="group rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400"
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {title}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="ml-auto cursor-pointer opacity-0 transition-opacity group-hover:opacity-100 rounded px-1 py-0.5 text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400"
        >
          <X size={12} />
        </button>
      </div>
      {children}
    </div>
  );
}
