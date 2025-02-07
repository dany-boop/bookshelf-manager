'use client';

import LoadingScreen from '@/components/common/page-loading';
import { useState, useEffect, ReactNode } from 'react';

interface ClientLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
  delay?: number;
}

export default function ClientLoader({
  children,
  fallback,
  delay = 1000,
}: ClientLoaderProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (loading) return fallback || <LoadingScreen delay={delay} />; // Default: `LoadingScreen`

  return <>{children}</>;
}
