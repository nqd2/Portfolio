"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { portfolio } from "@/lib/portfolio";
import Skills from "@/components/ui/Skills";

export default function About() {
  const { t } = useLanguage();
  const { profile } = portfolio;
  const aboutLabel = t("about.aboutMe");
  const fullName = t("profile.fullName") || profile.fullName;
  const education = t("profile.education") || profile.education;
  const location = t("profile.location") || profile.location;
  const languages = t("profile.languages") || profile.languages;


  return (
    <section
      id="about"
      data-theme="light"
      className="relative w-screen max-w-full overflow-x-hidden py-24 bg-white border-b-4 border-black text-black z-0"
    >
      <div className="scroll-float no-cursor-track w-full bg-black text-white py-6 border-y-4 border-black overflow-hidden mb-20 rotate-1 shadow-neo relative z-20">
        <div className="whitespace-nowrap animate-marquee flex gap-12 w-max">
          <span className="text-7xl font-black italic">{aboutLabel}</span>
          <span className="text-7xl font-black text-transparent text-stroke">
            {aboutLabel}
          </span>
          <span className="text-7xl font-black italic">{aboutLabel}</span>
          <span className="text-7xl font-black text-transparent text-stroke">
            {aboutLabel}
          </span>
          <span className="text-7xl font-black italic">{aboutLabel}</span>
          <span className="text-7xl font-black text-transparent text-stroke">
            {aboutLabel}
          </span>
          <span className="text-7xl font-black italic">{aboutLabel}</span>
          <span className="text-7xl font-black text-transparent text-stroke">
            {aboutLabel}
          </span>
          <span className="text-7xl font-black italic">{aboutLabel}</span>
          <span className="text-7xl font-black text-transparent text-stroke">
            {aboutLabel}
          </span>
          <span className="text-7xl font-black italic">{aboutLabel}</span>
          <span className="text-7xl font-black text-transparent text-stroke">
            {aboutLabel}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 xl:px-16 max-w-400 relative z-20 gsap-stagger-container">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 md:gap-8 items-stretch">
          <div className="scroll-float glare-hover md:col-span-1 xl:col-span-3 neo-card shadow-neo! p-0 overflow-hidden group bg-white w-full max-w-full flex flex-col min-h-0 gsap-stagger-item">
            <div className="bg-black text-white px-2 py-1 font-mono text-xs font-bold border-b-[3px] border-black text-center shrink-0">
              {profile.profileImageLabel}
            </div>
            <div className="flex-1 min-h-0 flex items-center justify-center p-0">
              <div className="w-full max-h-full aspect-square relative bg-zinc-100 min-w-0">
                <Image
                  src={profile.profileImage}
                  alt={profile.name}
                  fill
                  className="object-cover object-center contrast-125 
                  group-hover:contrast-100 transition-all duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  unoptimized
                />
              </div>
            </div>
          </div>

          <div className="scroll-float glare-hover md:col-span-1 xl:col-span-9 bg-black border-4 border-black shadow-neo p-4 sm:p-6 lg:p-8 text-white flex flex-col justify-center transform hover:-translate-y-1 transition-transform w-full min-h-0 gsap-stagger-item">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mb-4 sm:mb-6 uppercase border-b-4 border-white w-full text-left">
              {t("about.information")}
            </h3>
            <div className="space-y-3 sm:space-y-4 font-mono w-full text-base sm:text-lg md:text-xl lg:text-2xl">
              <p className="flex justify-between items-baseline gap-2 sm:gap-4 border-b border-white/20 pb-1 scroll-float min-w-0">
                <span className="font-bold shrink-0 text-left">{t("about.name")}:</span>
                <span className="text-right min-w-0 wrap-break-word">{fullName}</span>
              </p>
              <p className="flex justify-between items-baseline gap-2 sm:gap-4 border-b border-white/20 pb-1 scroll-float min-w-0">
                <span className="font-bold shrink-0 text-left">{t("about.edu")}:</span>
                <span className="text-right min-w-0 wrap-break-word">{education}</span>
              </p>
              <p className="flex justify-between items-baseline gap-2 sm:gap-4 border-b border-white/20 pb-1 scroll-float min-w-0">
                <span className="font-bold shrink-0 text-left">{t("about.loc")}:</span>
                <span className="text-right min-w-0 wrap-break-word">{location}</span>
              </p>
              <p className="flex justify-between items-baseline gap-2 sm:gap-4 border-b border-white/20 pb-1 scroll-float min-w-0">
                <span className="font-bold shrink-0 text-left">{t("about.lang")}:</span>
                <span className="text-right min-w-0 wrap-break-word">{languages}</span>
              </p>
            </div>
          </div>

          <div className="scroll-float glare-hover md:col-span-2 xl:col-span-5 neo-card shadow-neo! p-6 lg:p-8 flex flex-col justify-center gap-6 min-h-75 gsap-stagger-item">
            <h3 className="text-3xl lg:text-4xl font-black uppercase bg-black text-white inline-block px-2 transform -rotate-1 w-fit">
              {t("about.whatIDo")}
            </h3>
            <p className="text-base lg:text-lg font-bold leading-relaxed text-black">
              {(() => {
                const text = t("about.whatIDoText");
                const h1 = t("about.whatIDoHighlight1");
                const h2 = t("about.whatIDoHighlight2");
                const [before1, rest1] = text.split(h1);
                const [mid, after2] = (rest1 ?? "").split(h2);
                return (
                  <>
                    {before1}
                    <span className="bg-black text-white px-1">{h1}</span>
                    {mid}
                    <span className="underline decoration-4">{h2}</span>
                    {after2}
                  </>
                );
              })()}
            </p>
          </div>

          <div className="scroll-float glare-hover md:col-span-1 xl:col-span-4 bg-white border-4 border-black shadow-neo p-6 lg:p-8 flex flex-col justify-center items-center text-center hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer min-h-75 gsap-stagger-item">
            <div className="font-mono text-sm font-bold bg-black text-white px-2 mb-2">
              {t("about.operatingSystem")}
            </div>
            <div className="text-3xl lg:text-4xl font-black uppercase text-black scroll-float-text">
              {t("about.osName")}
            </div>
            <div className="mt-4 text-2xl lg:text-3xl font-black bg-black text-white px-4 py-2 rotate-2 border-2 border-black scroll-float-text">
              {t("about.osVer")}
            </div>
          </div>

          <div className="scroll-float glare-hover md:col-span-1 xl:col-span-3 bg-white border-4 border-black shadow-neo p-6 lg:p-8 flex items-center justify-center text-center relative overflow-hidden min-h-75 gsap-stagger-item">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "radial-gradient(#000 1px, transparent 1px)",
                backgroundSize: "10px 10px",
              }}
            />
            <div className="z-10">
              <p className="text-lg lg:text-xl font-bold font-mono text-gray-600">
                {t("about.status")}:
              </p>
              <p className="text-2xl lg:text-3xl font-black uppercase text-black underline decoration-4 decoration-black mt-2">
                {t("about.statusText")}
              </p>
            </div>
          </div>

          <div className="scroll-float glare-hover md:col-span-2 xl:col-span-12 neo-card shadow-neo! p-6 lg:p-8 bg-zinc-100 min-h-75 gsap-stagger-item">
            <h3 className="text-2xl lg:text-3xl font-black mb-6 uppercase flex items-center gap-2 text-black">
              <span className="w-4 h-4 bg-black" /> {t("about.skills")}
            </h3>
            <Skills />
          </div>
        </div>
      </div>
    </section>
  );
}
