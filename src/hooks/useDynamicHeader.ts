"use client";

import { useEffect, useRef, useState } from "react";

export function useDynamicHeader() {
  const [compact, setCompact] = useState(false);
  const hoverRef = useRef(false);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const updateCompact = () => {
      if (hoverRef.current) {
        setCompact(false);
        return;
      }
      setCompact(window.scrollY > 50);
    };

    const onScroll = () => updateCompact();
    const onMouseEnter = () => {
      hoverRef.current = true;
      setCompact(false);
    };
    const onMouseLeave = () => {
      hoverRef.current = false;
      updateCompact();
    };

    header.addEventListener("mouseenter", onMouseEnter);
    header.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll);
    updateCompact();

    return () => {
      header.removeEventListener("mouseenter", onMouseEnter);
      header.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return compact;
}
