import { useCallback, useEffect, useRef } from "react";

type Props = {
  animate?: () => void;
};

export const useAnimationFrame = ({ animate }: Props) => {
  const regIdRef = useRef<number>();
  const loop = useCallback(() => {
    regIdRef.current = requestAnimationFrame(loop);
    animate();
  }, [animate]);

  useEffect(() => {
    regIdRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(regIdRef.current);
    };
  }, [loop]);
};
