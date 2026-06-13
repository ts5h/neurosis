import Styles from "@/Styles/Neurosis.module.scss";
import { isMobile } from "react-device-detect";
import { useState } from "react";
import { EmojiStrings, GestureStrings, SymbolStrings } from "@/constants/Emoji";
import { Application, extend } from "@pixi/react";
import { Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";
import { TickAnimatedChar } from "@/Components/TickAnimatedChar";

extend({
  Container,
  Graphics,
  Sprite,
  Text,
});

const textStyle = new TextStyle({
  fontSize: 16,
  fill: "#000",
});

export type StillProps = {
  isStill: boolean;
  stillEmoji: string;
};

export const Neurosis = () => {
  const [still, setStill] = useState<StillProps>({
    isStill: false,
    stillEmoji: "",
  });

  const canvasWidth = isMobile ? 3000 : 6000;
  const canvasHeight = isMobile ? 3000 : 6000;

  // emoji width, height
  const itemSize = textStyle.fontSize;

  const horizontalNumber = Math.ceil(window.innerWidth / itemSize);
  const verticalNumber = Math.ceil(window.innerHeight / itemSize);

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

  const getWaitTime = (max: number) => {
    return Math.floor(Math.random() * max + 1);
  };

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

  return (
    <div className={Styles.container}>
      <Application
        autoStart
        width={canvasWidth}
        height={canvasHeight}
        background={"#ffffff"}
      >
        <TickAnimatedChar
          textStyle={textStyle}
          getNewEmoji={getNewEmoji}
          getWaitTime={getWaitTime}
          x={0}
          y={0}
          still={still}
        />
        <pixiSprite
          width={canvasWidth}
          height={canvasHeight}
          eventMode={"static"}
          onPointerDown={handleClick}
        />
      </Application>
    </div>
  );
};
