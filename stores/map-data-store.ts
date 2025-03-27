import { create } from "zustand";

// Define cell type with separate base and object layers
interface Cell {
  x: number;
  y: number;
  baseTexture: string; // Always floor.png
  objectTexture?: string; // Optional object on top (wall, player, collectible, etc.)
}

interface MapDataStore {
  // Map state
  mapData: Cell[][];
  setMapData: (mapData: Cell[][]) => void;

  // Cell operations
  updateCell: (x: number, y: number, objectTexture?: string) => void;

  // Map export for so_long 42 project
  exportMapForSoLong: () => string;
  validateSoLongMap: () => { valid: boolean; message?: string };
}

export const useMapDataStore = create<MapDataStore>((set, get) => ({
  mapData: [],

  setMapData: (mapData) => set({ mapData }),

  updateCell: (x, y, objectTexture) =>
    set((state) => {
      const newMap = JSON.parse(JSON.stringify(state.mapData));
      if (newMap[y] && newMap[y][x]) {
        if (objectTexture) {
          newMap[y][x].objectTexture = objectTexture;
        } else {
          delete newMap[y][x].objectTexture;
        }
      }
      return { mapData: newMap };
    }),

  exportMapForSoLong: () => {
    const { mapData } = get();
    let result = "";

    // Iterate through each row of the map
    for (let y = 0; y < mapData.length; y++) {
      let line = "";

      // Process each cell in the row
      for (let x = 0; x < mapData[y].length; x++) {
        const cell = mapData[y][x];

        // Determine character based on cell's object texture
        if (cell.objectTexture === "wall.png") {
          line += "1";
        } else if (cell.objectTexture === "player.png") {
          line += "P";
        } else if (cell.objectTexture === "exit.png") {
          line += "E";
        } else if (cell.objectTexture === "collectible.png") {
          line += "C";
        } else {
          // Default floor (no object or explicitly floor texture)
          line += "0";
        }
      }

      // Add the line to result with newline
      result += line + "\n";
    }

    return result;
  },

  validateSoLongMap: () => {
    const mapString = get().exportMapForSoLong();
    const lines = mapString.trim().split("\n");
    let playerCount = 0;
    let exitCount = 0;
    let collectibleCount = 0;
    const width = lines[0].length;

    // Check if all rows have the same width and are surrounded by walls
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check rectangle shape
      if (line.length !== width) {
        return { valid: false, message: "Map must be rectangular" };
      }

      // Check top and bottom boundaries
      if (i === 0 || i === lines.length - 1) {
        if (!line.split("").every((char) => char === "1")) {
          return { valid: false, message: "Map must be surrounded by walls" };
        }
      } else {
        // Check left and right boundaries
        if (line[0] !== "1" || line[line.length - 1] !== "1") {
          return { valid: false, message: "Map must be surrounded by walls" };
        }
      }

      // Count elements
      for (const char of line) {
        if (char === "P") playerCount++;
        else if (char === "E") exitCount++;
        else if (char === "C") collectibleCount++;
      }
    }

    if (playerCount !== 1) {
      return { valid: false, message: "Map must have exactly one player (P)" };
    }

    if (exitCount !== 1) {
      return { valid: false, message: "Map must have exactly one exit (E)" };
    }

    if (collectibleCount < 1) {
      return {
        valid: false,
        message: "Map must have at least one collectible (C)",
      };
    }

    return { valid: true };
  },
}));
