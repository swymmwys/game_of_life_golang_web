import { type FC, useCallback, useRef, useState } from "react";
import { useGame } from "../GameContext";
import { SoundElement } from "../sound/SoundElement";
import { ButtonStyled } from "./ButtonStyled";

export const PlayControls: FC = () => {
  const game = useGame();
  const [play, setPlay] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const iterate = useCallback(() => {
    const next = game.iterate();

    if (next) {
      intervalRef.current = setTimeout(iterate, 500);
    } else {
      clearInterval(intervalRef.current!);
      intervalRef.current = null;
    }

    setPlay(next);
  }, [game]);

  const onNextClick = useCallback(() => {
    game.iterate();
  }, [game]);

  const onPlayToggleClick = useCallback(() => {
    if (play) {
      setPlay(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      iterate();
    }
  }, [iterate, play]);

  const onResetClick = useCallback(() => {
    setPlay(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    game.reset();
  }, [game]);

  return (
    <>
      <SoundElement sound="click">
        <ButtonStyled onClick={onNextClick} disabled={play}>
          next
        </ButtonStyled>
      </SoundElement>
      <SoundElement sound="click">
        <ButtonStyled onClick={onPlayToggleClick}>
          {play ? "stop" : "play"}
        </ButtonStyled>
      </SoundElement>
      <SoundElement sound="click">
        <ButtonStyled onClick={onResetClick}>reset</ButtonStyled>
      </SoundElement>
    </>
  );
};
