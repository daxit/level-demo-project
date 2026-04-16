import { DndContext, type DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useFieldArray, useFormContext } from 'react-hook-form';

import type { AutomationFormValues } from '../utilities/automationTransform';

import { ActionForm } from './ActionForm';

type ActionType = 'sendNotification' | 'runScript';

function SortableAction({
  id,
  index,
  actionType,
  onRemove,
}: {
  id: string;
  index: number;
  actionType: ActionType;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
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
          <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
            <circle cx="4" cy="3" r="1.5" />
            <circle cx="8" cy="3" r="1.5" />
            <circle cx="4" cy="8" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="4" cy="13" r="1.5" />
            <circle cx="8" cy="13" r="1.5" />
          </svg>
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {actionType === 'sendNotification' ? 'Send Notification' : 'Run Script'}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="ml-auto cursor-pointer opacity-0 transition-opacity group-hover:opacity-100 rounded px-1 py-0.5 text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400"
        >
          &times;
        </button>
      </div>
      <ActionForm index={index} actionType={actionType} />
    </div>
  );
}

export function ActionsEditor() {
  const { control } = useFormContext<AutomationFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'actions',
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex);
      }
    }
  };

  const getActionType = (action: AutomationFormValues['actions'][number]): ActionType => {
    return action.sendNotification ? 'sendNotification' : 'runScript';
  };

  return (
    <div className="space-y-3">
      {fields.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-500">No actions yet.</p>
      )}
      {fields.length > 0 && (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            {fields.map((field, index) => (
              <SortableAction
                key={field.id}
                id={field.id}
                index={index}
                actionType={getActionType(field)}
                onRemove={() => remove(index)}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            append({ sendNotification: { recipients: [], subject: '', body: '' } });
          }}
          className="cursor-pointer text-sm text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          + Send Notification
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            append({ runScript: { script: '', args: [], timeout: null } });
          }}
          className="cursor-pointer text-sm text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          + Run Script
        </button>
      </div>
    </div>
  );
}
