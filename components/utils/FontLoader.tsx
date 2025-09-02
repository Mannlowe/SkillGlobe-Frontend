'use client';

import { useEffect } from 'react';

interface FontLoaderProps {
  fonts: ('rubik' | 'nunito')[];
}

export default function FontLoader({ fonts }: FontLoaderProps) {
  useEffect(() => {
    const loadedFonts = new Set<string>();

    fonts.forEach((font) => {
      // Check if font is already loaded to avoid duplicates
      if (loadedFonts.has(font) || document.querySelector(`link[data-font="${font}"]`)) {
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('data-font', font);
      
      switch (font) {
        case 'rubik':
          link.href = 'https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap';
          break;
        case 'nunito':
          link.href = 'https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap';
          break;
      }

      document.head.appendChild(link);
      loadedFonts.add(font);
    });

    // Cleanup function to remove fonts when component unmounts (optional)
    return () => {
      fonts.forEach((font) => {
        const link = document.querySelector(`link[data-font="${font}"]`);
        if (link && link.parentNode) {
          // Only remove if no other components need this font
          // You might want to implement reference counting for this
        }
      });
    };
  }, [fonts]);

  return null; // This component doesn't render anything
}