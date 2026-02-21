"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { LangCode } from "@/data/types";

const OPTIONS: { code: LangCode; label: string }[] = [
  { code: "vi", label: "VI" },
  { code: "en", label: "EN" },
  { code: "jp", label: "JP" },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className="flex w-[120px] h-10 border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000] overflow-hidden"
      role="group"
      aria-label="Switch language"
    >
      {OPTIONS.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          className={`flex-1 min-w-0 flex items-center justify-center font-mono text-xs font-black uppercase transition-colors border-r-2 border-black last:border-r-0 ${
            lang === code
              ? "bg-black text-white"
              : "bg-white text-black hover:bg-zinc-100"
          }`}
          aria-pressed={lang === code}
          aria-label={label}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
