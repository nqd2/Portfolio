"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { LangCode } from "@/data/types";

import en from "@/data/lang/en.json";
import vi from "@/data/lang/vi.json";
import jp from "@/data/lang/jp.json";

type Translations = typeof en;

const LANGS: Record<LangCode, Translations> = { en, vi, jp };
const LANG_KEY = "nqdPortfolio-lang";

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

interface LanguageContextValue {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY) as LangCode | null;
    if (saved && (saved === "vi" || saved === "en" || saved === "jp")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore lang from localStorage after mount
      setLangState(saved);
    }
  }, []);

  const setLang = useCallback((code: LangCode) => {
    setLangState(code);
    try {
      localStorage.setItem(LANG_KEY, code);
    } catch {}
  }, []);

  const t = useCallback(
    (key: string): string => {
      const translations = LANGS[lang] as Record<string, unknown>;
      return getNested(translations, key) ?? key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
