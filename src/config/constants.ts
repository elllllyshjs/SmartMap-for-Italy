import type { CategoryConfig, RegionInfo } from "../types";

export const ITALY_CENTER = { lat: 42.5, lng: 12.5 };
export const ITALY_DEFAULT_ZOOM = 6;

// 行程天数，按需求为 12 天，可在此调整
export const TRIP_LENGTH_DAYS = 12;

// 意大利主要大区/热门城市，用于地图快速定位
export const REGIONS: RegionInfo[] = [
  { id: "roma", name: "罗马", nameEn: "Rome (Lazio)", center: { lat: 41.9028, lng: 12.4964 }, zoom: 12 },
  { id: "firenze", name: "佛罗伦萨", nameEn: "Florence (Tuscany)", center: { lat: 43.7696, lng: 11.2558 }, zoom: 13 },
  { id: "venezia", name: "威尼斯", nameEn: "Venice (Veneto)", center: { lat: 45.4408, lng: 12.3155 }, zoom: 13 },
  { id: "milano", name: "米兰", nameEn: "Milan (Lombardy)", center: { lat: 45.4642, lng: 9.19 }, zoom: 12 },
  { id: "napoli", name: "那不勒斯", nameEn: "Naples (Campania)", center: { lat: 40.8518, lng: 14.2681 }, zoom: 12 },
  { id: "amalfi", name: "阿马尔菲海岸", nameEn: "Amalfi Coast", center: { lat: 40.6333, lng: 14.6029 }, zoom: 12 },
  { id: "cinque-terre", name: "五渔村", nameEn: "Cinque Terre (Liguria)", center: { lat: 44.1461, lng: 9.6439 }, zoom: 12 },
  { id: "siena", name: "锡耶纳", nameEn: "Siena (Tuscany)", center: { lat: 43.3188, lng: 11.3308 }, zoom: 13 },
  { id: "pisa", name: "比萨", nameEn: "Pisa (Tuscany)", center: { lat: 43.7228, lng: 10.4017 }, zoom: 13 },
  { id: "torino", name: "都灵", nameEn: "Turin (Piedmont)", center: { lat: 45.0703, lng: 7.6869 }, zoom: 12 },
  { id: "bologna", name: "博洛尼亚", nameEn: "Bologna (Emilia-Romagna)", center: { lat: 44.4949, lng: 11.3426 }, zoom: 13 },
  { id: "sicilia", name: "西西里（巴勒莫）", nameEn: "Sicily (Palermo)", center: { lat: 38.1157, lng: 13.3615 }, zoom: 11 },
  { id: "verona", name: "维罗纳", nameEn: "Verona (Veneto)", center: { lat: 45.4384, lng: 10.9916 }, zoom: 13 },
  { id: "como", name: "科莫湖", nameEn: "Lake Como", center: { lat: 45.9847, lng: 9.2569 }, zoom: 12 },
];

// 地点类型 -> 展示配置 + 对应 Google Places API 的 includedTypes
export const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    id: "attraction",
    label: "景点",
    color: "#CD212A",
    includedTypes: [
      "tourist_attraction",
      "museum",
      "art_gallery",
      "church",
      "historical_landmark",
      "monument",
    ],
  },
  {
    id: "restaurant",
    label: "餐厅",
    color: "#008C45",
    includedTypes: ["restaurant", "cafe", "bakery"],
  },
  {
    id: "hotel",
    label: "酒店",
    color: "#2563EB",
    includedTypes: ["lodging", "hotel"],
  },
  {
    id: "other",
    label: "其他",
    color: "#9333EA",
    includedTypes: ["shopping_mall", "bar", "point_of_interest"],
  },
];

export const getCategoryConfig = (category: string): CategoryConfig =>
  CATEGORY_CONFIGS.find((c) => c.id === category) ?? CATEGORY_CONFIGS[3];

// 附近搜索半径（米）
export const SEARCH_RADIUS_METERS = 6000;
// 每次搜索最多返回的地点数量
export const MAX_SEARCH_RESULTS = 20;
