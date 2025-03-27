import { ActionToolEnum } from "@/lib/emus";
import { create } from "zustand";

type ActionToolStore = {
  type: keyof typeof ActionToolEnum;
  texture: string;
  setTool: (type: keyof typeof ActionToolEnum, texture: string) => void;
};

const useActionStore = create<ActionToolStore>()((set) => ({
  type: "WALL",
  texture: "wall.png",
  setTool: (type, texture) => set(() => ({ type, texture })),
}));

export { useActionStore };
