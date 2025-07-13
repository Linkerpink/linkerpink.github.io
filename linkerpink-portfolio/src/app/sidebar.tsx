'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const homepageSidebarItems: SidebarItem[] = [
  { href: '#home', img: '/images/eshop logo.png', alt: 'Home Icon', label: 'Home', offset: -80, anchor: undefined },
  { href: '#about-me', img: '/images/eng.png', alt: 'My Menu Icon', label: 'Profile', offset: -250, anchor: undefined },
  { href: '#skills', img: '/images/itch.io logo.png', alt: 'Projects Icon', label: 'Skills', offset: 75, anchor: undefined },
  { href: '/settings', img: '/images/settings icon.svg', alt: 'Settings Icon', label: 'Settings', offset: 0, anchor: undefined },
  { href: 'close', img: '/images/wii u close icon.png', alt: 'Close Icon', label: 'Close', last: true, external: true, anchor: undefined },
];

type SidebarItem = {
  href: string;
  img: string;
  alt: string;
  label: string;
  offset?: number;
  last?: boolean;
  external?: boolean;
  anchor?: string;
};

const nonHomepageSidebarItems: SidebarItem[] = [
  { href: '/#home', img: '/images/eshop logo.png', alt: 'Home Icon', label: 'Home', anchor: 'home' },
  { href: '/#about-me', img: '/images/eng.png', alt: 'My Menu Icon', label: 'Profile', anchor: 'about-me' },
  { href: '/#skills', img: '/images/itch.io logo.png', alt: 'Projects Icon', label: 'Skills', anchor: 'skills' },
  { href: '/settings', img: '/images/settings icon.svg', alt: 'Settings Icon', label: 'Settings', anchor: undefined },
  { href: 'back', img: '/images/wii u close icon.png', alt: 'Back Icon', label: 'Back', last: true, anchor: undefined },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [selectedLabel, setSelectedLabel] = useState('Home');
  const [lastPage, setLastPage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track last page for "Back" button
  useEffect(() => {
    if (!mounted) return;
    if (pathname !== '/') {
      setLastPage(document.referrer || '/');
    }
  }, [pathname, mounted]);

  // Homepage scroll/anchor logic
  useEffect(() => {
    if (!mounted) return;
    if (typeof window === 'undefined') return;
    if (pathname !== '/') {
      // Select tab by pathname for non-homepage
      const match = nonHomepageSidebarItems.find(item => item.href === pathname);
      if (match) {
        setSelectedLabel(match.label);
      } else {
        setSelectedLabel('Home');
      }
      return;
    }
    // Scroll logic for homepage/anchor links
    const handleScroll = () => {
      const scrollY = window.scrollY;
      let currentLabel = 'Home';
      for (const item of homepageSidebarItems) {
        if (!item.href.startsWith('#')) continue;
        const id = item.href.slice(1) || 'home';
        const section = document.getElementById(id);
        const offset = item.offset ?? -80;
        if (section) {
          const offsetTop = section.getBoundingClientRect().top + window.scrollY + offset + 50;
          if (scrollY >= offsetTop) {
            currentLabel = item.label;
          }
        }
      }
      setSelectedLabel(currentLabel);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initialize on load

    // Scroll to anchor if set in sessionStorage
    const anchor = sessionStorage.getItem('scrollToAnchor');
    if (anchor) {
      const el = document.getElementById(anchor);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      sessionStorage.removeItem('scrollToAnchor');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, mounted]);

  // Handle anchor click for homepage
  const handleClick = (e: React.MouseEvent, href: string, label: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.slice(1);
      const el = document.getElementById(targetId);
      if (el) {
        const item = homepageSidebarItems.find(i => i.label === label);
        const yOffset = item?.offset ?? -80; // fallback offset
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
    setSelectedLabel(label);
  };

  // Handle back button click
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (lastPage && lastPage !== window.location.href) {
      window.location.href = lastPage;
    } else {
      window.location.href = '/';
    }
  };

  // Choose sidebar items based on page
  const sidebarItems = pathname === '/' ? homepageSidebarItems : nonHomepageSidebarItems;

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 left-0 h-full flex flex-col items-center w-[10.5%] bg-transparent z-50">
      {sidebarItems.map((item, idx) => {
        const isSelected = item.label === selectedLabel;
        const base =
          'sidebar-item w-full py-4 px-0 bg-[#E4E4E4] text-center text-3xl transition-colors duration-300 text-[#3f3f3f] shadow-[5px_0px_5px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center flex-1 border-b-0 border-[#dedede] select-none no-underline cursor-default';
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
              unoptimized={item.img.startsWith('http')}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/eshop logo.png';
              }}
            />
            <span className="mt-1">{item.label}</span>
          </>
        );

        // Back button logic for non-homepage
        if (pathname !== '/' && item.label === 'Back') {
          return (
            <a
              key={item.label}
              href="#"
              draggable={false}
              className={className}
              onClick={handleBack}
            >
              {content}
            </a>
          );
        }

        // Settings button logic
        if (item.label === 'Settings') {
          return (
            <a
              key={item.label}
              href={item.href}
              draggable={false}
              className={className}
              onClick={() => setSelectedLabel(item.label)}
            >
              {content}
            </a>
          );
        }

        // Homepage anchor logic
        if (pathname === '/' && item.href.startsWith('#')) {
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
        }

        // All other buttons link to homepage and scroll to section when not on homepage
        if (pathname !== '/' && item.anchor) {
          return (
            <a
              key={item.label}
              href={item.href}
              draggable={false}
              className={className}
              onClick={(e) => {
                e.preventDefault();
                // Store anchor in sessionStorage so homepage knows where to scroll
                if (item.anchor) {
                  sessionStorage.setItem('scrollToAnchor', item.anchor);
                }
                window.location.href = item.href;
              }}
            >
              {content}
            </a>
          );
        }

        // All other buttons link to homepage when not on homepage
        return (
          <a
            key={item.label}
            href={item.href}
            draggable={false}
            className={className}
            onClick={() => setSelectedLabel(item.label)}
          >
            {content}
          </a>
        );
      })}
    </nav>
  );
}
