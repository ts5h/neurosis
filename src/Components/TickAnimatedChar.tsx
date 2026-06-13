import { Text, type TextStyle } from "pixi.js";
import { extend, useTick } from "@pixi/react";
import type { StillProps } from "@/Components/Neurosis";
import { useEffect, useRef, useState } from "react";

extend({
  Text,
});

type Props = {
  textStyle: TextStyle;
  getNewEmoji: () => string;
  getWaitTime: (max: number) => number;
  x: number;
  y: number;
  still: StillProps;
};

export const TickAnimatedChar = ({
  textStyle,
  getNewEmoji,
  getWaitTime,
  x,
  y,
  still,
}: Props) => {
  const [emoji, setEmoji] = useState(getNewEmoji());
  const [waitTime, setWaitTime] = useState(0);
  const [rebelFlag, setRebelFlag] = useState(false);

  const textRef = useRef<any>(null);
  const frameCountRef = useRef(0);

  useTick(() => {
    if (!textRef.current) return;

    if (still.isStill) {
      if (emoji !== "" && !rebelFlag) {
        setEmoji(still.stillEmoji);
      }
    } else {
      frameCountRef.current++;

      if (frameCountRef.current >= waitTime) {
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

        setEmoji(getNewEmoji);
        setWaitTime(getWaitTime(max));
        setRebelFlag(() =>
          still.isStill ? rebelFlag : Math.random() * 100 < 1,
        );

        frameCountRef.current = 0;
      }
    }
  });

  useEffect(() => {
    if (!still.isStill) {
      setWaitTime(0);
    }
  }, [still]);

  return <pixiText text={emoji} x={x} y={y} style={textStyle} ref={textRef} />;
};
