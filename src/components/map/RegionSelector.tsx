import { REGIONS } from "../../config/constants";
import { useMapStore } from "../../store/useMapStore";

export default function RegionSelector() {
  const selectedRegion = useMapStore((s) => s.selectedRegion);
  const setSelectedRegion = useMapStore((s) => s.setSelectedRegion);

  return (
    <select
      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-italy-green"
      value={selectedRegion.id}
      onChange={(e) => {
        const region = REGIONS.find((r) => r.id === e.target.value);
        if (region) setSelectedRegion(region);
      }}
    >
      {REGIONS.map((region) => (
        <option key={region.id} value={region.id}>
          {region.name}
        </option>
      ))}
    </select>
  );
}
