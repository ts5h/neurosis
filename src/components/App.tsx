import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAnimationFrame } from "./store/AnimationFrame";
import { Emoji } from "./constants/Emoji";
import Styles from "./scss/App.module.scss";

type Emoji =
  | {
      emoji: string;
      waitTime: number;
      currentTime: number;
    }
  | undefined;

export const App = () => {
  const emojisNumber = 900;
  const [emojis, setEmojis] = useState<Emoji[]>();

  const getEmoji = useCallback(
    () => Emoji[Math.floor(Math.random() * Emoji.length)],
    []
  );

  const getWaitTime = useCallback((max: number) => Math.floor(Math.random() * max + 1), []);

  const animate = useCallback(() => {
    const tmpEmojis: Emoji[] = [];
    for (let i = 0; i < emojisNumber; i++) {
      let { emoji, waitTime, currentTime } = emojis[i];

      if (currentTime <= 0) {
        let max = 0;
        if (waitTime <= 4) {
          if (Math.floor(Math.random() * 100) <= 2) {
            max = Math.floor(Math.random() * 1000) + 1;
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
      } else {
        currentTime--;
      }

      tmpEmojis[i] = {
        emoji: emoji,
        waitTime: waitTime,
        currentTime: currentTime,
      };
    }

    emojis && setEmojis(tmpEmojis);
  }, [emojis]);
  useAnimationFrame({ animate });


  const initEmojis = useMemo(() => {
    const tmpEmojis: Emoji[] = [];
    for (let i = 0; i < emojisNumber; i++) {
      const wait = getWaitTime(Math.random() * 100 <= 2 ? 1000 : 4);
      tmpEmojis[i] = {
        emoji: getEmoji(),
        waitTime: wait,
        currentTime: wait,
      };
    }
    return tmpEmojis;
  }, []);

  useEffect(() => {
    setEmojis(initEmojis);
  }, []);

  return (
    <div className={Styles.container}>
      {emojis?.map((emoji, idx) => (
        <div key={idx} className={Styles.item}>
          {emoji.emoji}
        </div>
      ))}
    </div>
  );
};
