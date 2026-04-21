import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type WrapOption = 'basic' | 'ribbon' | 'premium';

interface FlowerItem {
  flowerId: string;
  name: string;
  quantity: number;
  color: string;
  unitPrice: number;
}

interface BuilderStore {
  flowers: FlowerItem[];
  wrapOption: WrapOption;
  targetShopId: string | null;
  memo: string;
  addFlower: (flower: FlowerItem) => void;
  removeFlower: (flowerId: string) => void;
  updateQuantity: (flowerId: string, qty: number) => void;
  setWrapOption: (option: WrapOption) => void;
  setMemo: (memo: string) => void;
  reset: () => void;
}

export const useBuilderStore = create<BuilderStore>()(
  persist(
    (set) => ({
      flowers: [],
      wrapOption: 'basic',
      targetShopId: null,
      memo: '',
      addFlower: (flower) =>
        set((state) => {
          const exists = state.flowers.find((f) => f.flowerId === flower.flowerId);
          if (exists) {
            return {
              flowers: state.flowers.map((f) =>
                f.flowerId === flower.flowerId
                  ? { ...f, quantity: f.quantity + 1 }
                  : f
              ),
            };
          }
          return { flowers: [...state.flowers, flower] };
        }),
      removeFlower: (flowerId) =>
        set((state) => ({
          flowers: state.flowers.filter((f) => f.flowerId !== flowerId),
        })),
      updateQuantity: (flowerId, qty) =>
        set((state) => ({
          flowers: state.flowers.map((f) =>
            f.flowerId === flowerId ? { ...f, quantity: qty } : f
          ),
        })),
      setWrapOption: (option) => set({ wrapOption: option }),
      setMemo: (memo) => set({ memo }),
      reset: () => set({ flowers: [], wrapOption: 'basic', targetShopId: null, memo: '' }),
    }),
    { name: 'bloomer-builder' } // LocalStorage 키 이름
  )
);
