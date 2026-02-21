"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Theme = "brutalism" | "neo-brutalism";

export interface ToastData {
  title: string;
  message: string;
  isError: boolean;
}

interface PortfolioContextValue {
  theme: Theme;
  toggleTheme: () => void;
  modalProjectId: number | null;
  openProjectModal: (id: number) => void;
  closeProjectModal: () => void;
  heroDescExpanded: boolean;
  toggleHeroDescription: () => void;
  toast: ToastData | null;
  showToast: (title: string, message: string, isError?: boolean) => void;
  hideToast: () => void;
  contactFormVisible: boolean;
  setContactFormVisible: (v: boolean) => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

const THEME_KEY = "nqdPortfolio-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "brutalism";
  return (localStorage.getItem(THEME_KEY) as Theme) || "brutalism";
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [modalProjectId, setModalProjectId] = useState<number | null>(null);
  const [heroDescExpanded, setHeroDescExpanded] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [contactFormVisible, setContactFormVisible] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.body.classList.remove("brutalism", "neo-brutalism");
    document.body.classList.add(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "brutalism" ? "neo-brutalism" : "brutalism";
      if (typeof document !== "undefined") {
        document.body.classList.remove("brutalism", "neo-brutalism");
        document.body.classList.add(next);
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch {}
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const openProjectModal = useCallback((id: number) => {
    setModalProjectId(id);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  }, []);

  const closeProjectModal = useCallback(() => {
    setModalProjectId(null);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }, []);

  const toggleHeroDescription = useCallback(() => {
    setHeroDescExpanded((e) => !e);
  }, []);

  const showToast = useCallback(
    (title: string, message: string, isError = true) => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      setToast({ title, message, isError });
      toastTimeoutRef.current = setTimeout(() => {
        setToast(null);
        toastTimeoutRef.current = null;
      }, 3000);
    },
    []
  );

  const hideToast = useCallback(() => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast(null);
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        theme,
        toggleTheme,
        modalProjectId,
        openProjectModal,
        closeProjectModal,
        heroDescExpanded,
        toggleHeroDescription,
        toast,
        showToast,
        hideToast,
        contactFormVisible,
        setContactFormVisible,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}
