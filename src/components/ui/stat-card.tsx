'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface StatCardProps {
  title: string;
  value: number;
  imageSrc: string;
  animateBackground?: boolean;
  imageClassName?: string;
}

export const StatCard = ({
  title,
  value,
  imageSrc,
  animateBackground = false,
  imageClassName = 'w-28 h-auto',
}: StatCardProps) => {
  return (
    <motion.div
      className="p-5 flex gap-5 bg-gradient-to-r from-green-500/40 via-stone-100 to-zinc-50 dark:from-green-500/40 dark:via-gray-800 dark:to-slate-800 shadow-sm dark:shadow-md rounded-lg border dark:border-0"
      initial={{
        scale: 0.9,
        ...(animateBackground && { backgroundPosition: '0% 50%' }),
      }}
      animate={{
        scale: 1,
        ...(animateBackground && {
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }),
      }}
      transition={{
        scale: { type: 'spring', stiffness: 100 },
        ...(animateBackground && {
          backgroundPosition: {
            duration: 10,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          },
        }),
      }}
      style={{
        ...(animateBackground && { backgroundSize: '200% 200%' }),
      }}
    >
      <Image
        src={imageSrc}
        alt={title}
        width={1500}
        height={1500}
        quality={100}
        loading="lazy"
        className={imageClassName}
      />
      <span>
        <h1 className="font-bold">{title}</h1>
        <p className="mt-3 text-3xl font-bold">{value}</p>
      </span>
    </motion.div>
  );
};
