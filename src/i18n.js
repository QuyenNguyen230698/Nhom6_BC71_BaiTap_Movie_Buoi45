import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEn from './locales/EN/translation.json';
import translationVn from './locales/VN/translation.json';

const resources = {
  en: {
    translation: translationEn,
  },
  vn: {
    translation: translationVn,
  },
};

// Cấu hình i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
