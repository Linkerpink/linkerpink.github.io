"use client";
import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "./theme-context";
import { motion } from "framer-motion";

export default function EasterEggUnlocker() {
  const { secretUnlocked, setSecretUnlocked } = useTheme();
  const [showPopup, setShowPopup] = useState(false);
  const { theme } = useTheme();
  const isSecretTheme = theme === 'secret';
  const isDarkTheme = theme === 'dark';
  let gradientClass = '';
  if (!isSecretTheme) {
    gradientClass = isDarkTheme ? 'card-gradient-dark' : 'card-gradient-light';
  }
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  const keyBuffer = useRef<string[]>([]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keyBuffer.current.push(e.key);
      if (keyBuffer.current.length > konamiCode.length) {
        keyBuffer.current.shift();
      }
      if (!secretUnlocked && keyBuffer.current.join(',') === konamiCode.join(',')) {
        setSecretUnlocked(true);
        setShowPopup(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [konamiCode, secretUnlocked, setSecretUnlocked]);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur 1 pointer-events-auto">
      <div className={`text-2xl font-bold px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 ${gradientClass}`}
        style={isSecretTheme ? {
          borderRadius: '75%',
          background: '#ff16ea',
          color: '#faecb7',
          fontFamily: 'Smooch, cursive, Arial, sans-serif',
          border: '10px solid #faecb7',
        } : { borderRadius: '10px' }}>
        <motion.span
            initial={{ scale: 0, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="drop-shadow-lg"
            >
            Secret theme unlocked!
        </motion.span>
        <button
          className="mt-4 px-6 py-2 rounded-lg bg-white text-pink-600 font-semibold text-lg shadow hover:bg-pink-100 transition-colors"
          onClick={() => setShowPopup(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}
