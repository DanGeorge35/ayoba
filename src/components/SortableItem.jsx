import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// import { useRef } from "react";

export default function SortableItem({ id, disabled, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // const wrapperRef = useRef();

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-start gap-2">
        {/* Optional Drag Handle */}
        {!disabled && (
          <div
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            className="cursor-move text-gray-400 mt-1 select-none"
            title="Drag to reorder"
          >
            ☰
          </div>
        )}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
