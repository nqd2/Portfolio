"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { useLanguage } from "@/context/LanguageContext";
import { portfolio } from "@/lib/portfolio";

export default function Works() {
  const { openProjectModal } = usePortfolio();
  const { t } = useLanguage();
  const projects = portfolio.projects;

  return (
    <section
      id="works"
      data-theme="dark"
      className="relative w-full min-h-screen bg-black text-white py-24 border-t-4 border-white z-0"
    >
      <div className="text-center mb-20 relative w-full overflow-hidden z-20 gsap-fade-up">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #222 25%, transparent 25%, transparent 75%, #222 75%, #222), linear-gradient(45deg, #222 25%, transparent 25%, transparent 75%, #222 75%, #222)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 10px 10px",
          }}
        />
        <h2 className="text-[12rem] font-black text-white/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap scroll-float">
          {t("works.showcaseBg")}
        </h2>
        <h2 className="text-7xl md:text-9xl font-black text-white relative z-10 uppercase italic scroll-float-text">
          {t("works.showcase")}
        </h2>
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-[1440px] relative z-20 gsap-stagger-container">
        {projects.map((project) => (
          <div
            key={project.id}
            role="button"
            tabIndex={0}
            onClick={() => openProjectModal(project.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openProjectModal(project.id);
              }
            }}
            className="group cursor-pointer scroll-float gsap-stagger-item"
          >
            <div className="glare-hover relative bg-white border-4 border-white shadow-[10px_10px_0px_0px_#333] mb-6 transition-all group-hover:translate-x-2 group-hover:translate-y-2 group-hover:shadow-none">
              <div className="aspect-video bg-zinc-900 border-b-4 border-black relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <span className="text-3xl font-black text-white border-4 border-white px-6 py-2 transform -rotate-6">
                    {t("works.viewProject")}
                  </span>
                </div>
                <span className="absolute top-2 left-2 text-white/20 text-8xl font-black leading-none">
                  {String(project.id).padStart(2, "0")}
                </span>
              </div>
              <div className="p-6 bg-white text-black">
                <h3 className="text-2xl font-black uppercase mb-2">
                  {project.title}
                </h3>
                <div className="flex gap-2 font-mono text-xs font-bold">
                  <span className="bg-black text-white px-2 py-1">
                    {project.category}
                  </span>
                  <span className="border-2 border-black px-2 py-1">
                    {project.year}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
