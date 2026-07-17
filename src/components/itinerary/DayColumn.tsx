import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { ItineraryDay } from "../../types";
import { useItineraryStore } from "../../store/useItineraryStore";
import ItineraryItemCard from "./ItineraryItemCard";
import RouteSummary from "./RouteSummary";

interface Props {
  day: ItineraryDay;
}

export default function DayColumn({ day }: Props) {
  const updateDayTitle = useItineraryStore((s) => s.updateDayTitle);
  const updateDayDate = useItineraryStore((s) => s.updateDayDate);
  const { setNodeRef, isOver } = useDroppable({ id: day.id });

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-2xl bg-white shadow-sm">
      <div className="border-b border-gray-100 p-3">
        <div className="mb-1 text-xs font-medium text-gray-400">第 {day.dayIndex} 天</div>
        <input
          className="w-full rounded-md border-none bg-transparent p-0 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-italy-green"
          value={day.title}
          onChange={(e) => updateDayTitle(day.id, e.target.value)}
        />
        <input
          type="date"
          className="mt-1 w-full rounded-md border-none bg-transparent p-0 text-xs text-gray-500 focus:outline-none"
          value={day.date}
          onChange={(e) => updateDayDate(day.id, e.target.value)}
        />
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 overflow-y-auto p-3 transition-colors ${
          isOver ? "bg-italy-green/5" : ""
        }`}
        style={{ minHeight: 120 }}
      >
        <SortableContext items={day.items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {day.items.map((item) => (
            <ItineraryItemCard key={item.id} item={item} dayId={day.id} />
          ))}
        </SortableContext>
        {day.items.length === 0 && (
          <p className="pt-6 text-center text-xs text-gray-300">拖拽或从地图加入地点</p>
        )}
      </div>

      <RouteSummary day={day} />
    </div>
  );
}
