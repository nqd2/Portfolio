"use client";

import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";

export default function ThemeSwitcher() {
  const { toggleTheme } = usePortfolio();
  const [isDark, setIsDark] = useState(false);

  const handleToggle = () => {
    setIsDark(!isDark);
    toggleTheme();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="relative flex items-center w-16 h-8 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-full p-1 transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] focus:outline-none focus:ring-2 focus:ring-cyan-400"
      aria-label="Toggle Theme"
    >
      <div 
        className={`w-5 h-5 bg-black rounded-full transition-transform duration-300 ease-in-out ${isDark ? "translate-x-8 bg-cyan-400" : "translate-x-0"}`}
      />
    </button>
  );
}
