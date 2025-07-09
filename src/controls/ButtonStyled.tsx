import { styled } from "@linaria/react";

export const ButtonStyled = styled.button`
  --shadow-color: #414141;
  --shadow-y-pos: 2px;

  font-family: monospace;
  color: white;
  padding: 0;
  border-radius: 20%;
  height: 4em;
  width: 4em;
  border: none;
  background-color: #19191952;
  box-shadow:
    inset var(--shadow-color) 0 -1px 2px 0px,
    #0d0d0d57 0 var(--shadow-y-pos) 4px 2px;
  user-select: none;
  transition:
    transform 0.2s linear,
    box-shadow 0.2s linear;

  &:disabled {
    cursor: not-allowed;
    color: #38383e;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    --shadow-y-pos: 4px;
  }

  &:active:not(:disabled),
  &[data-active="true"] {
    transform: translateY(2px);
    --shadow-color: #319d56;
    --shadow-y-pos: 2px;
  }
`;
