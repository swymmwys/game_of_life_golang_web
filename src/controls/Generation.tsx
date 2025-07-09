import type { FC } from "react";
import { useGame } from "../GameContext.ts";
import { styled } from "@linaria/react";

const GenerationStyled = styled.span`
  display: inline-block;
  font-family: monospace;
  text-align: center;
`;

export const Generation: FC = () => {
  const gen = useGame().generation;
  return (
    <GenerationStyled aria-label={`Generation: ${gen}`}>
      Gen:
      <br />
      {gen}
    </GenerationStyled>
  );
};
