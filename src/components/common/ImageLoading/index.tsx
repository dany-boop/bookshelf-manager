'use client';
import { useState } from 'react';
import Image from 'next/image';

interface LoadingImageType {
  src: string;
  alt: string;
  width?: number | `${number}`;
  height?: number | `${number}`;
  fill?: boolean;
  className?: string;
  imageClassName?: string;
  onLoadingComplete?: () => void;
}

export const LoadingImage = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  imageClassName,
  onLoadingComplete = () => {},
}: LoadingImageType) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
    onLoadingComplete();
  };

  return (
    <div className={`${className}`}>
      <div className="relative w-full h-full overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-200/50  backdrop-blur-md">
            {/* <Spinner className="w-6 h-6 text-gray-700" /> */}
          </div>
        )}
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`object-cover w-full h-full transition-transform duration-300 transform ${imageClassName}`}
          onLoad={handleLoad}
          {...(fill ? { fill } : { width, height })}
          priority
        />
      </div>
    </div>
  );
};
