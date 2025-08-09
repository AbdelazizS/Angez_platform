import React from 'react';
import { Home, Briefcase, ShoppingCart, User, Settings, LogOut, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, usePage } from '@inertiajs/react';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';

export default function AppSidebar() {
  const { t } = useTranslation();
  const { url } = usePage();
  const [collapsed, setCollapsed] = React.useState(false);

  const items = [
    { title: t('nav.dashboard') || 'Dashboard', url: '/freelancer/dashboard', icon: Home },
    { title: t('nav.services') || 'Services', url: '/freelancer/services', icon: Briefcase },
    { title: t('nav.orders') || 'Orders', url: '/orders', icon: ShoppingCart },
    { title: t('nav.profile') || 'Profile', url: '/profile/edit', icon: User },
    { title: t('nav.settings') || 'Settings', url: '/settings', icon: Settings },
  ];

  return (
    <SidebarProvider>
      <aside className={`h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-200 ${collapsed ? 'w-20' : 'w-64'}`}>
        {/* Logo and Collapse Button */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-block w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">A</span>
          </Link>
          <button
            className="ml-auto p-2 rounded hover:bg-primary/10"
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-2 overflow-y-auto">
          {items.map((item) => {
            const isActive = url.startsWith(item.url);
            return (
                  <Link
                key={item.title}
                    href={item.url}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-base ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-primary/5'
                } ${collapsed ? 'justify-center px-2' : ''}`}
                  >
                    <item.icon className="w-5 h-5" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
        {/* Footer/Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/logout"
            method="post"
            as="button"
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 font-medium ${collapsed ? 'justify-center px-2' : ''}`}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>{t('nav.signOut') || 'Sign Out'}</span>}
                  </Link>
        </div>
      </aside>
    </SidebarProvider>
  );
} 