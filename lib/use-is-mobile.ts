'use client';
import { useState, useEffect } from 'react';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window?.innerWidth : null,
  });

  useEffect(() => {
    const handleResize = () =>
      typeof window !== 'undefined' &&
      setWindowSize({ width: window?.innerWidth });

    window?.addEventListener('resize', handleResize);

    handleResize();

    return () => window?.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

const useIsMobile = (breakpoint: number = 768): boolean => {
  const { width } = useWindowSize()!;
  const [isMobile, setMobile] = useState<boolean>(
    width! <= (breakpoint || 768)
  );

  useEffect(() => {
    setMobile(width! <= (breakpoint || 768));
  }, [width, breakpoint]);

  return isMobile;
};

export default useIsMobile;
