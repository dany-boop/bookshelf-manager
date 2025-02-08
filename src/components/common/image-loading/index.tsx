'use client';

import { cn } from '@/lib/utils';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

type OptimizedImageProps = ImageProps & {
  className?: string;
  alt: string;
};

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  className,
  alt,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        props.fill ? 'absolute inset-0' : '',
        className
      )}
    >
      <Image
        {...props}
        alt={alt}
        className={cn(
          'transition-opacity duration-700 ease-in-out',
          isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-xl' // ✅ Backdrop blur effect
        )}
        onLoadingComplete={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default OptimizedImage;
