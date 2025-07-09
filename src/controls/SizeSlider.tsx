import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useGame } from "../GameContext";
import { styled } from "@linaria/react";

const LabelStyled = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SizeSlider = () => {
  const game = useGame();
  const [size, setSize] = useState(game.size);
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);

  const onSizeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value);

      setSize(value);

      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }

      throttleTimeout.current = setTimeout(() => {
        game.size = value;
      }, 100);
    },
    [game],
  );

  useEffect(() => {
    setSize(game.size);
  }, [game.size]);

  return (
    <LabelStyled aria-label="size change slider">
      {`${size}x${size}`}
      <input
        type="range"
        min={2}
        max={25}
        value={size}
        onChange={onSizeChange}
      />
    </LabelStyled>
  );
};
