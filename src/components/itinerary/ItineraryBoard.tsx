import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useItineraryStore } from "../../store/useItineraryStore";
import DayColumn from "./DayColumn";
import ItineraryItemCard from "./ItineraryItemCard";
import type { ItineraryItem } from "../../types";

export default function ItineraryBoard() {
  const days = useItineraryStore((s) => s.days);
  const moveItem = useItineraryStore((s) => s.moveItem);
  const [activeItem, setActiveItem] = useState<ItineraryItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function findDayIdByItemId(itemId: string): string | undefined {
    return days.find((d) => d.items.some((i) => i.id === itemId))?.id;
  }

  function handleDragStart(event: DragStartEvent) {
    const itemId = event.active.id as string;
    for (const day of days) {
      const found = day.items.find((i) => i.id === itemId);
      if (found) {
        setActiveItem(found);
        break;
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveItem(null);
    const { active, over } = event;
    if (!over) return;

    const activeItemId = active.id as string;
    const overId = over.id as string;

    const fromDayId = findDayIdByItemId(activeItemId);
    if (!fromDayId) return;

    // over 可能是某一天的空白容器本身，也可能是容器内的某张卡片
    const overIsDay = days.some((d) => d.id === overId);
    let toDayId: string | undefined;
    let toIndex: number;

    if (overIsDay) {
      toDayId = overId;
      toIndex = days.find((d) => d.id === toDayId)!.items.length;
    } else {
      toDayId = findDayIdByItemId(overId);
      if (!toDayId) return;
      const toDay = days.find((d) => d.id === toDayId)!;
      const overIndex = toDay.items.findIndex((i) => i.id === overId);
      toIndex = overIndex === -1 ? toDay.items.length : overIndex;
    }

    if (fromDayId === toDayId && activeItemId === overId) return;

    moveItem({ itemId: activeItemId, fromDayId, toDayId, toIndex });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-4 overflow-x-auto pb-4">
        {days.map((day) => (
          <DayColumn key={day.id} day={day} />
        ))}
      </div>

      <DragOverlay>
        {activeItem ? (
          <ItineraryItemCard item={activeItem} dayId="" isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
