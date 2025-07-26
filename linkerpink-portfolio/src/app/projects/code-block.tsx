"use client";

import React, { useState, useEffect, useRef } from "react";
import Highlight from "react-highlight";
import { AnimatePresence, motion } from "framer-motion";
import "highlight.js/styles/kimbie-light.css";

interface CodeBlockProps {
  language: string;
  name: string;
  description?: string;
  children: string;
}

// Custom hook to detect if screen is mobile
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState(false);
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < breakpoint);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

export default function CodeBlock({
  language,
  name,
  description,
  children,
}: CodeBlockProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const blockRef = useRef<HTMLElement | null>(null);

  // Scroll to the block when mobile fullscreen is closed
  useEffect(() => {
    if (!isOpen && isMobile && blockRef.current) {
      setTimeout(() => {
        blockRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  }, [isOpen, isMobile]);

  // Lock body scroll when mobile fullscreen is active
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = isOpen ? "hidden" : "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

  const content = (
    <article className="flex flex-col h-full">
      {description && (
        <div className="text-gray-700 bg-gray-100 px-6 py-3 border-b border-gray-200 text-sm leading-relaxed">
          {description}
        </div>
      )}
      <div className="p-6 overflow-auto bg-gray-50 text-gray-900 rounded-b-xl text-sm leading-relaxed font-mono flex-1">
        <Highlight className={language}>{children.trim()}</Highlight>
      </div>
    </article>
  );

  return (
    <section
      ref={blockRef}
      aria-label={`${language} code block: ${name}`}
      className="relative border border-gray-300 rounded-3xl overflow-hidden bg-white"
    >
      <header
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen((v) => !v);
          }
        }}
        className={`flex justify-between items-center px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900 font-mono text-base font-semibold cursor-pointer select-none rounded-t-xl shadow-sm hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200
          ${isOpen && !isMobile ? " sticky top-0 z-50 bg-white" : ""}`}
        style={{
          borderTopLeftRadius: "1.5rem",
          borderTopRightRadius: "1.5rem",
        }}
      >
        <div className="flex flex-col gap-1 z-10 w-full">
          <span className="truncate">
            {language.toUpperCase()} — {name}
          </span>
        </div>

        <motion.button
          aria-label={isOpen ? "Collapse code" : "Expand code"}
          className="text-[#F57C00] font-bold text-2xl leading-none select-none"
          animate={{ rotate: isOpen ? 0 : 90, scale: isOpen ? 1 : 1.2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((v) => !v);
          }}
          type="button"
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? "−" : "+"}
        </motion.button>
      </header>

      <AnimatePresence initial={false}>
        {isOpen && !isMobile && (
          <>
            <motion.div
              key="animated-underline"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              exit={{ width: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-1 bg-[#F57C00] rounded-full"
            />

            <motion.div
              key="codeblock"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.3, ease: "easeInOut" },
                opacity: { duration: 0.25 },
              }}
              className="overflow-hidden"
              style={{ maxHeight: "60vh", overflowY: "auto" }}
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Fullscreen animation for mobile */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[998] bg-black"
            />

            {/* Fullscreen content */}
            <motion.div
              key="mobile-fullscreen"
              initial={{ scale: 0.95, opacity: 0, y: window.innerHeight / 2 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: window.innerHeight / 2 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="fixed inset-0 z-[999] bg-white flex flex-col"
            >
              <header className="relative flex items-center px-5 py-6 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900 font-mono text-base font-semibold shadow-md">
                <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
                  {language.toUpperCase()} — {name}
                </span>
                <button
                  aria-label="Close fullscreen code"
                  onClick={() => setIsOpen(false)}
                  className="ml-auto text-[#F57C00] font-bold text-6xl leading-none select-none"
                >
                  ×
                </button>
              </header>
              <div className="flex-1 overflow-auto">{content}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
