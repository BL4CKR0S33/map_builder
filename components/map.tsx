"use client";

import { useMapStore } from "@/stores/map-store";
import { useMapDataStore } from "@/stores/map-data-store";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useActionStore } from "@/stores/action-tool-store";

export default function Map() {
  const { width, height } = useMapStore();
  const { mapData, setMapData, updateCell } = useMapDataStore();
  const [selectedCells, setSelectedCells] = useState<
    { x: number; y: number }[]
  >([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const { texture } = useActionStore();

  // Initialize map with floor tiles as the base layer
  useEffect(() => {
    const initialMap = [];

    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        row.push({
          x,
          y,
          baseTexture: "floor.png", // All cells have floor as base
        });
      }
      initialMap.push(row);
    }

    setMapData(initialMap);
  }, [width, height, setMapData]);

  const onMouseDown = (x: number, y: number) => {
    setIsMouseDown(true);
    handleCellClick(x, y);
  };

  const onMouseUp = () => {
    setIsMouseDown(false);
  };

  const onMouseEnter = (x: number, y: number) => {
    if (isMouseDown) {
      // If mouse is down and we enter a new cell, handle it
      handleCellClick(x, y);
    }
  };

  // When a cell is clicked, update its texture
  const handleCellClick = (x: number, y: number) => {
    // Update selection for visual feedback
    toggleCellSelection(x, y);

    // Apply texture only to this specific cell
    if (texture === "floor.png") {
      // If floor is selected, remove any object on top
      updateCell(x, y, undefined);
    } else {
      // Otherwise place the object on top of the floor
      updateCell(x, y, texture);
    }
  };

  const toggleCellSelection = (x: number, y: number) => {
    setSelectedCells((prevSelectedCells) => {
      const cellIndex = prevSelectedCells.findIndex(
        (cell) => cell.x === x && cell.y === y,
      );

      if (cellIndex >= 0) {
        // If already selected, remove it (toggle behavior)
        return prevSelectedCells.filter((_, index) => index !== cellIndex);
      } else {
        // Otherwise add to selection
        return [...prevSelectedCells, { x, y }];
      }
    });
  };

  const isCellSelected = (x: number, y: number) => {
    return selectedCells.some((cell) => cell.x === x && cell.y === y);
  };

  // Register global mouse up handler
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsMouseDown(false);
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center select-none"
      draggable={false}
    >
      {mapData.map((row, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex flex-row items-center justify-between"
        >
          {row.map((cell) => (
            <div
              key={`box-${cell.y}-${cell.x}`}
              className={`border-border relative h-[64px] w-[64px] border ${
                isCellSelected(cell.x, cell.y)
                  ? "bg-opacity-40 bg-blue-500"
                  : ""
              }`}
              onMouseDown={() => onMouseDown(cell.x, cell.y)}
              onMouseEnter={() => onMouseEnter(cell.x, cell.y)}
            >
              {/* Always render the floor base layer */}
              <Image
                src={"/tiles/" + cell.baseTexture}
                alt={`Floor at ${cell.x},${cell.y}`}
                fill
                className="object-contain"
                draggable={false}
              />

              {/* Render object on top if it exists */}
              {cell.objectTexture && (
                <Image
                  src={"/tiles/" + cell.objectTexture}
                  alt={`Object at ${cell.x},${cell.y}`}
                  fill
                  className="object-contain"
                  draggable={false}
                />
              )}

              <div className="absolute right-1 bottom-1 text-xs text-white opacity-70">
                {cell.x},{cell.y}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
