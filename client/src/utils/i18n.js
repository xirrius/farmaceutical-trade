import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend) // Load translations from a file or API endpoint
  .use(LanguageDetector) // Detect user language (optional)
  .use(initReactI18next) // Bind i18n to React
  .init({
    lng: "en",
    fallbackLng: "en", // Default language
    supportedLngs: ["en", "hi"],
    debug: true, // Supported languages
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Path to translation files
    },
    interpolation: {
      escapeValue: false, // React handles escaping
    },
  });

export default i18n;
