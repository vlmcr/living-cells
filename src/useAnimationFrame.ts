import {useEffect, useRef} from "react";

export const useAnimationFrame = (callback: () => void, deltaTime: number) => {
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const update = () => {
      if ((Date.now() - previousTimeRef.current) > deltaTime) {
        previousTimeRef.current = Date.now();
        callback()
      }
      requestRef.current = requestAnimationFrame(update);
    }
    requestRef.current = requestAnimationFrame(update);

    return () => cancelAnimationFrame(requestRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
