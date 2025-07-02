import { createContext, useContext } from "react";

export interface SoundControls {
  play(sound: string): void;
  muted: boolean;
}

export const SoundContext = createContext<SoundControls>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  play(_sound: string): void {
    throw new Error("not implemented");
  },
  get muted(): boolean {
    throw new Error("not implemented");
  },
  set muted(_value: boolean) {
    throw new Error("not implemented");
  },
});

export const useSound = () => {
  return useContext(SoundContext);
};
