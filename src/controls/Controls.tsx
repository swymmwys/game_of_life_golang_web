import { type FC } from "react";
import { styled } from "@linaria/react";
import { Generation } from "./Generation.tsx";
import { SizeSlider } from "./SizeSlider";
import { PlayControls } from "./PlayControls";
import { MuteButton } from "./MuteButton";

const ControlsContainerStyled = styled.div`
  width: 100%;
  padding: 0 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  > * {
    flex-shrink: 0;
  }
`;

export const Controls: FC = () => {
  return (
    <ControlsContainerStyled>
      <Generation />
      <PlayControls />
      <MuteButton />
      <SizeSlider />
    </ControlsContainerStyled>
  );
};
