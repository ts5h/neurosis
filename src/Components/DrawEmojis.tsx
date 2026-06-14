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
  fill: "#000000",
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
      const tmpEmoji = emojis[i] ? emojis[i] : getNewEmojiSet();

      if (stillRef.current.isStill) {
        // Peer Pressure
        if (tmpEmoji.emoji !== "" && !tmpEmoji.rebelFlag) {
          tmpEmoji.emoji = stillRef.current.stillEmoji;
        }

        tmpEmoji.currentTime = 0;
      } else {
        if (tmpEmoji.currentTime <= 0) {
          let max: number;
          if (tmpEmoji.waitTime <= 4) {
            if (Math.random() * 100 < 10) {
              max = Math.floor(Math.random() * 300);
            } else {
              max = 4;
            }
          } else {
            max = 4;
          }

          tmpEmoji.emoji = getNewEmoji();
          tmpEmoji.waitTime = getNewWaitTime(max);
          tmpEmoji.currentTime = tmpEmoji.waitTime;
          tmpEmoji.rebelFlag = stillRef.current.isStill
            ? tmpEmoji.rebelFlag
            : Math.random() * 100 < 1;
        } else {
          tmpEmoji.currentTime--;
        }
      }

      tmpEmojis.push(tmpEmoji);
    }

    setEmojis(tmpEmojis);
  });

  const initEmojis = () => {
    const tmpEmojis: EmojiProps[] = [];
    for (let i = 0; i < emojisNumber; i++) {
      tmpEmojis.push(getNewEmojiSet());
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
