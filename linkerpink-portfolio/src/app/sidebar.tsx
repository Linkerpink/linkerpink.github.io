'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const sidebarItems = [
  { href: '#home', img: '/images/eshop logo.png', alt: 'Home Icon', label: 'Home', offset: -80 },
  { href: '#about-me', img: '/images/eng.png', alt: 'My Menu Icon', label: 'Profile', offset: -250 },
  { href: '#skills', img: '/images/itch.io logo.png', alt: 'Projects Icon', label: 'Projects', offset: 50 },
  { href: '#links', img: '/images/eng.png', alt: 'Contact Icon', label: 'Links', offset: 50},
  { href: 'close', img: '/images/wii u close icon.png', alt: 'Close Icon', label: 'Close', last: true, external: true },
];


export default function Sidebar() {
  const [selectedLabel, setSelectedLabel] = useState('Home');

  useEffect(() => {
  const handleScroll = () => {
    const scrollY = window.scrollY;
    let currentLabel = 'Home';

    for (const item of sidebarItems) {
      if (!item.href.startsWith('#')) continue;

      const id = item.href.slice(1) || 'home';
      const section = document.getElementById(id);
      const offset = item.offset ?? -80;

      if (section) {
        const offsetTop = section.getBoundingClientRect().top + window.scrollY + offset +50;
        if (scrollY >= offsetTop) {
          currentLabel = item.label;
        }
      }
    }

    setSelectedLabel(currentLabel);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // initialize on load
  return () => window.removeEventListener('scroll', handleScroll);
}, []);



const handleClick = (e: React.MouseEvent, href: string, label: string) => {
  if (href.startsWith('#')) {
    e.preventDefault();
    const targetId = href.slice(1);
    const el = document.getElementById(targetId);
    if (el) {
      const item = sidebarItems.find(i => i.label === label);
      const yOffset = item?.offset ?? -80; // fallback offset
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
  setSelectedLabel(label);
};

  return (
    <nav className="fixed top-0 left-0 h-full flex flex-col items-center w-[10.5%] bg-transparent z-50">
      {sidebarItems.map((item, idx) => {
        const isSelected = item.label === selectedLabel;
        const base =
          'sidebar-item w-full py-4 px-0 bg-[#fafafa] text-center text-3xl transition-colors duration-300 text-[#3f3f3f] shadow-[5px_0px_5px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center flex-1 border-b-0 border-[#dedede] select-none no-underline cursor-default';
        const selected = isSelected ? 'text-[#F57C00]' : '';
        const first = idx === 0 ? 'rounded-tr-[35%]' : '';
        const last = item.last
          ? 'rounded-br-[35%] bg-gradient-to-r from-[#545454] to-[#323232] text-[#fafafa] border-b-0'
          : '';
        const hover = item.last
          ? 'hover:from-[#325c63] hover:to-[#323232]'
          : 'hover:bg-[#CBF8FE]';
        const className = [base, selected, first, last, hover].join(' ');

        const content = (
          <>
            <Image
              src={item.img}
              alt={item.alt}
              width={64}
              height={64}
              className="w-1/4 h-auto mb-3 pointer-events-none"
              draggable={false}
              priority={idx === 0}
            />
            <span className="mt-1">{item.label}</span>
          </>
        );

        if (item.external || !item.href.startsWith('#')) {
          return (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              draggable={false}
              className={className}
              onClick={() => setSelectedLabel(item.label)}
            >
              {content}
            </a>
          );
        }

        return (
          <a
            key={item.label}
            href={item.href}
            onClick={(e) => handleClick(e, item.href, item.label)}
            draggable={false}
            className={className}
          >
            {content}
          </a>
        );
      })}
    </nav>
  );
}
