'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { FC, useEffect, useState } from 'react';

interface loadingProps {
  delay: number;
}
const LoadingScreen = ({ delay }: loadingProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const step = 100 / (delay / 100); // Calculate step size based on delay
    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextValue = prev + step;
        return nextValue >= 100 ? 100 : nextValue;
      });
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, [delay]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      {/* Spinning Green Lines */}
      <div className="relative flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 border-t-4 border-green-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.2,
            }}
            style={{
              width: `${40 + i * 10}px`,
              height: `${40 + i * 10}px`,
            }}
          />
        ))}

        {/* Centered Icon */}
        <Image
          src="/assets/icon.svg"
          alt="Loading Icon"
          width={40}
          height={40}
          className="relative"
          loading="lazy"
        />
      </div>
      {/* Loading Progress Bar */}
      <Progress className=" w-52 mt-6 h-3" value={progress} />
    </div>
  );
};

export default LoadingScreen;
