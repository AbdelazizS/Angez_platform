import '../css/app.css';
import './bootstrap';
import './lib/i18n'; // Initialize i18n

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { DarkModeProvider } from './lib/dark-mode';
import { LanguageProvider } from './lib/language';
import LanguageChangeNotification from './components/LanguageChangeNotification';
import { Toaster } from './components/ui/sonner';

if (!Object.hasOwn) {
  Object.hasOwn = function(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const isRTL = document.dir === "rtl"

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <LanguageProvider>
                <DarkModeProvider>
                    <App {...props} />
                    <LanguageChangeNotification />
                    <Toaster position={isRTL ? "top-left" : "top-right"} richColors />
                </DarkModeProvider>
            </LanguageProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
