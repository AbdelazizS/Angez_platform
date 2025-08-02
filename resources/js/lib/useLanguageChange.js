import { useCallback } from 'react';
import { useLanguage } from './language';
import { useTranslation } from 'react-i18next';

export function useLanguageChange() {
    const { changeLanguage, isChangingLanguage, currentLanguage } = useLanguage();
    const { t, i18n } = useTranslation();

    const switchLanguage = useCallback(async (languageCode) => {
        try {
            await changeLanguage(languageCode);
            
            // Trigger a custom event for other components to listen to
            window.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { 
                    language: languageCode,
                    direction: languageCode === 'ar' ? 'rtl' : 'ltr'
                }
            }));
            
            return true;
        } catch (error) {
            console.error('Failed to change language:', error);
            return false;
        }
    }, [changeLanguage]);

    const getCurrentLanguageInfo = useCallback(() => {
        const languages = [
            { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr' },
            { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl' }
        ];
        
        return languages.find(lang => lang.code === currentLanguage);
    }, [currentLanguage]);

    const isRTL = currentLanguage === 'ar';

    return {
        currentLanguage,
        isChangingLanguage,
        isRTL,
        switchLanguage,
        getCurrentLanguageInfo,
        t,
        i18n
    };
} 