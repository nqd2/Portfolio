"use client";

import Link from "next/link";
import { usePortfolio } from "@/context/PortfolioContext";
import { useLanguage } from "@/context/LanguageContext";
import { portfolio } from "@/lib/portfolio";

export default function Hero() {
  const { heroDescExpanded, toggleHeroDescription } = usePortfolio();
  const { t } = useLanguage();
  const name = portfolio.profile.name;
  const desc = t("hero.description");
  const highlight = t("hero.descriptionHighlight");
  const descParts = desc.split(highlight);

  return (
    <section
      id="hero"
      data-theme="dark"
      className="relative w-screen max-w-full min-h-screen flex flex-col justify-center items-center border-b-4 border-white bg-black overflow-x-hidden overflow-y-auto z-0 py-16 md:py-24"
      style={{ backgroundSize: "20px 20px" }}
    >
      <div className="container mx-auto px-4 z-20 flex flex-col items-center justify-center text-center gap-4 relative w-full max-w-full pt-14 pb-8 md:pt-20 md:pb-12 gsap-stagger-container">
        <div className="bg-white border-4 border-black px-4 py-1 sm:px-6 transform -rotate-2 shadow-[4px_4px_0px_0px_#FFF] scroll-float max-w-[95vw] gsap-stagger-item">
          <h2 className="text-[clamp(0.875rem,2.5vw,1.5rem)] font-black text-black uppercase">
            {t("hero.hiIm")} <span className="italic">{name}</span>
          </h2>
        </div>

        <div className="flex flex-col items-center leading-tight relative group w-full max-w-6xl px-2 sm:px-4">
          <h1 className="text-[clamp(1.5rem,5vw,4.5rem)] sm:text-[clamp(2rem,6vw,5.5rem)] lg:text-[clamp(3rem,7vw,7rem)] font-black tracking-tighter text-white hover:skew-x-3 transition-transform scroll-float-text whitespace-normal md:whitespace-nowrap gsap-stagger-item">
            {t("hero.role1")}
          </h1>
          <div className="flex items-center gap-2 sm:gap-4 my-2 scroll-float shrink-0 gsap-stagger-item">
            <span className="h-1 w-6 sm:w-8 md:w-20 bg-white block shrink-0" />
            <span className="text-[clamp(0.875rem,2.5vw,1.875rem)] font-mono text-white/50 italic whitespace-nowrap">
              {t("hero.and")}
            </span>
            <span className="h-1 w-6 sm:w-8 md:w-20 bg-white block shrink-0" />
          </div>
          <h1 className="text-[clamp(1.5rem,5vw,4.5rem)] sm:text-[clamp(2rem,6vw,5.5rem)] lg:text-[clamp(3rem,7vw,7rem)] font-black tracking-widest text-transparent text-stroke hover:text-white transition-colors duration-300 scroll-float-text whitespace-normal md:whitespace-nowrap gsap-stagger-item">
            {t("hero.role2")}
          </h1>
        </div>

        <div className="relative max-w-xl mt-4 sm:mt-6 scroll-float w-full px-2 gsap-stagger-item">
          <div className="absolute -top-8 right-0 z-10">
            <button
              type="button"
              onClick={toggleHeroDescription}
              className="bg-black border-2 border-white text-white text-[clamp(0.5rem,1.5vw,0.625rem)] font-mono px-2 sm:px-3 py-1 hover:bg-white hover:text-black transition-colors uppercase flex items-center gap-2"
            >
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  heroDescExpanded ? "bg-red-500" : "bg-green-500"
                }`}
              />
              <span>{heroDescExpanded ? t("hero.minimize") : t("hero.expand")}</span>
            </button>
          </div>
          <div
            id="hero-desc-content"
            className="text-gray-300 text-[clamp(0.875rem,2vw,1.125rem)] font-mono border-l-4 border-white pl-4 text-left bg-black/50 overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              maxHeight: heroDescExpanded ? "200px" : "0px",
              opacity: heroDescExpanded ? 1 : 0,
              paddingTop: heroDescExpanded ? "0.5rem" : 0,
              paddingBottom: heroDescExpanded ? "0.5rem" : 0,
              marginTop: heroDescExpanded ? "1.5rem" : 0,
            }}
          >
            {descParts[0]}
            <span className="text-white font-bold">{highlight}</span>
            {descParts[1] ?? ""}
          </div>
        </div>

        <div className="mt-6 sm:mt-8 scroll-float mb-24 sm:mb-32 gsap-fade-up">
          <Link href="#contact" className="inline-block max-w-[95vw]">
            <button
              type="button"
              className="glare-auto glare-black bg-white text-black px-6 py-3 sm:px-10 sm:py-4 text-[clamp(1rem,4vw,1.5rem)] font-black uppercase border-4 border-black shadow-[8px_8px_0px_0px_#FFF] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all hover:bg-black hover:text-white hover:border-white"
            >
              {t("hero.hireNow")}
            </button>
          </Link>
        </div>

        <Link
          href="#about"
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-30 group cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="font-mono text-[clamp(0.5rem,1.5vw,0.625rem)] font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase bg-white text-black px-2 sm:px-3 py-1 border-2 border-white group-hover:bg-black group-hover:text-white transition-colors">
            {t("hero.scroll")}
          </span>
          <svg
            className="w-8 h-8 animate-bounce"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4V20M12 20L19 13M12 20L5 13"
              stroke="white"
              strokeWidth={4}
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
