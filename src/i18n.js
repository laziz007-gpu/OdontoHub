import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./translations/en.json"
import ru from "./translations/ru.json"
import kz from "./translations/kz.json"
import uz from "./translations/uz.json"

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      uz: { translation: uz},
      kz: {translation: kz}
    },
    lng: 'ru',
    fallbacklng: 'en',
    fallbacklng: 'uz',
    fallbacklng: 'kz'
  })