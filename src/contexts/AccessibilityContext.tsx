import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ColorScheme = 'normal' | 'contrast-bw' | 'contrast-yb' | 'contrast-by';

interface AccessibilityContextType {
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  lineHeight: number;
  setLineHeight: (height: number) => void;
  imagesDisabled: boolean;
  toggleImages: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('highContrast') === 'true';
    }
    return false;
  });

  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('fontSize') as 'normal' | 'large' | 'xlarge') || 'normal';
    }
    return 'normal';
  });

  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('colorScheme') as ColorScheme) || 'normal';
    }
    return 'normal';
  });

  const [lineHeight, setLineHeight] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseFloat(localStorage.getItem('lineHeight') || '1.5');
    }
    return 1.5;
  });

  const [imagesDisabled, setImagesDisabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('imagesDisabled') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', String(isHighContrast));
  }, [isHighContrast]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-normal', 'font-large', 'font-xlarge');
    root.classList.add(`font-${fontSize}`);
    localStorage.setItem('fontSize', fontSize);
    
    // Apply font size to root
    const sizes = {
      normal: '16px',
      large: '20px',
      xlarge: '24px',
    };
    root.style.fontSize = sizes[fontSize];
  }, [fontSize]);

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all color scheme classes
    root.classList.remove('scheme-normal', 'scheme-contrast-bw', 'scheme-contrast-yb', 'scheme-contrast-by');
    
    // Add new color scheme class
    root.classList.add(`scheme-${colorScheme}`);
    localStorage.setItem('colorScheme', colorScheme);

    // Update high contrast based on color scheme
    if (colorScheme !== 'normal' && !isHighContrast) {
      setIsHighContrast(true);
    } else if (colorScheme === 'normal' && isHighContrast) {
      setIsHighContrast(false);
    }
  }, [colorScheme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--line-height-base', String(lineHeight));
    document.body.style.lineHeight = String(lineHeight);
    localStorage.setItem('lineHeight', String(lineHeight));
  }, [lineHeight]);

  useEffect(() => {
    const root = document.documentElement;
    if (imagesDisabled) {
      root.classList.add('images-disabled');
    } else {
      root.classList.remove('images-disabled');
    }
    localStorage.setItem('imagesDisabled', String(imagesDisabled));
  }, [imagesDisabled]);

  const toggleHighContrast = () => {
    if (isHighContrast) {
      setColorScheme('normal');
    } else {
      setColorScheme('contrast-yb');
    }
    setIsHighContrast((prev) => !prev);
  };

  const toggleImages = () => setImagesDisabled((prev) => !prev);

  return (
    <AccessibilityContext.Provider value={{ 
      isHighContrast, 
      toggleHighContrast, 
      fontSize, 
      setFontSize,
      colorScheme,
      setColorScheme,
      lineHeight,
      setLineHeight,
      imagesDisabled,
      toggleImages,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
