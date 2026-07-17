import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { ItineraryDay, Place } from "../types";
import { TRIP_LENGTH_DAYS } from "../config/constants";

function createInitialDays(): ItineraryDay[] {
  return Array.from({ length: TRIP_LENGTH_DAYS }, (_, i) => ({
    id: uuidv4(),
    dayIndex: i + 1,
    date: "",
    title: `第 ${i + 1} 天`,
    items: [],
  }));
}

interface ItineraryState {
  days: ItineraryDay[];

  addPlaceToDay: (dayId: string, place: Place) => void;
  removeItem: (dayId: string, itemId: string) => void;
  updateDayTitle: (dayId: string, title: string) => void;
  updateDayDate: (dayId: string, date: string) => void;
  moveItem: (params: {
    itemId: string;
    fromDayId: string;
    toDayId: string;
    toIndex: number;
  }) => void;
  replaceAllDays: (days: ItineraryDay[]) => void;
  resetItinerary: () => void;
}

export const useItineraryStore = create<ItineraryState>()(
  persist(
    (set) => ({
      days: createInitialDays(),

      addPlaceToDay: (dayId, place) =>
        set((state) => ({
          days: state.days.map((day) =>
            day.id === dayId
              ? { ...day, items: [...day.items, { id: uuidv4(), place }] }
              : day
          ),
        })),

      removeItem: (dayId, itemId) =>
        set((state) => ({
          days: state.days.map((day) =>
            day.id === dayId
              ? { ...day, items: day.items.filter((i) => i.id !== itemId) }
              : day
          ),
        })),

      updateDayTitle: (dayId, title) =>
        set((state) => ({
          days: state.days.map((day) =>
            day.id === dayId ? { ...day, title } : day
          ),
        })),

      updateDayDate: (dayId, date) =>
        set((state) => ({
          days: state.days.map((day) =>
            day.id === dayId ? { ...day, date } : day
          ),
        })),

      moveItem: ({ itemId, fromDayId, toDayId, toIndex }) =>
        set((state) => {
          const days = state.days.map((d) => ({ ...d, items: [...d.items] }));
          const fromDay = days.find((d) => d.id === fromDayId);
          const toDay = days.find((d) => d.id === toDayId);
          if (!fromDay || !toDay) return { days: state.days };

          const itemIndex = fromDay.items.findIndex((i) => i.id === itemId);
          if (itemIndex === -1) return { days: state.days };

          const [item] = fromDay.items.splice(itemIndex, 1);
          const clampedIndex = Math.max(0, Math.min(toIndex, toDay.items.length));
          toDay.items.splice(clampedIndex, 0, item);

          return { days };
        }),

      replaceAllDays: (days) => set({ days }),

      resetItinerary: () => set({ days: createInitialDays() }),
    }),
    {
      name: "smart-map-italy-itinerary",
    }
  )
);
