import { Cell } from "./Cell.tsx";
import { type FC, type MouseEventHandler, useCallback } from "react";
import { useGame } from "../GameContext.ts";
import { useSound } from "../sound/SoundContext.tsx";
import { styled } from "@linaria/react";
import { parseCellEvent } from "./utils";

export const GameFieldStyled = styled.div<{ size: number }>`
  --size: ${(props) => props.size};
  --base-gap: 4px;
  --field-gap: calc(var(--base-gap) * clamp(0.2, calc(15 / var(--size)), 1));
  --min-dimension: min(85vh, 85vw);
  --available-space: max(
    350px,
    calc(var(--min-dimension) - var(--field-gap) * calc(var(--size) - 2))
  );
  --cell-size: calc(var(--available-space) / var(--size));
  display: grid;
  gap: var(--field-gap);
  grid-template-columns: repeat(var(--size), var(--cell-size));
  grid-template-rows: repeat(var(--size), var(--cell-size));

  @media (max-width: 800px) or (max-height: 800px) {
    --base-gap: 1px;
  }
`;

export const GameField: FC = () => {
  const game = useGame();
  const sound = useSound();

  const onCellClick = useCallback<MouseEventHandler<HTMLElement>>(
    (event) => {
      const { x, y, active } = parseCellEvent(event);
      game.setCellValue(x, y, !active);
      sound.play("pop");
    },
    [game, sound],
  );

  return (
    <>
      {game.size === 0 ? (
        "Loading..."
      ) : (
        <GameFieldStyled size={game.size}>
          {game.field.map((cell) => {
            return (
              <Cell
                onClick={onCellClick}
                key={`x:${cell.x}y:${cell.y}`}
                cell={cell}
              />
            );
          })}
        </GameFieldStyled>
      )}
    </>
  );
};
