import {
  Children,
  cloneElement,
  type FC,
  isValidElement,
  type MouseEventHandler,
  type PropsWithChildren,
} from "react";
import { useSound } from "./SoundContext.tsx";
import type { SoundList } from "./SoundContextProvider.tsx";

export const SoundElement: FC<PropsWithChildren<{ sound: SoundList }>> = (
  props,
) => {
  const sound = useSound();
  const element = Children.only(props.children);

  if (isValidElement<{ onClick: MouseEventHandler }>(element)) {
    return cloneElement(element, {
      onClick: (e) => {
        element.props?.onClick(e);
        sound.play(props.sound);
      },
    });
  }

  return props.children;
};
