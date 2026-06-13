import Styles from "@/Styles/Neurosis.module.scss";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";
import { EmojiStrings, GestureStrings, SymbolStrings } from "@/constants/Emoji";
import { Application, extend } from "@pixi/react";
import { Container, Graphics, Sprite } from "pixi.js";

extend({
  Container,
  Graphics,
  Sprite,
});

type EmojiProps =
  | {
      emoji: string;
      waitTime: number;
      currentTime: number;
      rebelFlag: boolean;
    }
  | undefined;

export const Neurosis = () => {
  const [emojis, setEmojis] = useState<EmojiProps[]>();
  const [still, setStill] = useState({ isStill: false, stillEmoji: "" });

  const canvasWidth = isMobile ? 3000 : 6000;
  const canvasHeight = isMobile ? 3000 : 6000;

  // emoji width, height
  const itemSize = 21;

  const horizontalNumber = Math.ceil(window.innerWidth / itemSize);
  const verticalNumber = Math.ceil(window.innerHeight / itemSize);
  const emojisNumber = horizontalNumber * verticalNumber;

  const getEmoji = () => {
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

  const getWaitTime = (max: number) => {
    return Math.floor(Math.random() * max + 1);
  };

  const animate = () => {
    if (!emojis) return;

    const tmpEmojis: EmojiProps[] = [];

    for (let i = 0; i < emojis.length; i++) {
      let { emoji, waitTime, currentTime, rebelFlag } = emojis[i]!;

      if (still.isStill) {
        // Peer pressure
        if (emoji !== "" && !rebelFlag) {
          emoji = still.stillEmoji;
        }

        currentTime = 0;
      } else {
        if (currentTime <= 0) {
          let max = 0;
          if (waitTime <= 4) {
            if (Math.random() * 100 < 10) {
              max = Math.floor(Math.random() * 300);
            } else {
              max = 4;
            }
          } else {
            max = 4;
          }

          const newWaitTime = getWaitTime(max);
          emoji = getEmoji();
          waitTime = newWaitTime;
          currentTime = newWaitTime;
          rebelFlag = still.isStill ? rebelFlag : Math.random() * 100 < 1;
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

    emojis && setEmojis(tmpEmojis);
  };

  // useAnimationFrame({ animate });

  const initEmojis = () => {
    const tmpEmojis: EmojiProps[] = [];
    for (let i = 0; i < emojisNumber; i++) {
      const wait = getWaitTime(Math.random() * 100 <= 10 ? 300 : 4);
      tmpEmojis[i] = {
        emoji: getEmoji(),
        waitTime: wait,
        currentTime: wait,
        rebelFlag: false,
      };
    }

    return tmpEmojis;
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Execute on mount
  useEffect(() => {
    setEmojis(initEmojis());
  }, []);

  const handleClick = () => {
    setStill((prevState) => {
      if (prevState.isStill) {
        return { isStill: false, stillEmoji: "" };
      } else {
        return {
          isStill: true,
          stillEmoji:
            EmojiStrings[Math.floor(Math.random() * EmojiStrings.length)],
        };
      }
    });
  };

  const drawCallback = (graphics: any) => {
    graphics.clear();
    graphics.setFillStyle({ color: "red" });
    graphics.rect(0, 0, 100, 100);
    graphics.fill();
  };

  return (
    <div className={Styles.container}>
      <Application autoStart width={canvasWidth} height={canvasHeight}>
        <pixiGraphics draw={drawCallback} />
      </Application>
    </div>
  );
};
