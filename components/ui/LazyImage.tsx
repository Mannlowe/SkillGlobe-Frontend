'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from './SkeletonLoader';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  skeletonClassName?: string;
  containerClassName?: string;
  threshold?: number;
  rootMargin?: string;
}

export default function LazyImage({
  src,
  alt,
  fallback = '/images/placeholder.png',
  className,
  skeletonClassName,
  containerClassName,
  threshold = 0.1,
  rootMargin = '50px',
  ...props
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const currentImg = imgRef.current;
    if (!currentImg) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(currentImg);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(currentImg);

    return () => {
      if (currentImg) {
        observer.unobserve(currentImg);
      }
    };
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {isLoading && (
        <Skeleton 
          className={cn("absolute inset-0 w-full h-full", skeletonClassName)} 
        />
      )}
      
      <img
        ref={imgRef}
        src={isInView ? (hasError ? fallback : src) : undefined}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
}

// Optimized avatar component with lazy loading
interface LazyAvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string;
}

export function LazyAvatar({ 
  src, 
  alt, 
  size = 'md', 
  className, 
  fallback 
}: LazyAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const defaultFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=f97316&color=fff&size=128`;

  return (
    <LazyImage
      src={src || defaultFallback}
      alt={alt}
      fallback={fallback || defaultFallback}
      className={cn(
        "rounded-full object-cover",
        sizeClasses[size],
        className
      )}
      containerClassName={cn("rounded-full", sizeClasses[size])}
      skeletonClassName="rounded-full"
    />
  );
}

// Portfolio image with lazy loading and aspect ratio preservation
interface LazyPortfolioImageProps {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'wide';
  className?: string;
}

export function LazyPortfolioImage({ 
  src, 
  alt, 
  aspectRatio = 'video', 
  className 
}: LazyPortfolioImageProps) {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]'
  };

  return (
    <LazyImage
      src={src}
      alt={alt}
      className={cn(
        "w-full h-full object-cover",
        className
      )}
      containerClassName={cn(
        "w-full bg-gray-100",
        aspectClasses[aspectRatio]
      )}
    />
  );
}