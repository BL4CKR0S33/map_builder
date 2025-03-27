"use client";

import React, { ReactNode } from "react";
import { Button } from "./ui/button";
import { Plus, Download } from "lucide-react";
import { ModeToggle } from "./theme-toggle";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { NewMapForm } from "./forms/new-map";
import { useActionStore } from "@/stores/action-tool-store";
import { ActionToolEnum } from "@/lib/emus";
import Image from "next/image";
import { DownloadForm } from "./forms/download";

interface ActionToolsProps {
  tool: keyof typeof ActionToolEnum;
  texture: string;
}

const ActionTools: ActionToolsProps[] = [
  {
    tool: "WALL",
    texture: "wall.png",
  },
  {
    tool: "FLOOR",
    texture: "floor.png",
  },
  {
    tool: "COLLECTIBLE",
    texture: "collectible.png",
  },
  {
    tool: "PLAYER",
    texture: "player.png",
  },
  {
    tool: "EXIT",
    texture: "exit.png",
  },
];

export default function Nav() {
  const { setTool } = useActionStore();

  return (
    <nav className="fixed bottom-3 left-1/2 flex -translate-x-1/2 space-x-2 rounded-md bg-stone-800 p-1 py-1.5">
      <div className="flex items-center justify-center gap-2 border-r-2 px-2">
        {ActionTools.map((tool, idx) => {
          return (
            <NavTools
              key={idx}
              tool={tool.tool}
              texture={tool.texture}
              onClick={() => setTool(tool.tool, tool.texture)}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-1 border-r-2 px-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button>
              <Download size={20} className="mr-1" />
              Export Map
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <DownloadForm />
          </PopoverContent>
        </Popover>
        <NewMap>
          <PopoverTrigger asChild>
            <Button size="icon">
              <Plus />
            </Button>
          </PopoverTrigger>
        </NewMap>
      </div>
      <div className="flex items-center justify-center">
        <ModeToggle />
      </div>
    </nav>
  );
}
function NewMap({ children }: { children?: ReactNode }) {
  return (
    <Popover>
      {children}
      <PopoverContent>
        <NewMapForm />
      </PopoverContent>
    </Popover>
  );
}

function NavTools({
  tool,
  texture,
  onClick,
}: {
  tool: keyof typeof ActionToolEnum;
  texture: string;
  onClick: () => void;
}) {
  return (
    <Button variant="outline" onClick={onClick} className="p-0" asChild>
      <Image
        src={"/tiles/" + texture}
        alt={tool}
        width={64}
        height={64}
        className="h-[42px] w-[42px] object-contain"
      />
    </Button>
  );
}
