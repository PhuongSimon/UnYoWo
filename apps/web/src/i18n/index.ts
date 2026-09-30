import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { LANGUAGE_CODES } from './languages'
import en from './locales/en.json'
import vi from './locales/vi.json'

const STORAGE_KEY = 'lang'

function getSavedLanguage(): string {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved && LANGUAGE_CODES.includes(saved) ? saved : 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  lng: getSavedLanguage(),
  fallbackLng: 'en',
  supportedLngs: LANGUAGE_CODES,
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng)
  document.documentElement.lang = lng
})

document.documentElement.lang = i18n.language

export default i18n
