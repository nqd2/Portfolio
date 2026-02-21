"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const TARGET_SELECTOR =
  'a, button, .cursor-target, .neo-card:not(.no-cursor-track), .scroll-float:not(.no-cursor-track)';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth <= 768;
    if (isMobile) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const corners = cursor.querySelectorAll<HTMLDivElement>(".target-cursor-corner");
    const dot = cursor.querySelector<HTMLDivElement>(".cursor-dot");
    const spinDuration = 2;
    const hoverDuration = 0.2;
    const borderWidth = 3;
    const cornerSize = 12;

    document.body.style.cursor = "none";
    gsap.set(cursor, { x: window.innerWidth / 2, y: window.innerHeight / 2 });

    const spinTl = gsap
      .timeline({ repeat: -1 })
      .to(cursor, { rotation: 360, duration: spinDuration, ease: "none" });

    let activeTarget: Element | null = null;
    const activeStrength = { value: 0 };

    window.addEventListener("mousemove", (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power3.out",
      });
    });

    const tickerFn = () => {
      if (!activeTarget) return;
      const strength = activeStrength.value;
      if (strength === 0) return;

      const rect = (activeTarget as HTMLElement).getBoundingClientRect();
      const currentTargetPos = [
        { x: rect.left - borderWidth, y: rect.top - borderWidth },
        {
          x: rect.right + borderWidth - cornerSize,
          y: rect.top - borderWidth,
        },
        {
          x: rect.right + borderWidth - cornerSize,
          y: rect.bottom + borderWidth - cornerSize,
        },
        {
          x: rect.left - borderWidth,
          y: rect.bottom + borderWidth - cornerSize,
        },
      ];

      const cursorX = gsap.getProperty(cursor, "x") as number;
      const cursorY = gsap.getProperty(cursor, "y") as number;

      corners.forEach((corner, i) => {
        const targetX = currentTargetPos[i].x - cursorX;
        const targetY = currentTargetPos[i].y - cursorY;
        const currentX = gsap.getProperty(corner, "x") as number;
        const currentY = gsap.getProperty(corner, "y") as number;
        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;
        const duration = strength >= 0.99 ? 0.2 : 0.05;

        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration,
          ease: "power1.out",
          overwrite: "auto",
        });
      });
    };

    const leaveHandler = () => {
      gsap.ticker.remove(tickerFn);
      activeTarget = null;
      gsap.to(activeStrength, { value: 0, duration: 0.1 });

      const positions = [
        { x: -18, y: -18 },
        { x: 6, y: -18 },
        { x: 6, y: 6 },
        { x: -18, y: 6 },
      ];
      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: positions[i].x,
          y: positions[i].y,
          duration: 0.3,
          ease: "power3.out",
        });
      });
      spinTl.restart();
    };

    const enterHandler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(TARGET_SELECTOR);
      if (!target || activeTarget === target) return;

      activeTarget = target;
      spinTl.pause();
      gsap.to(cursor, { rotation: 0, duration: 0.2 });
      gsap.ticker.add(tickerFn);
      gsap.to(activeStrength, { value: 1, duration: hoverDuration, ease: "power2.out" });

      const rect = (target as HTMLElement).getBoundingClientRect();
      const positions = [
        { x: rect.left - borderWidth, y: rect.top - borderWidth },
        {
          x: rect.right + borderWidth - cornerSize,
          y: rect.top - borderWidth,
        },
        {
          x: rect.right + borderWidth - cornerSize,
          y: rect.bottom + borderWidth - cornerSize,
        },
        {
          x: rect.left - borderWidth,
          y: rect.bottom + borderWidth - cornerSize,
        },
      ];
      const cursorX = gsap.getProperty(cursor, "x") as number;
      const cursorY = gsap.getProperty(cursor, "y") as number;
      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: positions[i].x - cursorX,
          y: positions[i].y - cursorY,
          duration: 0.2,
          ease: "power2.out",
        });
      });

      target.addEventListener("mouseleave", leaveHandler, { once: true });
    };

    window.addEventListener("mouseover", enterHandler);
    window.addEventListener("mousedown", () => {
      gsap.to(dot, { scale: 0.5, duration: 0.2 });
      gsap.to(cursor, { scale: 0.9, duration: 0.2 });
    });
    window.addEventListener("mouseup", () => {
      gsap.to(dot, { scale: 1, duration: 0.2 });
      gsap.to(cursor, { scale: 1, duration: 0.2 });
    });

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mouseover", enterHandler);
      gsap.ticker.remove(tickerFn);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      id="target-cursor"
      className="fixed top-0 left-0 w-0 h-0 pointer-events-none z-[100001] hidden md:block mix-blend-difference"
      aria-hidden
    >
      <div className="relative">
        <div className="cursor-dot absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div
          className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] border-white z-10"
          style={{
            transform: "translate(-150%, -150%)",
            borderRight: 0,
            borderBottom: 0,
          }}
        />
        <div
          className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] border-white z-10"
          style={{
            transform: "translate(50%, -150%)",
            borderLeft: 0,
            borderBottom: 0,
          }}
        />
        <div
          className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] border-white z-10"
          style={{
            transform: "translate(50%, 50%)",
            borderLeft: 0,
            borderTop: 0,
          }}
        />
        <div
          className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] border-white z-10"
          style={{
            transform: "translate(-150%, 50%)",
            borderRight: 0,
            borderTop: 0,
          }}
        />
      </div>
    </div>
  );
}
