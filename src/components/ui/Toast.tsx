"use client";

import { usePortfolio } from "@/context/PortfolioContext";

export default function Toast() {
  const { toast, hideToast } = usePortfolio();

  if (!toast) return null;

  return (
    <div
      role="alert"
      className="fixed top-24 right-4 z-[100002] max-w-sm bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-4 transform transition-transform duration-300 translate-x-0"
    >
      <div className="flex items-start gap-3">
        <span
          className={
            toast.isError
              ? "text-red-500 font-bold text-2xl leading-none"
              : "text-green-500 font-bold text-2xl leading-none"
          }
        >
          {toast.isError ? "!" : "✓"}
        </span>
        <div className="flex-1 min-w-0">
          <h4
            className={
              toast.isError
                ? "text-red-500 font-black uppercase"
                : "text-green-500 font-black uppercase"
            }
          >
            {toast.title}
          </h4>
          <p className="text-black font-mono text-sm mt-1">{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={hideToast}
          className="text-black hover:bg-black hover:text-white p-1 border-2 border-black"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}
