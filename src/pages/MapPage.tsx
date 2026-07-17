import RegionSelector from "../components/map/RegionSelector";
import CategoryFilter from "../components/map/CategoryFilter";
import MapView from "../components/map/MapView";

export default function MapPage() {
  return (
    <div className="flex h-full flex-col gap-3 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <RegionSelector />
        <CategoryFilter />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl shadow-sm">
        <MapView />
      </div>
    </div>
  );
}
