'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

import GameCard from './game-card';
import { firstRowGames, games } from './games';

import SkillCard from './skill-card';
import Skills from './skills';

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
                src="/images/about me p1.jpg"
                alt="/images/about me p1 low res.jpg"
                className="w-full h-full shadow-2xl"
                width={2560}
                height={2560}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}

      {/*<div className="content px-4 py-10 ${isExpanded ? 'blur-sm' : ''"></div>*/}

      <div className={`transition-all duration-300 ${
          isExpanded ? 'blur-sm' : ''
        }`}>
          <div className="games">
            <div className="content-row flex flex-nowrap -m-2 mb-4 justify-center">
              {firstRowGames.map((game, i) => (
                <GameCard key={i} {...game} size="large" />
              ))}
            </div>
            <div className="content-row flex flex-nowrap -m-2 justify-center">
              {games.map((game, i) => (
                <GameCard key={i} {...game} size="small" />
              ))}
            </div>
          </div>
      </div>

      <div
        className={`flex flex-col md:flex-row items-center gap-8 mx-auto px-4 pt-20 transition-all duration-300 ${
          isExpanded ? 'blur-sm' : ''
        }`}
      >
        <div
          ref={thumbRef}
          className="group w-128 h-128 relative flex-shrink-0 cursor-pointer"
          onClick={openOverlay}
        >
          <Image
            src="/images/about me p1.jpg"
            alt="/images/about me p1 low res.jpg"
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

      <div className={`pt-20 px-4 transition-all duration-300 ${isExpanded ? 'blur-sm' : ''}`}>
        <h2 className="text-4xl font-bold mb-8 text-center">My Skills</h2>
        <div className="flex flex-wrap justify-center max-w-4xl mx-auto px-4">
          {Skills.map((skill, i) => (
            <SkillCard key={i} {...skill} />
          ))}
        </div>
      </div>

    </main>
  );
}
