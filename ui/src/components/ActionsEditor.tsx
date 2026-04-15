import { DndContext, type DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as Select from '@radix-ui/react-select';
import { type Control, useFieldArray } from 'react-hook-form';

import type { AutomationFormValues } from './DetailPanel';

import { ActionForm } from './ActionForm';

interface ActionsEditorProps {
  control: Control<AutomationFormValues>;
  onImmediateSave: () => void;
}

type ActionType = 'sendNotification' | 'runScript';

function SortableAction({
  id,
  index,
  control,
  actionType,
  onRemove,
}: {
  id: string;
  index: number;
  control: Control<AutomationFormValues>;
  actionType: ActionType;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="mb-2 flex items-center gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-gray-400 hover:text-gray-600"
        >
          &#8942;&#8942;
        </button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {actionType === 'sendNotification' ? 'Send Notification' : 'Run Script'}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="ml-auto rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
        >
          &times;
        </button>
      </div>
      <ActionForm control={control} index={index} actionType={actionType} />
    </div>
  );
}

export function ActionsEditor({ control, onImmediateSave }: ActionsEditorProps) {
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
        onImmediateSave();
      }
    }
  };

  const getActionType = (action: AutomationFormValues['actions'][number]): ActionType => {
    return action.sendNotification ? 'sendNotification' : 'runScript';
  };

  return (
    <div className="space-y-3">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          {fields.map((field, index) => (
            <SortableAction
              key={field.id}
              id={field.id}
              index={index}
              control={control}
              actionType={getActionType(field)}
              onRemove={() => {
                remove(index);
                onImmediateSave();
              }}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Select.Root
        onValueChange={(v: string) => {
          if (v === 'sendNotification') {
            append({
              sendNotification: { recipients: [], subject: '', body: '' },
            });
          } else {
            append({
              runScript: { script: '', args: [], timeout: null },
            });
          }
          onImmediateSave();
        }}
      >
        <Select.Trigger className="inline-flex items-center gap-2 rounded border border-dashed border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500">
          + Add Action
          <Select.Icon className="text-gray-400">&#9662;</Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="overflow-hidden rounded border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <Select.Viewport className="p-1">
              <Select.Item
                value="sendNotification"
                className="cursor-pointer rounded px-3 py-2 text-sm outline-none data-[highlighted]:bg-blue-50 dark:data-[highlighted]:bg-blue-950"
              >
                <Select.ItemText>Send Notification</Select.ItemText>
              </Select.Item>
              <Select.Item
                value="runScript"
                className="cursor-pointer rounded px-3 py-2 text-sm outline-none data-[highlighted]:bg-blue-50 dark:data-[highlighted]:bg-blue-950"
              >
                <Select.ItemText>Run Script</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
