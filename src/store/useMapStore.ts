import { create } from "zustand";
import type { Place, PlaceCategory, RegionInfo } from "../types";
import { REGIONS } from "../config/constants";

interface MapState {
  selectedRegion: RegionInfo;
  activeCategory: PlaceCategory;
  places: Place[];
  isLoadingPlaces: boolean;
  loadError: string | null;
  selectedPlace: Place | null;

  setSelectedRegion: (region: RegionInfo) => void;
  setActiveCategory: (category: PlaceCategory) => void;
  setPlaces: (places: Place[]) => void;
  setLoading: (loading: boolean) => void;
  setLoadError: (error: string | null) => void;
  selectPlace: (place: Place | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedRegion: REGIONS[0],
  activeCategory: "attraction",
  places: [],
  isLoadingPlaces: false,
  loadError: null,
  selectedPlace: null,

  setSelectedRegion: (region) => set({ selectedRegion: region, selectedPlace: null }),
  setActiveCategory: (category) => set({ activeCategory: category, selectedPlace: null }),
  setPlaces: (places) => set({ places }),
  setLoading: (loading) => set({ isLoadingPlaces: loading }),
  setLoadError: (error) => set({ loadError: error }),
  selectPlace: (place) => set({ selectedPlace: place }),
}));
