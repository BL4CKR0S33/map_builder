import { randomUUID } from "crypto";
import { create } from "zustand";

export function generateRandomString(length: number, charset?: string): string {
  const defaultCharset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const characters = charset || defaultCharset;

  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

type MapStore = {
  name: string;
  setName: (name: string) => void;
};

const useDownloadStore = create<MapStore>()((set) => ({
  name: "map_" + generateRandomString(4),
  setName: (name) => set(() => ({ name: name })),
}));

export { useDownloadStore };
