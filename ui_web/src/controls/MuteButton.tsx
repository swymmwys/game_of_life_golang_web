import { type FC, useCallback } from "react";
import { useSound } from "../sound/SoundContext";
import { SoundElement } from "../sound/SoundElement";
import { ButtonStyled } from "./ButtonStyled";

export const MuteButton: FC = () => {
  const sound = useSound();
  const onMuteClick = useCallback(() => {
    sound.muted = !sound.muted;
  }, [sound]);

  return (
    <SoundElement sound="click">
      <ButtonStyled data-active={!sound.muted} onClick={onMuteClick}>
        sound {sound.muted ? "off" : "on"}
      </ButtonStyled>
    </SoundElement>
  );
};
