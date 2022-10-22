import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAnimationFrame } from "./store/AnimationFrame";
import { Emoji, Gesture, Symbol } from "./constants/Emoji";
import Styles from "./scss/App.module.scss";

type Emoji =
  | {
      emoji: string;
      waitTime: number;
      currentTime: number;
      rebelFlag: boolean;
    }
  | undefined;

export const App = () => {
  const [emojis, setEmojis] = useState<Emoji[]>();
  const [still, setStill] = useState({ isStill: false, stillEmoji: "" });
  const emojisNumber = 1600;

  const getEmoji = useCallback(() => {
    const odds = Math.random() * 100;
    if (odds < 0.2) {
      return "";
    } else if (odds < 1.2) {
      return Symbol[Math.floor(Math.random() * Symbol.length)];
    } else {
      const combined = Emoji.concat(Gesture);
      return combined[Math.floor(Math.random() * combined.length)];
    }
  }, []);

  const getWaitTime = useCallback(
    (max: number) => Math.floor(Math.random() * max + 1),
    []
  );

  const animate = useCallback(() => {
    if (!emojis) return;

    const tmpEmojis: Emoji[] = [];
    emojis.forEach((tmpEmoji, index) => {
      let { emoji, waitTime, currentTime, rebelFlag } = tmpEmoji;

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

      tmpEmojis[index] = {
        emoji,
        waitTime,
        currentTime,
        rebelFlag,
      };
    });

    emojis && setEmojis(tmpEmojis);
  }, [emojis]);
  useAnimationFrame({ animate });

  const onClick = () => {
    setStill((prevState) => {
      if (prevState.isStill) {
        return { isStill: false, stillEmoji: "" };
      } else {
        return {
          isStill: true,
          stillEmoji: Emoji[Math.floor(Math.random() * Emoji.length)],
        };
      }
    });
  };

  const initEmojis = useMemo(() => {
    const tmpEmojis: Emoji[] = [];
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
  }, []);

  useEffect(() => {
    setEmojis(initEmojis);
  }, []);

  return (
    <div className={Styles.container} onClick={onClick}>
      {emojis?.map((emoji, idx) => (
        <div key={idx} className={Styles.item}>
          {emoji.emoji}
        </div>
      ))}
    </div>
  );
};
