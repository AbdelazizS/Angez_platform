import React from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import UserMenu from '@/components/ui/UserMenu';
import LanguageDropdown from '@/components/LanguageDropdown';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTranslation } from 'react-i18next';

function generateBreadcrumbsFromPath(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  let path = '';
  return segments.map((seg, idx) => {
    path += `/${seg}`;
    return {
      label: seg.charAt(0).toUpperCase() + seg.slice(1),
      href: idx < segments.length - 1 ? path : undefined,
    };
  });
}

function AppHeader({ breadcrumbs, user }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // Fallback breadcrumbs if not provided
  let fallbackBreadcrumbs = [
    { label: t('header.breadcrumbs.dashboard'), href: '/freelancers/dashboard' },
    { label: t('header.breadcrumbs.my_services') },
  ];
  if (!breadcrumbs && typeof window !== 'undefined') {
    const path = window.location.pathname;
    const autoBreadcrumbs = generateBreadcrumbsFromPath(path);
    if (autoBreadcrumbs.length > 0) fallbackBreadcrumbs = autoBreadcrumbs;
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className={`flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8 `}>
        {/* Sidebar trigger for mobile */}
        <div className={`lg:hidden ${isRTL ? 'order-last' : ''}`}>
          <SidebarTrigger />
        </div>

        {/* Breadcrumbs */}
        <div className="flex-1">
          {/* <Breadcrumbs breadcrumbs={breadcrumbs || fallbackBreadcrumbs} /> */}
        </div>

        {/* Header Actions */}
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Notifications */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`relative inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground `}>
                <Bell className="h-4 w-4" />
                <Badge 
                  variant="destructive" 
                  className={`absolute h-4 w-4 rounded-full p-1 ${isRTL ? '-top-0 -left-0' : '-top-0 -right-0'}`}
                >
                  3
                </Badge>
                <span className="sr-only">{t('header.toggle_sidebar')}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent  className="w-80 rtl">
              <DropdownMenuLabel className={isRTL ? 'text-right' : 'text-left'}>
                {t('header.notifications')}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem >
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {t('header.new_order_received')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('header.new_order_description')}
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className={isRTL ? 'text-right' : 'text-left'}>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {t('header.payment_received')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('header.payment_description')}
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className={isRTL ? 'text-right' : 'text-left'}>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {t('header.client_message')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('header.client_message_description')}
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Language Dropdown */}
          <LanguageDropdown />

          {/* User Menu */}
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}

export default AppHeader; 