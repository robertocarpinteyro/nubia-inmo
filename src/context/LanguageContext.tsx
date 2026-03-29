"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import es from "@/translations/es";
import en from "@/translations/en";

type Language = "es" | "en";
type TranslationDict = typeof es;

function getNestedValue(obj: any, path: string): string {
  const keys = path.split(".");
  let current = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return path;
    current = current[key];
  }
  return typeof current === "string" ? current : path;
}

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, TranslationDict> = { es, en };

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>("es");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nubia_lang") as Language | null;
      if (saved === "es" || saved === "en") setLang(saved);
    } catch {}
  }, []);

  const toggleLang = () => {
    setLang((prev) => {
      const next: Language = prev === "es" ? "en" : "es";
      try { localStorage.setItem("nubia_lang", next); } catch {}
      return next;
    });
  };

  const t = (key: string): string => getNestedValue(translations[lang], key);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
