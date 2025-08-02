import { useEffect, useState } from 'react';
import { CheckCircle, Globe } from 'lucide-react';
import { useLanguageChange } from '@/lib/useLanguageChange';

export default function LanguageChangeNotification() {
    const [showNotification, setShowNotification] = useState(false);
    const [notificationData, setNotificationData] = useState(null);
    const { getCurrentLanguageInfo } = useLanguageChange();

    useEffect(() => {
        const handleLanguageChange = (event) => {
            const { language, direction } = event.detail;
            const langInfo = getCurrentLanguageInfo();
            
            setNotificationData({
                language,
                direction,
                flag: langInfo?.flag,
                name: langInfo?.nativeName
            });
            
            setShowNotification(true);
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
        };

        window.addEventListener('languageChanged', handleLanguageChange);
        
        return () => {
            window.removeEventListener('languageChanged', handleLanguageChange);
        };
    }, [getCurrentLanguageInfo]);

    if (!showNotification || !notificationData) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-right duration-300">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm">
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Language Changed
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                            <span className="text-lg">{notificationData.flag}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {notificationData.name}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 