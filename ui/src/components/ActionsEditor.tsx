import { DndContext, type DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import type { AutomationFormValues } from '../utilities/automationTransform';

import { RunScriptAction } from './RunScriptAction';
import { SendNotificationAction } from './SendNotificationAction';
import { SortableAction } from './SortableAction';

export function ActionsEditor() {
  const { control, watch } = useFormContext<AutomationFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'actions',
  });
  const watchedActions = watch('actions');
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...(watchedActions?.[index] ?? {}),
  }));

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

  return (
    <div className="space-y-3">
      {fields.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-500">No actions yet.</p>
      )}
      {fields.length > 0 && (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            {controlledFields.map((field, index) => {
              const isNotification = field.sendNotification != null;
              return (
                <SortableAction
                  key={field.id}
                  id={field.id}
                  title={isNotification ? 'Send Notification' : 'Run Script'}
                  onRemove={() => remove(index)}
                >
                  {isNotification ? (
                    <SendNotificationAction index={index} />
                  ) : (
                    <RunScriptAction index={index} />
                  )}
                </SortableAction>
              );
            })}
          </SortableContext>
        </DndContext>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            append({ sendNotification: { recipients: [], subject: '', body: '' } });
          }}
          className="flex cursor-pointer items-center gap-1 text-sm text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <Plus size={13} />
          Send Notification
        </button>
        <button
          type="button"
          onClick={() => {
            append({ runScript: { script: '', args: [], timeout: null } });
          }}
          className="flex cursor-pointer items-center gap-1 text-sm text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <Plus size={13} />
          Run Script
        </button>
      </div>
    </div>
  );
}
