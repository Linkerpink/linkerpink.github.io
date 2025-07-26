"use client";

import { ThemeProvider } from "./theme-context";
import Sidebar from "./sidebar";
import EasterEggUnlocker from "./easter-egg-unlocker";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <EasterEggUnlocker />
      <Sidebar />
      <main className="ml-[10.5%]">{children}</main>
    </ThemeProvider>
  );
}
