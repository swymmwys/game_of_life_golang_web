import { type FC, type PropsWithChildren, useMemo, useRef } from "react";
import { SoundContext, type SoundControls } from "./SoundContext.tsx";
import { createPortal } from "react-dom";
import { observable, runInAction } from "mobx";

export type SoundList = "pop" | "click";

export const SoundContextProvider: FC<PropsWithChildren> = (props) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const value = useMemo<SoundControls>(() => {
    const muteState = observable.box(true);

    return {
      play(sound: SoundList): void {
        if (!audioRef.current) {
          return;
        }
        switch (sound) {
          case "pop": {
            audioRef.current.src = "/sound/pop.mp3";
            break;
          }
          case "click": {
            audioRef.current.src = "/sound/click.mp3";
            break;
          }
          default:
            break;
        }

        audioRef.current.play();
      },
      get muted(): boolean {
        return muteState.get();
      },
      set muted(value: boolean) {
        runInAction(() => {
          muteState.set(value);
        });

        if (audioRef.current) {
          audioRef.current.muted = value;
        }
      },
    };
  }, []);

  return (
    <SoundContext.Provider value={value}>
      {props.children}
      {createPortal(
        <audio ref={audioRef} muted style={{ visibility: "hidden" }} />,
        document.body,
      )}
    </SoundContext.Provider>
  );
};
