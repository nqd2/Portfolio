"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioEffects() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const textEls = document.querySelectorAll(".scroll-float-text");
    textEls.forEach((el) => {
      const text = el.textContent?.trim();
      if (!text) return;
      el.textContent = "";
      const chars = text.split("").map((char) => {
        const span = document.createElement("span");
        span.style.display = "inline-block";
        span.textContent = char === " " ? "\u00A0" : char;
        el.appendChild(span);
        return span;
      });
      gsap.fromTo(
        chars,
        { opacity: 0, y: 50, scaleY: 1.5, transformOrigin: "50% 0%" },
        {
          duration: 0.5,
          ease: "back.out(1.2)",
          opacity: 1,
          y: 0,
          scaleY: 1,
          stagger: 0.02,
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            end: "bottom center",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    const blockEls = document.querySelectorAll(".scroll-float, .scroll-text");
    blockEls.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          duration: 0.5,
          ease: "power2.out",
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  useEffect(() => {
    const addGlareTo = (el: Element) => {
      if (el.querySelector(".glare-overlay")) return;
      const htmlEl = el as HTMLElement;
      if (getComputedStyle(htmlEl).position === "static") {
        htmlEl.style.position = "relative";
      }
      if (!htmlEl.classList.contains("overflow-hidden")) {
        htmlEl.classList.add("overflow-hidden");
      }
      const overlay = document.createElement("div");
      overlay.className = "glare-overlay";
      htmlEl.appendChild(overlay);
    };

    document.querySelectorAll(".glare-hover").forEach((el) => {
      addGlareTo(el);
      el.addEventListener("mouseenter", () => el.classList.add("glare-active"));
      el.addEventListener("mouseleave", () => el.classList.remove("glare-active"));
    });

    document.querySelectorAll(".glare-auto").forEach((el) => {
      addGlareTo(el);
      const transitionDuration = 650;
      const delay = 3000;
      const animate = () => {
        el.classList.add("glare-active");
        setTimeout(() => {
          el.classList.remove("glare-active");
          setTimeout(animate, delay);
        }, transitionDuration + 100);
      };
      setTimeout(animate, Math.random() * 1000 + 500);
    });
  }, []);

  return null;
}
