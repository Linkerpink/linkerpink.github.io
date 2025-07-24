"use client";

import React, { useState, useRef, useEffect } from "react";
import Highlight from "react-highlight";
import { AnimatePresence, motion } from "framer-motion";
import "highlight.js/styles/kimbie-light.css";

interface CodeBlockProps {
  language: string;
  name: string;
  description?: string;
  children: string;
}

export default function CodeBlock({
  language,
  name,
  description,
  children,
}: CodeBlockProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, children, description]);

  return (
    <section
      aria-label={`${language} code block: ${name}`}
      className="relative border border-gray-300 rounded-xl overflow-hidden shadow-md bg-white transition-shadow duration-300
        hover:shadow-lg focus-within:shadow-lg"
    >
      {/* Header */}
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
        className="flex justify-between items-center px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100
          text-gray-900 font-mono text-base font-semibold cursor-pointer select-none
          rounded-t-xl shadow-sm
          hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200
          focus:outline-none focus:ring-2 focus:ring-[#F57C00] focus:ring-offset-1"
      >
        <span className="truncate">
          {language.toUpperCase()} — {name}
        </span>
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

      {/* Animated content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="codeblock"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: "easeInOut" },
              opacity: { duration: 0.25 },
            }}
            className="overflow-hidden"
          >
            <article ref={contentRef}>
              {description && (
                <div className="text-gray-700 bg-gray-100 px-6 py-3 border-t border-b border-gray-200 text-sm leading-relaxed">
                  {description}
                </div>
              )}
              <pre className="p-6 overflow-auto bg-gray-100 text-gray-900 rounded-b-xl text-sm leading-relaxed font-mono shadow-lg">
                <Highlight className={language}>
                  {children
                    .trim()
                    .split("\n")
                    .map((line, i) => (
                      <span key={i}>{line || "\u00A0"}</span>
                    ))}
                </Highlight>
              </pre>
            </article>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
