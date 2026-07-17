import { useEffect } from "react";
import { Map, useMap } from "@vis.gl/react-google-maps";
import { useMapStore } from "../../store/useMapStore";
import { searchNearbyPlaces } from "../../lib/placesService";
import { ITALY_DEFAULT_ZOOM, ITALY_CENTER } from "../../config/constants";
import PlaceMarker from "./PlaceMarker";
import PlaceInfoPanel from "./PlaceInfoPanel";
import Loading from "../common/Loading";

/** 当选中大区变化时，平滑移动地图视角（不会打断用户手动拖拽/缩放） */
function MapCameraController() {
  const map = useMap();
  const selectedRegion = useMapStore((s) => s.selectedRegion);

  useEffect(() => {
    if (!map) return;
    map.panTo(selectedRegion.center);
    map.setZoom(selectedRegion.zoom);
  }, [map, selectedRegion]);

  return null;
}

export default function MapView() {
  const selectedRegion = useMapStore((s) => s.selectedRegion);
  const activeCategory = useMapStore((s) => s.activeCategory);
  const places = useMapStore((s) => s.places);
  const isLoadingPlaces = useMapStore((s) => s.isLoadingPlaces);
  const loadError = useMapStore((s) => s.loadError);
  const setPlaces = useMapStore((s) => s.setPlaces);
  const setLoading = useMapStore((s) => s.setLoading);
  const setLoadError = useMapStore((s) => s.setLoadError);

  useEffect(() => {
    let cancelled = false;

    async function loadPlaces() {
      setLoading(true);
      setLoadError(null);
      try {
        const results = await searchNearbyPlaces(selectedRegion.center, activeCategory);
        if (!cancelled) setPlaces(results);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "地点加载失败");
          setPlaces([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPlaces();
    return () => {
      cancelled = true;
    };
  }, [selectedRegion, activeCategory, setPlaces, setLoading, setLoadError]);

  return (
    <div className="relative h-full w-full">
      <Map
        defaultCenter={ITALY_CENTER}
        defaultZoom={ITALY_DEFAULT_ZOOM}
        gestureHandling="greedy"
        disableDefaultUI={false}
        clickableIcons={false}
        style={{ width: "100%", height: "100%" }}
      >
        <MapCameraController />
        {places.map((place) => (
          <PlaceMarker key={place.id} place={place} />
        ))}
      </Map>

      {isLoadingPlaces && (
        <div className="absolute left-1/2 top-4 -translate-x-1/2">
          <Loading label="正在搜索地点..." />
        </div>
      )}

      {loadError && (
        <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 shadow">
          {loadError}
        </div>
      )}

      <PlaceInfoPanel />
    </div>
  );
}
