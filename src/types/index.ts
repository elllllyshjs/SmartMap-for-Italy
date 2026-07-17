export type PlaceCategory = "attraction" | "restaurant" | "hotel" | "other";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Place {
  id: string; // Google Place ID
  name: string; // 中文名称（若 Google 无中文翻译则回退为原名）
  category: PlaceCategory;
  location: LatLng;
  address?: string;
  rating?: number;
  userRatingCount?: number;
  photoUrl?: string;
  description?: string; // 中文简介（editorial summary）
  primaryType?: string;
}

export interface RegionInfo {
  id: string;
  name: string; // 中文名
  nameEn: string;
  center: LatLng;
  zoom: number;
}

export interface CategoryConfig {
  id: PlaceCategory;
  label: string; // 中文标签
  color: string; // 标记颜色
  includedTypes: string[]; // 对应 Google Places 类型
}

export interface ItineraryItem {
  id: string; // 行程条目唯一 id（非 place id，允许同一地点多天出现）
  place: Place;
  note?: string;
}

export interface ItineraryDay {
  id: string;
  dayIndex: number; // 第几天，从 1 开始
  date: string; // ISO 日期字符串 yyyy-mm-dd
  title: string; // 用户可编辑的当日标题，如"罗马 - 古城探索"
  items: ItineraryItem[];
}

export interface RouteLeg {
  fromItemId: string;
  toItemId: string;
  durationText: string; // 如 "15 分钟"
  distanceText: string; // 如 "1.2 公里"
}
