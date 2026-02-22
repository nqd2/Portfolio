"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Update state based on scroll
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setScrollProgress((window.scrollY / scrollHeight) * 100);
      }
    };

    window.addEventListener("scroll", updateProgress);
    window.addEventListener("resize", updateProgress);
    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-2 mix-blend-difference pointer-events-none">
      <span className="font-mono text-xs font-black text-white writing-vertical uppercase tracking-widest mb-2">Scroll</span>
      <div className="w-0.5 h-32 bg-white/20 relative">
        <div 
          className="w-full bg-white absolute top-0 left-0 transition-all duration-100 ease-out"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>
      <span className="font-mono text-xs font-black text-white mt-2">
        {Math.round(scrollProgress)}%
      </span>
    </div>
  );
}
