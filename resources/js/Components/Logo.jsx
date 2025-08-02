import { useDarkMode } from '@/lib/dark-mode';

export default function Logo({ className = "h-8 w-auto" }) {
    const { isDarkMode } = useDarkMode();
    
    return (
        <img
            src={isDarkMode ? '/logo-dark.png' : '/logo.png'}
            alt="Anjez Logo"
            className={className}
        />
    );
} 