import { Marker } from "@vis.gl/react-google-maps";
import type { Place } from "../../types";
import { getCategoryConfig } from "../../config/constants";
import { useMapStore } from "../../store/useMapStore";
import { getPlaceDetails } from "../../lib/placesService";

interface Props {
  place: Place;
}

export default function PlaceMarker({ place }: Props) {
  const selectPlace = useMapStore((s) => s.selectPlace);
  const selectedPlace = useMapStore((s) => s.selectedPlace);
  const config = getCategoryConfig(place.category);
  const isSelected = selectedPlace?.id === place.id;

  async function handleClick() {
    // 先用搜索结果里已有的基础信息展示，再异步补全详情（简介/图片等）
    selectPlace(place);
    try {
      const detail = await getPlaceDetails(place.id);
      selectPlace(detail);
    } catch {
      // 详情获取失败时保留已有的基础信息，不打断用户操作
    }
  }

  const icon: google.maps.Symbol = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: config.color,
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 2,
    scale: isSelected ? 10 : 7,
  };

  return (
    <Marker
      position={place.location}
      icon={icon}
      title={place.name}
      onClick={handleClick}
      zIndex={isSelected ? 999 : undefined}
    />
  );
}
