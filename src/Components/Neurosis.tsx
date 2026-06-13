import {useEffect, useRef} from "react";
import Styles from "@/Styles/Neurosis.module.scss";
import {isMobile} from "react-device-detect";

export const Neurosis = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const canvasWidth = isMobile ? 3000 : 6000;
  const canvasHeight = isMobile ? 3000 : 6000;

  return (
    <div className={Styles.container}>
      <canvas
        className={`canvas ${Styles.canvas}`}
        width={canvasWidth}
        height={canvasHeight}
        ref={canvasRef}
      />
    </div>
  );
};
