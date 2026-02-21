"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { getProjectById, type ProjectMediaItem } from "@/lib/portfolio";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

function getYouTubeId(url: string): string {
  if (url.includes("v=")) return url.split("v=")[1].split("&")[0];
  if (url.includes("youtu.be/")) return url.split("youtu.be/")[1];
  return "";
}

export default function ProjectModal() {
  const { modalProjectId, closeProjectModal } = usePortfolio();
  const { t } = useLanguage();
  const galleryRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const data = modalProjectId ? getProjectById(modalProjectId) : null;
  const rawMedia = data?.media ?? data?.images ?? [];
  const items: ProjectMediaItem[] = Array.isArray(rawMedia) ? rawMedia : [];
  const totalSlides = items.length;

  const updateProgress = useCallback(() => {
    const gallery = galleryRef.current;
    if (!gallery || items.length === 0) return;
    const width = gallery.offsetWidth;
    const index = Math.round(gallery.scrollLeft / width);
    setCurrentIndex(index);
  }, [items.length]);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    gallery.addEventListener("scroll", updateProgress);
    updateProgress();
    return () => gallery.removeEventListener("scroll", updateProgress);
  }, [modalProjectId, updateProgress]);

  const scrollModal = useCallback(
    (direction: number) => {
      const gallery = galleryRef.current;
      if (!gallery) return;
      const width = gallery.offsetWidth;
      gallery.scrollBy({ left: direction * width, behavior: "smooth" });
    },
    []
  );

  if (!modalProjectId || !data) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      aria-modal
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-sm"
        onClick={closeProjectModal}
        onKeyDown={(e) => e.key === "Escape" && closeProjectModal()}
      />
      <div className="relative w-full max-w-7xl h-[85vh] bg-white border-4 border-black shadow-[8px_8px_0px_0px_#333] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b-4 border-black bg-white z-10 shrink-0">
          <div>
            <h3
              id="modal-title"
              className="text-2xl md:text-4xl font-black uppercase tracking-tighter mix-blend-multiply text-black"
            >
              {data.title}
            </h3>
            <div className="flex gap-3 mt-2 font-mono text-xs font-bold text-black">
              <span className="bg-black text-white px-2 py-1">
                {data.category}
              </span>
              <span className="border-2 border-black px-2 py-1">
                {data.year}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={closeProjectModal}
            className="w-12 h-12 flex items-center justify-center border-4 border-black bg-black text-white hover:bg-red-600 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="square"
                strokeLinejoin="miter"
                strokeWidth={4}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div
          ref={galleryRef}
          className="flex-1 flex overflow-x-auto snap-x snap-mandatory overflow-y-hidden scrollbar-hide bg-zinc-100 items-center"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="w-full h-full p-4 md:p-12 flex-shrink-0 snap-center flex flex-col items-center justify-center select-none gap-4 min-w-full"
            >
              {typeof item === "string" ? (
                <div className="relative w-full max-w-5xl aspect-video bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)]">
                  <Image
                    src={item}
                    alt=""
                    fill
                    className="object-contain pointer-events-none"
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                </div>
              ) : item.type === "youtube" ? (
                <>
                  {item.caption && (
                    <h3 className="text-xl md:text-2xl font-black text-black bg-white px-4 py-1 border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                      {item.caption}
                    </h3>
                  )}
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(item.src)}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full max-w-4xl aspect-video border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] bg-black"
                  />
                </>
              ) : item.type === "video" ? (
                <>
                  {item.caption && (
                    <h3 className="text-xl md:text-2xl font-black text-black bg-white px-4 py-1 border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                      {item.caption}
                    </h3>
                  )}
                  <video
                    src={item.src}
                    controls
                    className="w-full max-w-4xl aspect-video border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] bg-black"
                  />
                </>
              ) : null}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollModal(-1)}
          disabled={currentIndex === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-[-45%] hover:shadow-none transition-all disabled:opacity-0 disabled:pointer-events-none group"
          aria-label="Previous slide"
        >
          <svg
            className="w-6 h-6 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="square"
              strokeLinejoin="miter"
              strokeWidth={4}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scrollModal(1)}
          disabled={currentIndex === totalSlides - 1 || totalSlides === 0}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-[-45%] hover:shadow-none transition-all disabled:opacity-0 disabled:pointer-events-none group"
          aria-label="Next slide"
        >
          <svg
            className="w-6 h-6 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="square"
              strokeLinejoin="miter"
              strokeWidth={4}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div className="absolute bottom-6 left-0 w-full flex justify-center gap-4 pointer-events-none">
          <div className="bg-black/80 text-white px-4 py-2 font-mono text-xs font-bold pointer-events-auto backdrop-blur-md rounded-full border border-white/20 flex items-center gap-4">
            <span>{t("modal.swipeToView")}</span>
            <span className="w-px h-3 bg-white/50" />
            <span id="modal-counter">
              {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(totalSlides).padStart(2, "0")}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-200">
            <div
              className="h-full bg-black w-0 transition-all duration-300 ease-out"
              style={{
                width: totalSlides
                  ? `${((currentIndex + 1) / totalSlides) * 100}%`
                  : 0,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
