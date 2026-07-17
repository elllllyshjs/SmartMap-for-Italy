import { useMapStore } from "../../store/useMapStore";
import { getCategoryConfig } from "../../config/constants";
import AddToItineraryButton from "../itinerary/AddToItineraryButton";

export default function PlaceInfoPanel() {
  const selectedPlace = useMapStore((s) => s.selectedPlace);
  const selectPlace = useMapStore((s) => s.selectPlace);

  if (!selectedPlace) return null;

  const config = getCategoryConfig(selectedPlace.category);

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10 max-w-md rounded-2xl bg-white p-4 shadow-xl sm:right-auto">
      <button
        className="absolute right-3 top-3 text-gray-400 transition-colors hover:text-gray-600"
        onClick={() => selectPlace(null)}
        aria-label="关闭"
      >
        ✕
      </button>

      {selectedPlace.photoUrl && (
        <img
          src={selectedPlace.photoUrl}
          alt={selectedPlace.name}
          className="mb-3 h-40 w-full rounded-xl object-cover"
        />
      )}

      <div className="mb-1 flex flex-wrap items-center gap-2">
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
          style={{ backgroundColor: config.color }}
        >
          {config.label}
        </span>
        {selectedPlace.rating !== undefined && (
          <span className="text-sm text-gray-500">
            ⭐ {selectedPlace.rating}（{selectedPlace.userRatingCount ?? 0} 条评价）
          </span>
        )}
      </div>

      <h3 className="mb-1 pr-6 text-lg font-semibold text-gray-900">
        {selectedPlace.name}
      </h3>

      {selectedPlace.address && (
        <p className="mb-2 text-sm text-gray-500">{selectedPlace.address}</p>
      )}

      {selectedPlace.description && (
        <p className="mb-3 text-sm leading-relaxed text-gray-700">
          {selectedPlace.description}
        </p>
      )}

      <AddToItineraryButton place={selectedPlace} />
    </div>
  );
}
