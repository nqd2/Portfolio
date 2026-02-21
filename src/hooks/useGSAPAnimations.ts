"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useGSAPAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Fade-up elements
    const fadeUpElements = gsap.utils.toArray<HTMLElement>(".gsap-fade-up");
    fadeUpElements.forEach((el) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 50 },
        {
          opacity: 1, 
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Stagger parent containers
    const staggerContainers = gsap.utils.toArray<HTMLElement>(".gsap-stagger-container");
    staggerContainers.forEach((container) => {
      const children = gsap.utils.toArray<HTMLElement>(container.querySelectorAll(".gsap-stagger-item"));
      if (children.length === 0) return;
      
      gsap.fromTo(children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

  }, []);
}
