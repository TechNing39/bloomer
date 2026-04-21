import { create } from 'zustand';

interface MapStore {
  selectedShopId: string | null;
  mapCenter: { lat: number; lng: number };
  setSelectedShopId: (id: string | null) => void;
  setMapCenter: (center: { lat: number; lng: number }) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  selectedShopId: null,
  mapCenter: { lat: 37.5563, lng: 126.9138 }, // 마포구 중심
  setSelectedShopId: (id) => set({ selectedShopId: id }),
  setMapCenter: (center) => set({ mapCenter: center }),
}));
