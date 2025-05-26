'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [10, -10]);
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  if (!hasMounted) return null;

  const handleMouseMove = (e: React.MouseEvent) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - bounds.left - bounds.width / 3;
    const offsetY = e.clientY - bounds.top - bounds.height / 3;
    x.set(offsetX);
    y.set(offsetY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-zinc-50 to-stone-50 dark:from-gray-800 dark:to-slate-800 p-8"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX: springX, rotateY: springY }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="text-7xl mb-4"
        >
          🤔
        </motion.div>
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold text-slate-900 dark:text-slate-50"
        >
          404
        </motion.h1>
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-xl text-slate-800 dark:text-slate-100"
        >
          Oops! The page you’re looking for doesn’t exist.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-transform duration-200"
          >
            Go back home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
