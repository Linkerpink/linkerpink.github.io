'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from "next/link";
import { useMediaQuery } from 'react-responsive';

import GameCard from './game-card';
import { firstRowGames, games } from './games';

import SkillCard from './skill-card';
import Skills from './skills';

import LinkCard from './link-card';
import Links from './links';
import { useTheme } from './theme-context';

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [thumbRect, setThumbRect] = useState<DOMRect | null>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();
  const isSecretTheme = theme === 'secret';
  const isDarkTheme = theme === 'dark';

  const isMobile = useMediaQuery({ maxWidth: 767 }); // Tailwind 'md' breakpoint

  let gradientClass = '';
  if (!isSecretTheme) {
    gradientClass = isDarkTheme ? 'card-gradient-dark' : 'card-gradient-light';
  } else {
    gradientClass = 'card-gradient-secret';
  }

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
    <main className="min-h-screen relative overflow-x-hidden">
      <AnimatePresence>
        {isExpanded && thumbRect && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={closeOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div
              className="relative w-[80%] max-w-4xl"
              initial={{
                x: thumbRect.left + thumbRect.width / 2 - window.innerWidth / 2,
                y: thumbRect.top + thumbRect.height / 2 - window.innerHeight / 2,
                scale: thumbRect.width / (window.innerWidth * 0.8),
              }}
              animate={{ x: 0, y: 0, scale: 1 }}
              exit={{
                x: thumbRect.left + thumbRect.width / 2 - window.innerWidth / 2,
                y: thumbRect.top + thumbRect.height / 2 - window.innerHeight / 2,
                scale: thumbRect.width / (window.innerWidth * 0.8),
              }}
              transition={{ duration: 0.25, type: "spring", stiffness: 300, damping: 30 }}
            >
              <Image
                id="expanded-image"
                src="/images/about me p1.jpg"
                alt="About Me Zoomed"
                className="w-full h-full shadow-2xl"
                width={2560}
                height={2560}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Games Section */}
      <div className={`transition-all duration-300 ${isExpanded ? 'blur-sm' : ''}`}>
        <div id="home" className="games">
          <div className="content-row flex flex-wrap md:flex-nowrap md:justify-center -m-2 mb-4">
            {firstRowGames.map((game, i) => (
              <GameCard key={i} {...game} size={isMobile ? 'small' : 'large'} />
            ))}
          </div>
          <div className="content-row flex flex-wrap md:flex-nowrap md:justify-center -m-2">
            {games.map((game, i) => (
              <GameCard key={i} {...game} size="small" />
            ))}
          </div>
        </div>

        <div className="w-full pt-16 px-4">
          <Link
            href="/projects"
            className="block group interactable-object"
            prefetch={false}
            draggable={false}
          >
            <div className={`flex items-center rounded-[10px] p-4 shadow-lg cursor-pointer select-none ${gradientClass}`} draggable={false}>
              <div className="w-full h-full flex items-center justify-center overflow-hidden select-none">
                <h1 className="text-4xl font-bold text-center">See all</h1>
              </div>
            </div>
          </Link>
          <h1 className="text-2xl font-medium text-center text-[#5F5F5F] p-2 cursor-default">Browse all projects</h1>
        </div>

        <div className={`flex flex-col md:flex-row items-center gap-8 mx-auto px-4 pt-20 transition-all duration-300 max-w-6xl ${isExpanded ? 'blur-sm' : ''}`}>
          <div
            ref={thumbRef}
            className="group w-80 h-80 relative flex-shrink-0 cursor-pointer"
            onClick={openOverlay}
          >
            <Image
              src="/images/about me p1.jpg"
              alt="About Me Image"
              fill
              className="interactable-object object-cover rounded-lg"
              style={{ outlineStyle: 'solid' }}
            />
          </div>

          <div id="about-me" className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Hello there, my name is Noah van Uunen</h1>
            <p className="text-lg">
              I am an 18-year-old game developer from the Netherlands. I&apos;ve been making games for 2
              years (primarily in Unity using C#). I enjoy programming and bringing ideas to life.
              I&apos;m currently studying game development at Grafisch Lyceum Utrecht. Outside of game dev,
              I enjoy writing, editing videos, and playing games.
            </p>
          </div>
        </div>

        <div id="skills" className={`pt-20 px-4 transition-all duration-300 ${isExpanded ? 'blur-sm' : ''}`}>
          <h2 className="text-4xl font-bold mb-8 text-center">My Skills</h2>
          <div className="flex flex-wrap justify-center max-w-4xl mx-auto px-4">
            {Skills.map((skill, i) => (
              <SkillCard key={i} {...skill} />
            ))}
          </div>
        </div>

        <div id="links" className={`pt-20 px-4 transition-all duration-300 ${isExpanded ? 'blur-sm' : ''}`}>
          <h2 className="text-4xl font-bold mb-3 text-center">My links</h2>
          <div className="flex flex-wrap justify-center max-w-4xl mx-auto px-4">
            {Links.map((link, i) => (
              <LinkCard key={i} logo={link.logo} href={link.href} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
