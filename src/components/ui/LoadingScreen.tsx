"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function LoadingScreen() {
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent body scroll during loading
    document.body.style.overflow = "hidden";
    
    const tl = gsap.timeline({
      onComplete: () => {
        setIsComplete(true);
        document.body.style.overflow = "";
      }
    });

    tl.to(".loading-text", {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power3.out"
    })
    .to(".loading-text", {
      opacity: 0,
      y: -20,
      duration: 0.5,
      stagger: 0.1,
      ease: "power3.in",
      delay: 0.5
    })
    .to(containerRef.current, {
      y: "-100%",
      duration: 0.8,
      ease: "expo.inOut"
    });

    return () => {
      document.body.style.overflow = "";
      tl.kill();
    };
  }, []);

  if (isComplete) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black text-white flex items-center justify-center pointer-events-none"
    >
      <div className="flex flex-col items-center gap-2 font-mono font-black text-4xl uppercase tracking-widest">
        <div className="overflow-hidden">
          <span className="loading-text inline-block opacity-0 translate-y-10">Loading Shaders and Physics</span>
        </div>
        <div className="overflow-hidden">
          <span className="loading-text inline-block opacity-0 translate-y-10 text-cyan-400">Just a moment...</span>
        </div>
      </div>
    </div>
  );
}
