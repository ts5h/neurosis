import { Text, TextStyle } from "pixi.js";
import { extend, useTick } from "@pixi/react";
import { type RefObject, useState } from "react";
import { EmojiStrings, GestureStrings, SymbolStrings } from "@/constants/Emoji";
import { useEffect } from "react";
import type { StillProps } from "@/Components/Neurosis";

extend({
  Text,
});

const textStyle = new TextStyle({
  fontSize: 16,
  fill: "#000",
});

type EmojiProps = {
  emoji: string;
  waitTime: number;
  currentTime: number;
  rebelFlag: boolean;
};

type Props = {
  stillRef: RefObject<StillProps>;
};

export const DrawEmojis = ({ stillRef }: Props) => {
  const [emojis, setEmojis] = useState<EmojiProps[]>();

  // emoji width, height
  const itemSize = textStyle.fontSize + 2;

  const horizontalNumber = Math.ceil(window.innerWidth / itemSize);
  const verticalNumber = Math.ceil(window.innerHeight / itemSize);
  const emojisNumber = horizontalNumber * verticalNumber;

  const getNewEmoji = () => {
    const odds = Math.random() * 100;
    if (odds < 0.2) {
      return "";
    } else if (odds < 1.2) {
      return SymbolStrings[Math.floor(Math.random() * SymbolStrings.length)];
    } else {
      const combined = EmojiStrings.concat(GestureStrings);
      return combined[Math.floor(Math.random() * combined.length)];
    }
  };

  const getNewWaitTime = (max: number) => {
    return Math.floor(Math.random() * max + 1);
  };

  const getNewEmojiSet = () => {
    let max: number;
    if (Math.random() * 100 < 10) {
      max = Math.floor(Math.random() * 300);
    } else {
      max = 4;
    }

    const emoji = getNewEmoji();
    const waitTime = getNewWaitTime(max);
    const rebelFlag = false;

    return {
      emoji,
      waitTime,
      currentTime: waitTime,
      rebelFlag,
    };
  };

  useTick(() => {
    if (!emojis) {
      return;
    }

    const tmpEmojis: EmojiProps[] = [];
    for (let i = 0; i < emojisNumber; i++) {
      let { emoji, waitTime, currentTime, rebelFlag } = getNewEmojiSet();

      if (emojis[i]) {
        emoji = emojis[i].emoji;
        waitTime = emojis[i].waitTime;
        currentTime = emojis[i].currentTime;
        rebelFlag = emojis[i].rebelFlag;
      }

      if (stillRef.current.isStill) {
        // Peer Pressure
        if (emoji !== "" && !rebelFlag) {
          emoji = stillRef.current.stillEmoji;
        }

        currentTime = 0;
      } else {
        if (currentTime <= 0) {
          let max: number;
          if (waitTime <= 4) {
            if (Math.random() * 100 < 10) {
              max = Math.floor(Math.random() * 300);
            } else {
              max = 4;
            }
          } else {
            max = 4;
          }

          emoji = getNewEmoji();
          waitTime = getNewWaitTime(max);
          currentTime = waitTime;
          rebelFlag = stillRef.current.isStill
            ? rebelFlag
            : Math.random() * 100 < 1;
        } else {
          currentTime--;
        }
      }

      tmpEmojis[i] = {
        emoji,
        waitTime,
        currentTime,
        rebelFlag,
      };
    }

    setEmojis(tmpEmojis);
  });

  const initEmojis = () => {
    const tmpEmojis: EmojiProps[] = [];
    for (let i = 0; i < emojisNumber; i++) {
      const wait = getNewWaitTime(Math.random() * 100 <= 10 ? 300 : 4);
      tmpEmojis[i] = {
        emoji: getNewEmoji(),
        waitTime: wait,
        currentTime: wait,
        rebelFlag: false,
      };
    }

    return tmpEmojis;
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Execute on mount only
  useEffect(() => {
    setEmojis(initEmojis());
  }, []);

  return emojis?.map((emoji, index) => {
    return (
      <pixiText
        key={index.toString()}
        text={emoji.emoji}
        x={(index % horizontalNumber) * itemSize + 1}
        y={Math.floor(index / horizontalNumber) * itemSize + 1}
        style={textStyle}
      />
    );
  });
};
