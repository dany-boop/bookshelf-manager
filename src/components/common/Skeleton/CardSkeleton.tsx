'use client';
import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse flex flex-col gap-5 p-2 bg-gradient-to-tr from-zinc-50 to-stone-50 dark:from-gray-800 dark:to-slate-800 border rounded-2xl overflow-hidden">
      <div className="flex gap-5">
        {/* Image Skeleton */}
        <div className="w-40 h-60 bg-gray-300 dark:bg-gray-600 rounded-xl" />
        <div className="flex flex-col gap-3 w-full">
          {/* Title Skeleton */}
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-3/4" />
          {/* Author Skeleton */}
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded-full w-1/2" />
          {/* Description Skeleton */}
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-full w-5/6" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
