'use client';

// WCAG 2.1 Color Contrast Utilities

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface ContrastResult {
  ratio: number;
  level: 'AA' | 'AAA' | 'fail';
  passes: boolean;
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): ColorRGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Get relative luminance of a color
 * Based on WCAG 2.1 specification
 */
export function getRelativeLuminance(color: ColorRGB): number {
  const { r, g, b } = color;
  
  const [rs, gs, bs] = [r, g, b].map(c => {
    const srgb = c / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: ColorRGB, color2: ColorRGB): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  
  const lightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (lightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if colors meet WCAG contrast requirements
 */
export function checkContrast(
  foreground: string, 
  background: string, 
  fontSize: number = 16,
  fontWeight: number = 400
): ContrastResult {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  
  if (!fg || !bg) {
    return { ratio: 0, level: 'fail', passes: false };
  }
  
  const ratio = getContrastRatio(fg, bg);
  
  // WCAG 2.1 requirements
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
  const aaRequirement = isLargeText ? 3 : 4.5;
  const aaaRequirement = isLargeText ? 4.5 : 7;
  
  let level: 'AA' | 'AAA' | 'fail' = 'fail';
  let passes = false;
  
  if (ratio >= aaaRequirement) {
    level = 'AAA';
    passes = true;
  } else if (ratio >= aaRequirement) {
    level = 'AA';
    passes = true;
  }
  
  return { ratio, level, passes };
}

/**
 * Get accessible color variations
 */
export function getAccessibleColors(baseColor: string, backgroundHex: string = '#ffffff') {
  const background = hexToRgb(backgroundHex);
  if (!background) return null;
  
  const variations = [];
  
  // Generate darker/lighter variations
  for (let i = 0; i <= 100; i += 10) {
    const adjustedHex = adjustColorBrightness(baseColor, i - 50);
    const contrast = checkContrast(adjustedHex, backgroundHex);
    
    if (contrast.passes) {
      variations.push({
        color: adjustedHex,
        contrast: contrast.ratio,
        level: contrast.level
      });
    }
  }
  
  return variations.sort((a, b) => b.contrast - a.contrast);
}

/**
 * Adjust color brightness
 */
export function adjustColorBrightness(hex: string, percent: number): string {
  const color = hexToRgb(hex);
  if (!color) return hex;
  
  const adjust = (c: number) => {
    const adjusted = Math.round(c + (255 - c) * (percent / 100));
    return Math.max(0, Math.min(255, adjusted));
  };
  
  const r = adjust(color.r).toString(16).padStart(2, '0');
  const g = adjust(color.g).toString(16).padStart(2, '0');
  const b = adjust(color.b).toString(16).padStart(2, '0');
  
  return `#${r}${g}${b}`;
}

/**
 * Get optimal text color for background
 */
export function getOptimalTextColor(backgroundColor: string): string {
  const whiteContrast = checkContrast('#ffffff', backgroundColor);
  const blackContrast = checkContrast('#000000', backgroundColor);
  
  return whiteContrast.ratio > blackContrast.ratio ? '#ffffff' : '#000000';
}

/**
 * CSS custom properties for dynamic contrast
 */
export function generateContrastCSS(baseColors: Record<string, string>) {
  const cssVars: Record<string, string> = {};
  
  Object.entries(baseColors).forEach(([name, color]) => {
    const textColor = getOptimalTextColor(color);
    const variations = getAccessibleColors(color) || [];
    
    cssVars[`--color-${name}`] = color;
    cssVars[`--color-${name}-text`] = textColor;
    
    if (variations.length > 0) {
      cssVars[`--color-${name}-accessible`] = variations[0].color;
      cssVars[`--color-${name}-high-contrast`] = variations.find(v => v.level === 'AAA')?.color || variations[0].color;
    }
  });
  
  return cssVars;
}

/**
 * Validate all colors in a theme
 */
export function validateColorTheme(theme: Record<string, { bg: string; fg: string; fontSize?: number; fontWeight?: number }>) {
  const results: Record<string, ContrastResult> = {};
  
  Object.entries(theme).forEach(([name, { bg, fg, fontSize, fontWeight }]) => {
    results[name] = checkContrast(fg, bg, fontSize, fontWeight);
  });
  
  return results;
}

/**
 * Real-time contrast checker for design systems
 */
export class ContrastChecker {
  private observers: Map<string, (result: ContrastResult) => void> = new Map();
  
  observe(id: string, foreground: string, background: string, callback: (result: ContrastResult) => void) {
    this.observers.set(id, callback);
    this.check(id, foreground, background);
  }
  
  unobserve(id: string) {
    this.observers.delete(id);
  }
  
  check(id: string, foreground: string, background: string) {
    const callback = this.observers.get(id);
    if (callback) {
      const result = checkContrast(foreground, background);
      callback(result);
    }
  }
  
  checkAll(colors: Record<string, { fg: string; bg: string }>) {
    const results: Record<string, ContrastResult> = {};
    
    Object.entries(colors).forEach(([id, { fg, bg }]) => {
      results[id] = checkContrast(fg, bg);
      this.check(id, fg, bg);
    });
    
    return results;
  }
}

// Export singleton instance
export const contrastChecker = new ContrastChecker();

/**
 * React hook for contrast checking
 */
export function useContrastCheck(foreground: string, background: string, options?: {
  fontSize?: number;
  fontWeight?: number;
}) {
  const result = checkContrast(foreground, background, options?.fontSize, options?.fontWeight);
  
  return {
    ...result,
    isAccessible: result.passes,
    suggestion: result.passes ? null : getAccessibleColors(foreground, background)?.[0]?.color
  };
}

/**
 * Generate theme with guaranteed contrast
 */
export function generateAccessibleTheme(baseColors: string[]) {
  const theme: Record<string, { primary: string; text: string; background: string }> = {};
  
  baseColors.forEach((color, index) => {
    const textColor = getOptimalTextColor(color);
    const accessible = getAccessibleColors(color);
    
    theme[`color-${index}`] = {
      primary: accessible?.[0]?.color || color,
      text: textColor,
      background: textColor === '#ffffff' ? '#000000' : '#ffffff'
    };
  });
  
  return theme;
}