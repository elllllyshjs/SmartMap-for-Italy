import type { LatLng, Place, PlaceCategory } from "../types";
import { CATEGORY_CONFIGS, MAX_SEARCH_RESULTS, SEARCH_RADIUS_METERS } from "../config/constants";

const PLACES_BASE_URL = "https://places.googleapis.com/v1/places";

function apiKey(): string {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!key) {
    throw new Error(
      "缺少 VITE_GOOGLE_MAPS_API_KEY，请参考 SETUP_GOOGLE_API.md 配置 .env.local"
    );
  }
  return key;
}

// Places API (New) 返回的字段类型（仅列出本项目用到的部分）
interface RawPlace {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
  editorialSummary?: { text: string };
  primaryType?: string;
  photos?: { name: string }[];
}

function inferCategory(primaryType: string | undefined): PlaceCategory {
  if (!primaryType) return "other";
  for (const config of CATEGORY_CONFIGS) {
    if (config.includedTypes.includes(primaryType)) return config.id;
  }
  return "other";
}

export function getPhotoUrl(photoName: string, maxWidthPx = 480): string {
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidthPx}&key=${apiKey()}`;
}

function toPlace(raw: RawPlace): Place | null {
  if (!raw.location) return null;
  return {
    id: raw.id,
    name: raw.displayName?.text ?? "未命名地点",
    category: inferCategory(raw.primaryType),
    location: { lat: raw.location.latitude, lng: raw.location.longitude },
    address: raw.formattedAddress,
    rating: raw.rating,
    userRatingCount: raw.userRatingCount,
    photoUrl: raw.photos?.[0] ? getPhotoUrl(raw.photos[0].name) : undefined,
    description: raw.editorialSummary?.text,
    primaryType: raw.primaryType,
  };
}

const SEARCH_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.editorialSummary",
  "places.primaryType",
  "places.photos",
].join(",");

/**
 * 在指定坐标附近搜索某一类地点（景点/餐厅/酒店/其他），中文返回。
 */
export async function searchNearbyPlaces(
  center: LatLng,
  category: PlaceCategory,
  radiusMeters: number = SEARCH_RADIUS_METERS
): Promise<Place[]> {
  const config = CATEGORY_CONFIGS.find((c) => c.id === category);
  const includedTypes = config?.includedTypes ?? [];

  const response = await fetch(`${PLACES_BASE_URL}:searchNearby`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey(),
      "X-Goog-FieldMask": SEARCH_FIELD_MASK,
    },
    body: JSON.stringify({
      includedTypes,
      maxResultCount: MAX_SEARCH_RESULTS,
      languageCode: "zh-CN",
      locationRestriction: {
        circle: {
          center: { latitude: center.lat, longitude: center.lng },
          radius: radiusMeters,
        },
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`地点搜索失败 (${response.status}): ${errBody}`);
  }

  const data: { places?: RawPlace[] } = await response.json();
  return (data.places ?? [])
    .map(toPlace)
    .filter((p): p is Place => p !== null);
}

const DETAILS_FIELD_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "location",
  "rating",
  "userRatingCount",
  "editorialSummary",
  "primaryType",
  "photos",
].join(",");

/**
 * 获取单个地点的详情（用于点击标记后展示中文简介）。
 */
export async function getPlaceDetails(placeId: string): Promise<Place> {
  const response = await fetch(
    `${PLACES_BASE_URL}/${placeId}?languageCode=zh-CN`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey(),
        "X-Goog-FieldMask": DETAILS_FIELD_MASK,
      },
    }
  );

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`获取地点详情失败 (${response.status}): ${errBody}`);
  }

  const raw: RawPlace = await response.json();
  const place = toPlace(raw);
  if (!place) {
    throw new Error("地点详情缺少坐标信息");
  }
  return place;
}
