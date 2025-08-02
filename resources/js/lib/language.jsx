import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const { i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [isChangingLanguage, setIsChangingLanguage] = useState(false);
    const [isRTL, setIsRTL] = useState(false);

    useEffect(() => {
        
        // Initialize language on mount
        const savedLanguage = localStorage.getItem('i18nextLng') || 'en';
        const initialLanguage = savedLanguage.startsWith('ar') ? 'ar' : 'en';
       
        
        setCurrentLanguage(initialLanguage);
        setIsRTL(initialLanguage === 'ar');
        
        // Set initial document attributes
        updateDocumentAttributes(initialLanguage);
    }, []);

    const updateDocumentAttributes = (language) => {
        const isRTL = language === 'ar';
        
        // Update document direction and language
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
        document.documentElement.setAttribute('data-lang', language);
        
        // Add/remove RTL class for CSS targeting
        if (isRTL) {
            document.documentElement.classList.add('rtl');
            document.documentElement.classList.remove('ltr');
        } else {
            document.documentElement.classList.add('ltr');
            document.documentElement.classList.remove('rtl');
        }
        
        // Update body class for additional styling
        document.body.className = document.body.className
            .replace(/lang-\w+/g, '')
            .replace(/direction-\w+/g, '');
        document.body.classList.add(`lang-${language}`, `direction-${isRTL ? 'rtl' : 'ltr'}`);
    };

    const changeLanguage = async (language) => {
        if (language === currentLanguage || isChangingLanguage) return;
        
        setIsChangingLanguage(true);
        
        try {
            // Show loading overlay
            showLanguageChangeOverlay();
            
            // Wait a bit for smooth transition
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Change i18n language
            await i18n.changeLanguage(language);
            
            // Update state
            setCurrentLanguage(language);
            setIsRTL(language === 'ar');
            
            // Update document attributes
            updateDocumentAttributes(language);
            
            // Save to localStorage
            localStorage.setItem('i18nextLng', language);
            
            // Wait a bit more for content to update
            await new Promise(resolve => setTimeout(resolve, 200));
            
        } catch (error) {
            console.error('Error changing language:', error);
        } finally {
            // Hide loading overlay
            hideLanguageChangeOverlay();
            setIsChangingLanguage(false);
        }
    };

    const showLanguageChangeOverlay = () => {
        // Create or update overlay
        let overlay = document.getElementById('language-change-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'language-change-overlay';
            overlay.className = 'fixed inset-0 z-[9999] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center';
            overlay.innerHTML = `
                <div class="flex flex-col items-center space-y-4">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p class="text-gray-600 dark:text-gray-300 text-lg font-medium">Changing language...</p>
                </div>
            `;
            document.body.appendChild(overlay);
        }
        overlay.style.display = 'flex';
    };

    const hideLanguageChangeOverlay = () => {
        const overlay = document.getElementById('language-change-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    };

    const languages = [
        { 
            code: 'en', 
            name: 'English', 
            nativeName: 'English',
            flag: '🇺🇸',
            direction: 'ltr'
        },
        { 
            code: 'ar', 
            name: 'Arabic', 
            nativeName: 'العربية',
            flag: '🇸🇦',
            direction: 'rtl'
        }
    ];

    return (
        <LanguageContext.Provider value={{ 
            currentLanguage, 
            changeLanguage, 
            languages,
            isChangingLanguage,
            isRTL
        }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
} 