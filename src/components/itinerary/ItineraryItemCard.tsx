import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ItineraryItem } from "../../types";
import { getCategoryConfig } from "../../config/constants";
import { useItineraryStore } from "../../store/useItineraryStore";

interface Props {
  item: ItineraryItem;
  dayId: string;
  isOverlay?: boolean;
}

export default function ItineraryItemCard({ item, dayId, isOverlay }: Props) {
  const removeItem = useItineraryStore((s) => s.removeItem);
  const config = getCategoryConfig(item.place.category);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: isOverlay,
  });

  const style = isOverlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      };

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={style}
      {...(isOverlay ? {} : attributes)}
      {...(isOverlay ? {} : listeners)}
      className={`group relative rounded-xl border border-gray-100 bg-gray-50 p-2.5 ${
        isOverlay ? "shadow-lg" : "cursor-grab active:cursor-grabbing"
      }`}
    >
      <div className="flex items-start gap-2">
        <span
          className="mt-1 h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: config.color }}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-800">{item.place.name}</p>
          {item.place.address && (
            <p className="truncate text-xs text-gray-400">{item.place.address}</p>
          )}
        </div>
        {!isOverlay && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeItem(dayId, item.id);
            }}
            className="shrink-0 text-gray-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
            aria-label="移除"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
