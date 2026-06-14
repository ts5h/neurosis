import Styles from "@/Styles/Components/Neurosis.module.scss";
import { isMobile } from "react-device-detect";
import { useRef } from "react";
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

  const handleKeyboardEvent = () => {
    return false;
  };

  return (
    <div
      role={"application"}
      tabIndex={-1}
      onClick={handleClick}
      onKeyDown={handleKeyboardEvent}
      onKeyUp={handleKeyboardEvent}
      className={Styles.container}
    >
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
