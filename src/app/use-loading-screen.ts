'use client';

import { useState, useEffect } from 'react';

export const useLoadingScreen = (delay: number = 500) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return loading;
};
