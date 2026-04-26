import { create } from 'zustand';

export type Screen = 'map' | 'list' | 'search' | 'builder' | 'summary';

interface MapStore {
  screen: Screen;
  selectedShopId: string | null;
  shopDetailId: string | null;
  mapCenter: { lat: number; lng: number };
  builderOpenAi: boolean;
  setScreen: (screen: Screen) => void;
  setSelectedShopId: (id: string | null) => void;
  setShopDetailId: (id: string | null) => void;
  setMapCenter: (center: { lat: number; lng: number }) => void;
  openBuilderWithAi: () => void;
  resetBuilderOpenAi: () => void;
}

export const useMapStore = create<MapStore>((set) => ({
  screen: 'map',
  selectedShopId: null,
  shopDetailId: null,
  mapCenter: { lat: 37.5563, lng: 126.9138 },
  builderOpenAi: false,
  setScreen: (screen) => set({ screen }),
  setSelectedShopId: (id) => set({ selectedShopId: id }),
  setShopDetailId: (id) => set({ shopDetailId: id }),
  setMapCenter: (center) => set({ mapCenter: center }),
  openBuilderWithAi: () => set({ screen: 'builder', builderOpenAi: true }),
  resetBuilderOpenAi: () => set({ builderOpenAi: false }),
}));
