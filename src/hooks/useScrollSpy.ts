"use client";

import { useEffect, useState } from "react";

const ACTIVE_CLASSES = [
  "border-black",
  "bg-white",
  "shadow-[4px_4px_0px_0px_#000]",
  "scale-110",
];
const INACTIVE_CLASSES = ["border-transparent"];

export function useScrollSpy(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const setTopActive = (link: Element | null) => {
      navLinks.forEach((l) => {
        ACTIVE_CLASSES.forEach((c) => l.classList.remove(c));
        INACTIVE_CLASSES.forEach((c) => l.classList.add(c));
      });
      if (link) {
        INACTIVE_CLASSES.forEach((c) => link.classList.remove(c));
        ACTIVE_CLASSES.forEach((c) => link.classList.add(c));
      }
    };

    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const triggerLine = viewportHeight * 0.4;
      let current: string | null = null;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= triggerLine && rect.bottom >= triggerLine) {
          current = section.id;
        }
      }

      if (window.scrollY < 100) current = "hero";
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 50
      ) {
        const last = sections[sections.length - 1];
        if (last) current = last.id;
      }

      if (current) {
        setActiveId(current);
        const topLink = document.querySelector(
          `.nav-link[href="#${current}"]`
        );
        setTopActive(topLink);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!anchor) return;
      const id = anchor.getAttribute("href")?.slice(1);
      if (id) {
        setActiveId(id);
        const topLink = document.querySelector(`.nav-link[href="#${id}"]`);
        setTopActive(topLink);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClick);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
    };
  }, [sectionIds]);

  return activeId;
}
