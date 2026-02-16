import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import ru from "./translations/ru.json";
import kz from "./translations/kz.json";
import uz from "./translations/uz.json";

// Get language from localStorage or default to 'ru'
const savedLanguage = localStorage.getItem('appLanguage') || 'ru';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      uz: { translation: uz },
      kz: { translation: kz }
    },
    lng: savedLanguage,
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;