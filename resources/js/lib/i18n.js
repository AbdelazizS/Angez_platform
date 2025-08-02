import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

const resources = {
    en: {
        translation: enTranslations
    },
    ar: {
        translation: arTranslations
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: false,
        
        // Language detection options
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
            lookupSessionStorage: 'i18nextLng',
            lookupFromPathIndex: 0,
            lookupFromSubdomainIndex: 0,
            
            // Check for language in localStorage
            checkWhitelist: true,
            
            // Convert language codes
            convertDetectedLanguage: (lng) => {
                // Handle Arabic language variants
                if (lng.startsWith('ar')) return 'ar';
                // Handle English language variants
                if (lng.startsWith('en')) return 'en';
                return lng;
            }
        },
        
        interpolation: {
            escapeValue: false, // React already does escaping
        },
        
        // React i18next options
        react: {
            useSuspense: false, // Important for SSR
        },
        
        // Supported languages
        supportedLngs: ['en', 'ar'],
        
        // Load language on init
        load: 'languageOnly',
        
        // Namespace
        ns: ['translation'],
        defaultNS: 'translation',
        
        // Key separator
        keySeparator: '.',
        
        // Plural separator
        pluralSeparator: '_',
        
        // Context separator
        contextSeparator: '_',
        
        // Missing key handler
        saveMissing: false,
        missingKeyHandler: (lng, ns, key, fallbackValue) => {
            console.warn(`Missing translation key: ${key} for language: ${lng}`);
        }
    });

export default i18n; 