"use client";
import React, { createContext, useContext, useLayoutEffect, useState, useEffect } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark' | 'secret';
  setTheme: (theme: 'light' | 'dark' | 'secret') => void;
  secretUnlocked: boolean;
  setSecretUnlocked: (unlocked: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  secretUnlocked: false,
  setSecretUnlocked: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'secret'>("light");
  const [secretUnlocked, setSecretUnlockedState] = useState(false);

  // On mount, sync theme and secretUnlocked with localStorage and html class
  useLayoutEffect(() => {
    const storedTheme = (localStorage.getItem('theme') as 'light' | 'dark' | 'secret') || 'light';
    setThemeState(storedTheme);
    const unlocked = localStorage.getItem('secretUnlocked') === 'true';
    setSecretUnlockedState(unlocked);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.classList.remove('light', 'dark', 'secret');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('secretUnlocked', secretUnlocked ? 'true' : 'false');
  }, [secretUnlocked]);

  const setTheme = (newTheme: 'light' | 'dark' | 'secret') => {
    setThemeState(newTheme);
  };

  const setSecretUnlocked = (unlocked: boolean) => {
    setSecretUnlockedState(unlocked);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, secretUnlocked, setSecretUnlocked }}>
      {children}
    </ThemeContext.Provider>
  );
};
