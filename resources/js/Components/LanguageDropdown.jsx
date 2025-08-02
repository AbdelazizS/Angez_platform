import { ChevronDown, Globe, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguageChange } from '@/lib/useLanguageChange';
import { useTranslation } from 'react-i18next';

export default function LanguageDropdown() {
    const { t } = useTranslation();
    const { 
        currentLanguage, 
        isChangingLanguage, 
        isRTL, 
        switchLanguage, 
        getCurrentLanguageInfo 
    } = useLanguageChange();

    const currentLang = getCurrentLanguageInfo();
    const languages = [
        { code: 'en', name: t('header.language.english'), nativeName: 'English', flag: '🇺🇸', direction: 'ltr' },
        { code: 'ar', name: t('header.language.arabic'), nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl' }
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 h-9 relative"
                    disabled={isChangingLanguage}
                    aria-label={t('header.language.select_language')}
                >
                    {isChangingLanguage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Globe className="h-4 w-4" />
                    )}
                    <span className="mr-1 ml-1">{currentLang?.flag}</span>
                    <span className="hidden sm:inline">{currentLang?.nativeName}</span>
                    <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align={isRTL ? "start" : "end"} 
                className="w-48 rtl"
                sideOffset={8}
            >
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => switchLanguage(language.code)}
                        disabled={isChangingLanguage}
                        className={`flex items-center space-x-3 p-3 cursor-pointer transition-colors ${
                            currentLanguage === language.code 
                                ? 'bg-accent text-accent-foreground' 
                                : 'hover:bg-accent hover:text-accent-foreground'
                        } ${isChangingLanguage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span className="text-lg">{language.flag}</span>
                        <div className="flex flex-col">
                            <span className="font-medium">{language.name}</span>
                            <span className="text-xs text-muted-foreground">{language.nativeName}</span>
                        </div>
                        {currentLanguage === language.code && (
                            <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 