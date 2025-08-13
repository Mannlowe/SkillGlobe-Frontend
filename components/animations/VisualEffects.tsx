'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Parallax scroll effect
interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ children, speed = 0.5, className }: ParallaxProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;
      
      const rect = elementRef.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;
      
      setOffset(rate);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={elementRef}
      className={cn("relative", className)}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  );
}

// Floating particles background
interface FloatingParticlesProps {
  count?: number;
  size?: number;
  speed?: number;
  color?: string;
  className?: string;
}

export function FloatingParticles({
  count = 20,
  size = 4,
  speed = 20,
  color = 'bg-orange-500',
  className
}: FloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    const initialParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      opacity: Math.random() * 0.6 + 0.2
    }));
    
    setParticles(initialParticles);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.vx / 100) % 100,
        y: (particle.y + particle.vy / 100) % 100
      })));
    }, 100);

    return () => clearInterval(interval);
  }, [count, speed]);

  return (
    <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden", className)}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className={cn("absolute rounded-full", color)}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: size,
            height: size,
            opacity: particle.opacity,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
}

// Morphing blob background
interface MorphingBlobProps {
  size?: number;
  color?: string;
  duration?: number;
  className?: string;
}

export function MorphingBlob({
  size = 200,
  color = '#f97316',
  duration = 8,
  className
}: MorphingBlobProps) {
  return (
    <div
      className={cn("absolute opacity-20", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        animation: `morphBlob ${duration}s ease-in-out infinite`
      }}
    >
      <style jsx>{`
        @keyframes morphBlob {
          0%, 100% {
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            transform: translate(-50%, -50%) rotate(0deg);
          }
          25% {
            border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
            transform: translate(-50%, -50%) rotate(90deg);
          }
          50% {
            border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
            transform: translate(-50%, -50%) rotate(180deg);
          }
          75% {
            border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
            transform: translate(-50%, -50%) rotate(270deg);
          }
        }
      `}</style>
    </div>
  );
}

// Glitch effect text
interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function GlitchText({ text, className, intensity = 'medium' }: GlitchTextProps) {
  const intensities = {
    low: '1px',
    medium: '2px',
    high: '4px'
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <span
        className="relative z-10"
        style={{
          animation: `glitch 2s infinite linear alternate-reverse`,
          textShadow: `
            ${intensities[intensity]} 0 #ff00c1,
            -${intensities[intensity]} 0 #00fff9,
            0 ${intensities[intensity]} #ffff00
          `
        }}
      >
        {text}
      </span>
      
      <span
        className="absolute top-0 left-0 opacity-80"
        style={{
          color: '#ff00c1',
          animation: `glitch2 2s infinite linear alternate-reverse`,
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)'
        }}
      >
        {text}
      </span>
      
      <span
        className="absolute top-0 left-0 opacity-80"
        style={{
          color: '#00fff9',
          animation: `glitch3 2s infinite linear alternate-reverse`,
          clipPath: 'polygon(0 80%, 100% 20%, 100% 100%, 0 100%)'
        }}
      >
        {text}
      </span>

      <style jsx>{`
        @keyframes glitch {
          0%, 100% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
        }
        
        @keyframes glitch2 {
          0%, 100% {
            transform: translate(0);
          }
          20% {
            transform: translate(2px, 0);
          }
          40% {
            transform: translate(-2px, 0);
          }
          60% {
            transform: translate(0, 2px);
          }
          80% {
            transform: translate(0, -2px);
          }
        }
        
        @keyframes glitch3 {
          0%, 100% {
            transform: translate(0);
          }
          20% {
            transform: translate(-1px, 0);
          }
          40% {
            transform: translate(1px, 0);
          }
          60% {
            transform: translate(0, -1px);
          }
          80% {
            transform: translate(0, 1px);
          }
        }
      `}</style>
    </div>
  );
}

// Typewriter effect
interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export function Typewriter({
  text,
  speed = 50,
  delay = 0,
  className,
  onComplete
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= text.length) {
            clearInterval(interval);
            onComplete?.();
            return prev;
          }
          setDisplayText(text.slice(0, prev + 1));
          return prev + 1;
        });
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay, onComplete]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className={className}>
      {displayText}
      <span className={cn(
        "inline-block w-0.5 h-em bg-current ml-1",
        showCursor ? "opacity-100" : "opacity-0"
      )} />
    </span>
  );
}

// Gradient text effect
interface GradientTextProps {
  text: string;
  gradient?: string;
  className?: string;
  animated?: boolean;
}

export function GradientText({
  text,
  gradient = 'from-orange-500 to-pink-500',
  className,
  animated = false
}: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        gradient,
        animated && "animate-pulse",
        className
      )}
      style={animated ? {
        backgroundSize: '200% 200%',
        animation: 'gradientShift 3s ease infinite'
      } : undefined}
    >
      {text}
      {animated && (
        <style jsx>{`
          @keyframes gradientShift {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
        `}</style>
      )}
    </span>
  );
}

// Shimmer loading effect
interface ShimmerProps {
  className?: string;
  children?: React.ReactNode;
}

export function Shimmer({ className, children }: ShimmerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-200 rounded",
        className
      )}
    >
      {children}
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          animation: 'shimmer 1.5s infinite'
        }}
      />
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}