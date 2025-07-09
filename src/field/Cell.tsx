import { styled } from "@linaria/react";
import type { FC, MouseEventHandler } from "react";
import type { ReadonlyCell } from "../Game.ts";

export const CellStyled = styled.button`
  border: none;
  padding: 0;
  border-radius: 20%;

  &[data-active="true"] {
    background-color: hsl(0, 0%, 100%);
    box-shadow: inset #00d1ff 0 -1px 1px 0;
    animation: bounce 0.4s linear;
  }

  &[data-active="false"] {
    background-color: hsl(0, 0%, 0%);
    box-shadow: inset #3f3f3f 0 -1px 1px 0;
  }

  &:hover {
    box-shadow: inset #009bff 0 -1px 1px 0;
  }

  @keyframes bounce {
    25% {
      transform: scale(0.9, 1.1);
    }
    50% {
      transform: scale(1.1, 0.9);
    }
    75% {
      transform: scale(0.95, 1.05);
    }
  }
`;

export const Cell: FC<{
  onClick: MouseEventHandler<HTMLButtonElement>;
  cell: ReadonlyCell;
}> = ({ onClick, cell }) => {
  const state = cell.value.get();

  return (
    <CellStyled
      aria-label={`Cell x:${cell.x} y:${cell.y}, ${state ? "active" : "inactive"}`}
      onClick={onClick}
      data-x={cell.x}
      data-y={cell.y}
      data-active={state}
    />
  );
};

export type CellDataset = { x: number; y: number; active: boolean };
