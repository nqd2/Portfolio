"use client";

import { useEffect, useRef } from "react";

class Cross {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  size: number;
  targetSize: number;

  constructor(x: number, y: number) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.size = 4;
    this.targetSize = 4;
  }

  update(mouseX: number, mouseY: number, mouseActive: boolean) {
    const dx = mouseX - this.baseX;
    const dy = mouseY - this.baseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 200;

    if (distance < maxDist && mouseActive) {
      const percent = (maxDist - distance) / maxDist;
      this.targetSize = 4 + percent * 6;
    } else {
      this.targetSize = 4;
    }
    this.size += (this.targetSize - this.size) * 0.15;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.baseX, this.baseY);
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export default function BackgroundGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const crossesRef = useRef<Cross[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const lastMouseMoveRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const spacing = 60;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      crossesRef.current = [];
      for (let y = 0; y < height + spacing; y += spacing) {
        for (let x = 0; x < width + spacing; x += spacing) {
          crossesRef.current.push(new Cross(x, y));
        }
      }
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);
      const { x: mx, y: my, active } = mouseRef.current;
      crossesRef.current.forEach((cross) => {
        cross.update(mx, my, active);
        cross.draw(ctx);
      });
    };

    const animate = () => {
      drawFrame();
      const now = Date.now();
      if (now - lastMouseMoveRef.current > 500 && !mouseRef.current.active) {
        const allStable = crossesRef.current.every(
          (c) => Math.abs(c.size - c.targetSize) <= 0.1
        );
        if (allStable) {
          animRef.current = null;
          return;
        }
      }
      animRef.current = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (animRef.current === null) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    init();

    const onResize = () => {
      init();
      drawFrame();
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      };
      lastMouseMoveRef.current = Date.now();
      startAnimation();
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, active: false };
    };

    const onVisibilityChange = () => {
      if (document.hidden && animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      } else {
        drawFrame();
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="neo-grid"
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 opacity-10 mix-blend-difference"
      style={{ left: 0, top: 0 }}
    />
  );
}
