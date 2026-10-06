import { useLocalized } from "@/features/learn/hooks/useLocalized";
import { findStudyLanguage } from "@/features/learn/languages";

/** Name of a study language in the UI language; a language the web app has no card for falls back to its native name. */
export function useLanguageLabel() {
  const loc = useLocalized();
  return (code: string, nativeName?: string) => {
    const language = findStudyLanguage(code);
    return language ? loc(language.name) : (nativeName ?? code);
  };
}
