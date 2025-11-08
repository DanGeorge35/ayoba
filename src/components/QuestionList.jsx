import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import QuestionCard from "./QuestionCard";
import { useState } from "react";

export default function QuestionList({
  questions,
  onDragEnd,
  onSave,
  onDelete,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [editingId, setEditingId] = useState(null);

  const grouped = questions.reduce((acc, q) => {
    const key = q.module || "Uncategorized";
    acc[key] = acc[key] || [];
    acc[key].push(q);
    return acc;
  }, {});

  return (
    <>
      {Object.keys(grouped).map((modKey) => (
        <div key={modKey} className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Module: {modKey}</h2>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={grouped[modKey].map((q) => q.id)}
              strategy={verticalListSortingStrategy}
            >
              {grouped[modKey].map((q) => (
                <SortableItem
                  key={q.id}
                  id={q.id}
                  disabled={editingId === q.id}
                >
                  <QuestionCard
                    question={q}
                    isEditing={editingId === q.id}
                    setIsEditing={(val) => {
                      setEditingId(val ? q.id : null);
                    }}
                    onSave={onSave}
                    onDelete={onDelete}
                  />
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      ))}
    </>
  );
}
