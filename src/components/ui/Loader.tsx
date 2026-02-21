"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATUSES = [
  "INITIALIZING SYSTEM...",
  "LOADING ASSETS...",
  "COMPILING SHADERS...",
  "BUILDING LAYOUT...",
  "READY_TO_LAUNCH",
];

export default function Loader({ onComplete }: { onComplete?: () => void }) {
  const [visible, setVisible] = useState(true);
  const [status, setStatus] = useState(STATUSES[0]);
  const loaderRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const spinAnimRef = useRef<gsap.core.Tween | null>(null);
  const statusIdxRef = useRef(0);
  const statusIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!visible) return;

    document.body.style.overflow = "hidden";

    spinAnimRef.current = gsap.to(svgRef.current, {
      rotation: 360,
      duration: 3,
      repeat: -1,
      ease: "linear",
    });

    statusIntervalRef.current = setInterval(() => {
      statusIdxRef.current = (statusIdxRef.current + 1) % STATUSES.length;
      setStatus(STATUSES[statusIdxRef.current]);
    }, 800);

    const onLoad = () => {
      if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);
      setStatus("SYSTEM_READY");

      setTimeout(() => {
        if (!loaderRef.current || !svgRef.current) return;
        spinAnimRef.current?.kill();

        const tl = gsap.timeline({
          onComplete: () => {
            setVisible(false);
            document.body.style.overflow = "";
            document.body.style.pointerEvents = "auto";
            ScrollTrigger.refresh();
            onComplete?.();
          },
        });

        tl.to(statusRef.current, { opacity: 0, duration: 0.3 })
          .to(
            svgRef.current,
            {
              scale: 0,
              opacity: 0,
              rotation: 720,
              duration: 0.8,
              ease: "power4.inOut",
            },
            "<"
          )
          .to(
            loaderRef.current,
            {
              opacity: 0,
              duration: 0.8,
              ease: "power2.inOut",
            },
            "<"
          );
      }, 800);
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[100000] bg-black flex flex-col items-center justify-center"
    >
      <svg
        ref={svgRef}
        className="w-24 h-24 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
      </svg>
      <p
        ref={statusRef}
        className="absolute bottom-8 font-mono text-xs text-white/80"
      >
        {status}
      </p>
    </div>
  );
}
