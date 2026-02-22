"use client";

import { portfolio } from "@/lib/portfolio";
import { useLanguage } from "@/context/LanguageContext";
import { usePhysics } from "@/lib/physics/usePhysics";
import { 
  SiPython, SiCplusplus, SiJavascript, SiTypescript, SiGo, SiRust, 
  SiNextdotjs, SiReact, SiTailwindcss, SiExpress, SiFastapi, SiGooglecloud, SiAmazonwebservices, 
  SiDocker, SiGithubactions, SiMongodb, SiPostgresql, SiRedis 
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { TbBrandCSharp } from "react-icons/tb";

const getIcon = (name: string) => {
  switch (name) {
    case "Python": return <SiPython className="w-4 h-4" />;
    case "Java": return <FaJava className="w-4 h-4" />;
    case "C++": return <SiCplusplus className="w-4 h-4" />;
    case "JavaScript": return <SiJavascript className="w-4 h-4" />;
    case "TypeScript": return <SiTypescript className="w-4 h-4" />;
    case "Go": return <SiGo className="w-4 h-4" />;
    case "Rust": return <SiRust className="w-4 h-4" />;
    case "C#": return <TbBrandCSharp className="w-4 h-4" />;
    case "Next.js": return <SiNextdotjs className="w-4 h-4" />;
    case "React": return <SiReact className="w-4 h-4" />;
    case "TailwindCSS": return <SiTailwindcss className="w-4 h-4" />;
    case "Express.js": return <SiExpress className="w-4 h-4" />;
    case "FastAPI": return <SiFastapi className="w-4 h-4" />;
    case "Google Cloud": return <SiGooglecloud className="w-4 h-4" />;
    case "AWS": return <SiAmazonwebservices className="w-4 h-4" />;
    case "Docker": return <SiDocker className="w-4 h-4" />;
    case "CI/CD/GitHub Actions": return <SiGithubactions className="w-4 h-4" />;
    case "MongoDB": return <SiMongodb className="w-4 h-4" />;
    case "PostgreSQL": return <SiPostgresql className="w-4 h-4" />;
    case "Redis": return <SiRedis className="w-4 h-4" />;
    default: return null;
  }
};

export default function Skills() {
  const { t } = useLanguage();
  const {
    containerRef,
    elementsRef,
    isLocked,
    handleLockToggle,
    handleReset
  } = usePhysics(portfolio.skills);

  return (
    <div className="w-full relative flex flex-col gap-4">
      <div className="flex justify-between items-center z-20">
        <span className="font-mono text-xs text-black font-bold border-2 border-black bg-white px-2 py-1 shadow-[2px_2px_0_#000]">
          {t("about.interactiveEngine")}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleLockToggle}
            className={`font-mono text-sm font-bold px-4 py-2 border-4 border-black transition-all hover:translate-x-0.5 hover:translate-y-0.5 ${
              isLocked 
                ? "bg-red-500 text-white shadow-[4px_4px_0_#000] hover:shadow-none" 
                : "bg-white text-black shadow-[4px_4px_0_#000] hover:shadow-none"
            }`}
          >
            {isLocked ? "RELEASE" : "LOCK"}
          </button>
          <button
            onClick={handleReset}
            className="bg-black text-white font-mono text-sm font-bold px-4 py-2 border-4 border-black transition-all shadow-[4px_4px_0_#FFF] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            RESET
          </button>
        </div>
      </div>
      
      <div 
        ref={containerRef} 
        className="relative w-full h-150 sm:h-125 md:h-125 border-4 border-black bg-zinc-200 overflow-hidden shadow-neo"
        style={{ cursor: "grab", touchAction: "none" }}
        onMouseDown={(e) => {
          (e.currentTarget as HTMLElement).style.cursor = "grabbing";
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLElement).style.cursor = "grab";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.cursor = "grab";
        }}
      >
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "20px 20px" }} 
        />
        
        {portfolio.skills.map((skill, index) => {
          return (
            <div
              key={index}
              ref={(el) => {
                elementsRef.current[index] = el;
              }}
              className={`absolute top-0 left-0 border-2 border-black px-4 py-2 font-bold font-mono text-sm uppercase flex items-center justify-center gap-2 pointer-events-none select-none transition-colors duration-200 ${
                isLocked ? "bg-zinc-400 text-zinc-600 shadow-none border-zinc-600" : "bg-white text-black shadow-[3px_3px_0px_#000]"
              }`}
              style={{ 
                height: "44px",
                willChange: "transform",
                width: "max-content", 
              }}
            >
              {getIcon(skill.name)}
              {skill.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
