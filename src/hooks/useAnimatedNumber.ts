"use client";

import { useEffect, useRef, useState } from "react";

export function useAnimatedNumber(target: number, duration = 0.8): number {
  const [current, setCurrent] = useState(target);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(current);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = current;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      const value = startRef.current + (target - startRef.current) * eased;

      setCurrent(value);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
    
  }, [target, duration]);

  return current;
}
