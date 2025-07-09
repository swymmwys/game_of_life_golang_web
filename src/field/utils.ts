import type { MouseEvent } from "react";
import type { CellDataset } from "./Cell.tsx";

export function parseCellEvent(event: MouseEvent): CellDataset {
  const data = (event.target as HTMLElement).dataset;
  return {
    x: parseInt(data.x!),
    y: parseInt(data.y!),
    active: data.active === "true",
  };
}
