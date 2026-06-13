import { useEffect, useRef, useState } from "react";
import Styles from "@/Styles/CrankDrawer.module.scss";
import init, {
  start_crank_drawer,
  type CrankDrawerApp,
} from "@/wasm/pkg/crank_drawer_wasm";
import { isMobile } from "react-device-detect";

type LineInfo = {
  radius: number;
  degreeStep: number;
  currentDegree: number;
};

const toLineInfoArray = (value: unknown): LineInfo[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const candidate = item as Record<string, unknown>;
    const radius = candidate.radius;
    const degreeStep = candidate.degreeStep;
    const currentDegree = candidate.currentDegree;

    if (
      typeof radius !== "number" ||
      typeof degreeStep !== "number" ||
      typeof currentDegree !== "number"
    ) {
      return [];
    }

    return [{ radius, degreeStep, currentDegree }];
  });
};

export const CrankDrawer = () => {
  const [linesInfo, setLinesInfo] = useState<LineInfo[]>([]);
  const appRef = useRef<CrankDrawerApp | null>(null);

  const canvasLineRef = useRef<HTMLCanvasElement>(null);
  const canvasCrankRef = useRef<HTMLCanvasElement>(null);

  const canvasWidth = isMobile ? 3000 : 6000;
  const canvasHeight = isMobile ? 3000 : 6000;

  useEffect(() => {
    let disposed = false;

    const boot = async () => {
      const canvasCrank = canvasCrankRef.current;
      const canvasLine = canvasLineRef.current;

      if (!canvasCrank || !canvasLine) {
        return;
      }

      try {
        console.info("Initialize WASM...");
        await init();

        if (disposed) {
          return;
        }

        const app = start_crank_drawer(canvasCrank, canvasLine);
        appRef.current = app;
        setLinesInfo(toLineInfoArray(app.lines_info()));
        console.info(
          "Crank Drawer is currently running on the WASM side. Click to reset.",
        );
      } catch (error) {
        console.error(error);
        if (!disposed) {
          console.error("Failed to initialize WASM.");
        }
      }
    };

    const handleClick = () => {
      const app = appRef.current;
      if (!app) {
        return;
      }

      try {
        app.reset();
        setLinesInfo(toLineInfoArray(app.lines_info()));
      } catch (error) {
        console.error(error);
        console.error("The reset on the Wasm side failed.");
      }
    };

    void boot();
    document.addEventListener("click", handleClick);

    return () => {
      disposed = true;
      document.removeEventListener("click", handleClick);
      appRef.current?.stop();
      appRef.current = null;
    };
  }, []);

  return (
    <div className={Styles.container}>
      <div className={Styles.info}>
        {linesInfo.length > 0 && (
          <table>
            <tbody>
              {linesInfo.map((line, i) => (
                <tr key={i.toString()}>
                  <td className={Styles.sep}>{i + 1}.</td>
                  <td className={Styles.number}>{line.radius.toFixed(2)}px</td>
                  <td className={Styles.sep}>/</td>
                  <td className={Styles.number}>
                    {line.degreeStep.toFixed(2)}°
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <canvas
        className={`canvas ${Styles.canvas1}`}
        width={canvasWidth}
        height={canvasHeight}
        ref={canvasCrankRef}
      />
      <canvas
        className={`canvas ${Styles.canvas2}`}
        width={canvasWidth}
        height={canvasHeight}
        ref={canvasLineRef}
      />
    </div>
  );
};
