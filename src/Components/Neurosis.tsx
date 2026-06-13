import {useEffect, useRef} from "react";
import Styles from "@/Styles/Neurosis.module.scss";
import init, {type CrankDrawerApp, start_crank_drawer,} from "@/wasm/pkg/crank_drawer_wasm";
import {isMobile} from "react-device-detect";

export const Neurosis = () => {
  const appRef = useRef<CrankDrawerApp | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const canvasWidth = isMobile ? 3000 : 6000;
  const canvasHeight = isMobile ? 3000 : 6000;

  useEffect(() => {
    let disposed = false;

    const boot = async () => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      try {
        console.info("Initialize WASM...");
        await init();

        if (disposed) return;

        appRef.current = start_crank_drawer(canvas);
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
      <canvas
        className={`canvas ${Styles.canvas}`}
        width={canvasWidth}
        height={canvasHeight}
        ref={canvasRef}
      />
    </div>
  );
};
