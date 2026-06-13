import Styles from "@/Styles/Neurosis.module.scss";
import { isMobile } from "react-device-detect";
import { useEffect, useRef } from "react";
import { EmojiStrings } from "@/constants/Emoji";
import { Application, extend } from "@pixi/react";
import { Sprite } from "pixi.js";
import { DrawEmojis } from "@/Components/DrawEmojis";

extend({
  Sprite,
});

export type StillProps = {
  isStill: boolean;
  stillEmoji: string;
};

export const Neurosis = () => {
  const stillRef = useRef<StillProps>({
    isStill: false,
    stillEmoji: "",
  });

  const canvasWidth = isMobile ? 3000 : 6000;
  const canvasHeight = isMobile ? 3000 : 6000;

  const handleClick = () => {
    let tmpStill: StillProps = { isStill: false, stillEmoji: "" };
    if (!stillRef.current.isStill) {
      tmpStill = {
        isStill: true,
        stillEmoji:
          EmojiStrings[Math.floor(Math.random() * EmojiStrings.length)],
      };
    }

    stillRef.current = tmpStill;
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Execute on mount only
  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className={Styles.container}>
      <Application
        autoStart
        sharedTicker
        width={canvasWidth}
        height={canvasHeight}
        background={"#ffffff"}
      >
        <DrawEmojis stillRef={stillRef} />
      </Application>
    </div>
  );
};
