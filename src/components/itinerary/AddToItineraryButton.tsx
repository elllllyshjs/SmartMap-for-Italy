import { useState } from "react";
import { useItineraryStore } from "../../store/useItineraryStore";
import type { Place } from "../../types";

interface Props {
  place: Place;
}

export default function AddToItineraryButton({ place }: Props) {
  const days = useItineraryStore((s) => s.days);
  const addPlaceToDay = useItineraryStore((s) => s.addPlaceToDay);
  const [dayId, setDayId] = useState(days[0]?.id ?? "");
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    if (!dayId) return;
    addPlaceToDay(dayId, place);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <div className="flex items-center gap-2">
      <select
        className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-italy-green"
        value={dayId}
        onChange={(e) => setDayId(e.target.value)}
      >
        {days.map((day) => (
          <option key={day.id} value={day.id}>
            第 {day.dayIndex} 天{day.title && day.title !== `第 ${day.dayIndex} 天` ? ` · ${day.title}` : ""}
          </option>
        ))}
      </select>
      <button
        onClick={handleAdd}
        className="whitespace-nowrap rounded-lg bg-italy-green px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        {justAdded ? "已加入 ✓" : "加入行程"}
      </button>
    </div>
  );
}
