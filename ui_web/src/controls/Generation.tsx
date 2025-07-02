import type { FC } from "react";
import { useGame } from "../GameContext.ts";
import { styled } from "@linaria/react";

const GenerationStyled = styled.span`
  display: inline-block;
  font-family: monospace;
  text-align: right;
  width: 5rem;
  overflow: hidden;
`;

export const Generation: FC = () => {
  const gen = useGame().generation;
  return (
    <GenerationStyled aria-label={`Generation: ${gen}`}>
      Gen: {gen}
    </GenerationStyled>
  );
};
