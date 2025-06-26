'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [thumbRect, setThumbRect] = useState<DOMRect | null>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const openOverlay = () => {
    if (thumbRef.current) {
      const rect = thumbRef.current.getBoundingClientRect();
      setThumbRect(rect);
      setIsExpanded(true);
    }
  };

  const closeOverlay = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id !== 'expanded-image') {
      setIsExpanded(false);
    }
  };

  return (
    <main className="min-h-screen relative">
      {/* Zoom overlay with animation */}
      <AnimatePresence>
        {isExpanded && thumbRect && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={closeOverlay}
            initial={{ opacity: 0, filter: 'blur(0%)', backgroundColor: 'bg-black/0' }}
            animate={{ opacity: 1, filter: 'blur(100%)', backgroundColor: 'bg-black/50' }}
            exit={{ opacity: 0, filter: 'blur(0%)', backgroundColor: 'bg-black/0' }}
            transition={{ duration: 0.35, type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div
              className="relative w-[80%] max-w-4xl"
              initial={{
                x: thumbRect.left + thumbRect.width / 2 - window.innerWidth / 2,
                y: thumbRect.top + thumbRect.height / 2 - window.innerHeight / 2,
                scale: thumbRect.width / (window.innerWidth * 0.8),
                opacity: 0,
                filter: 'blur(0%)',
                backgroundColor: 'transparent',
              }}
              animate={{
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
                filter: 'blur(100%)',
                backgroundColor: 'bg-black/50',
              }}
              exit={{
                x: thumbRect.left + thumbRect.width / 2 - window.innerWidth / 2,
                y: thumbRect.top + thumbRect.height / 2 - window.innerHeight / 2,
                scale: thumbRect.width / (window.innerWidth * 0.8),
                opacity: 0,
                filter: 'blur(0%)',
                backgroundColor: 'transparent',
              }}
              transition={{ duration: 0.25, type: "spring", stiffness: 300, damping: 30 }}
            >
              <Image
                id="expanded-image"
                src="/images/eng.png"
                alt="Expanded"
                className="w-full h-auto rounded-xl shadow-2xl"
                width={512}
                height={512}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div
        className={`flex flex-col md:flex-row items-center gap-8 max-w-6xl mx-auto px-4 pt-20 transition-all duration-300 ${
          isExpanded ? 'blur-sm' : ''
        }`}
      >
        <div
          ref={thumbRef}
          className="group w-128 h-128 relative flex-shrink-0 cursor-pointer"
          onClick={openOverlay}
        >
          <Image
            src="/images/eng.png"
            alt="Thumbnail"
            fill
            className="interactable-object"
            style={{ outlineStyle: 'solid' }}
          />
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-5xl font-bold mb-4">Hello there, my name is Noah van Uunen</h1>
          <p className="text-lg">
            I am an 18-year-old game developer from the Netherlands. I&apos;ve been making games for 2
            years (primarily in Unity using C#). I enjoy programming and bringing ideas to life.
            I&apos;m currently studying game development at Grafisch Lyceum Utrecht. Outside of game dev,
            I enjoy writing, editing videos, and playing games.
          </p>
        </div>
      </div>
    </main>
  );
}
