import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import Logo from '@/Components/Logo';
import DarkModeToggle from '@/Components/DarkModeToggle';
import LanguageDropdown from '@/Components/LanguageDropdown';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 dark:bg-gray-900 pt-6 sm:justify-center sm:pt-0">
            <div className="absolute top-4 right-4 flex items-center space-x-2">
                <LanguageDropdown />
                <DarkModeToggle />
            </div>
            <div>
                <Link href="/">
                    <Logo className="h-20 w-20" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white dark:bg-gray-800 px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
