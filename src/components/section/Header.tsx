"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useDynamicHeader } from "@/hooks/useDynamicHeader";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

const SECTION_IDS = ["hero", "about", "works", "contact"] as const;

export default function Header() {
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const sectionIds = useMemo(() => [...SECTION_IDS], []);
  useScrollSpy(sectionIds);
  const compact = useDynamicHeader();

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 bg-white border-b-4 border-black transition-[padding] ${
          compact ? "py-2" : "py-4"
        }`}
      >
        <Link href="#hero" className="block focus:outline-none">
          <div className="bg-black px-4 py-1 transform -rotate-2 border-2 border-black inline-block group cursor-pointer transition-transform hover:-rotate-1">
            <span className="text-2xl font-black font-mono relative block text-white tracking-widest">
              <span className="absolute -left-[3px] top-0 text-cyan-400 mix-blend-screen opacity-90 group-hover:-left-[1px] transition-all">NQD&gt;&gt;</span>
              <span className="absolute left-[3px] top-0 text-orange-500 mix-blend-screen opacity-90 group-hover:left-[1px] transition-all">NQD&gt;&gt;</span>
              <span className="relative z-10">NQD&gt;&gt;</span>
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex gap-8">
          <Link
            href="#hero"
            className="text-black font-black uppercase hover:underline decoration-4 underline-offset-4 scroll-text nav-link border-2 border-transparent px-2 py-1"
          >
            {t("nav.home")}
          </Link>
          <Link
            href="#about"
            className="text-black font-black uppercase hover:underline decoration-4 underline-offset-4 scroll-text nav-link border-2 border-transparent px-2 py-1"
          >
            {t("nav.about")}
          </Link>
          <Link
            href="#works"
            className="text-black font-black uppercase hover:underline decoration-4 underline-offset-4 scroll-text nav-link border-2 border-transparent px-2 py-1"
          >
            {t("nav.works")}
          </Link>

          <Link
            href="#contact"
            className="text-black font-black uppercase hover:underline decoration-4 underline-offset-4 scroll-text nav-link border-2 border-transparent px-2 py-1"
          >
            {t("nav.contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 border-2 border-black"
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            <span
              className="block w-6 h-0.5 bg-black transition-transform"
              style={
                mobileOpen
                  ? { transform: "translateY(4px) rotate(45deg)" }
                  : undefined
              }
            />
            <span
              className="block w-6 h-0.5 bg-black transition-opacity"
              style={{ opacity: mobileOpen ? 0 : 1 }}
            />
            <span
              className="block w-6 h-0.5 bg-black transition-transform"
              style={
                mobileOpen
                  ? { transform: "translateY(-4px) rotate(-45deg)" }
                  : undefined
              }
            />
          </button>

          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          <div className="hidden md:block">
            <ThemeSwitcher />
          </div>

          <Link
            href="#contact"
            onClick={closeMobile}
            className="glare-auto bg-black text-white px-6 py-2 font-black border-2 border-black uppercase shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all hover:bg-white hover:text-black scroll-float"
          >
            {t("nav.contact")}
          </Link>
        </div>
      </header>

        <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-white md:hidden transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ paddingTop: "5rem" }}
        aria-hidden={!mobileOpen}
      >
        <div className="flex justify-center pt-4">
          <LanguageSwitcher />
        </div>
        <nav className="flex flex-col items-center gap-6 pt-8">
          <Link
            href="#hero"
            onClick={closeMobile}
            className="text-2xl font-black uppercase text-black"
          >
            {t("nav.home")}
          </Link>
          <Link
            href="#about"
            onClick={closeMobile}
            className="text-2xl font-black uppercase text-black"
          >
            {t("nav.about")}
          </Link>
          <Link
            href="#works"
            onClick={closeMobile}
            className="text-2xl font-black uppercase text-black"
          >
            {t("nav.works")}
          </Link>
          <Link
            href="#contact"
            onClick={closeMobile}
            className="text-2xl font-black uppercase text-black"
          >
            {t("nav.contact")}
          </Link>
        </nav>
      </div>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={closeMobile}
          aria-label="Close menu"
        />
      )}
    </>
  );
}
