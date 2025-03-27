import { create } from "zustand";

type MapStore = {
  width: number;
  height: number;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
};

const useMapStore = create<MapStore>()((set) => ({
  width: 3,
  height: 5,
  setWidth: (width) => set(() => ({ width: width })),
  setHeight: (height) =>
    set(() => ({
      height: height,
    })),
}));

export { useMapStore };
