import React from 'react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AdminSidebar from '@/Components/ui/AdminSidebar';
import AppHeader from '@/Components/ui/AppHeader';
import { SidebarProvider, SidebarTrigger } from '@/Components/ui/sidebar';

export default function AdminLayout({noPadding, children, breadcrumbs }) {
  const { auth } = usePage().props;
  const { i18n } = useTranslation();
  const user = auth?.user;
  const isRTL = i18n.language === 'ar';

  return (
    <SidebarProvider>
      <div className={`flex min-h-screen w-full bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Sidebar (responsive, handled internally) */}
        <SidebarTrigger />
        <AdminSidebar />

        {/* Main Content Area */}
        <div className={`flex flex-col flex-1 `}>
          {/* Sticky Header */}
          <header className="sticky top-0 z-20 w-full bg-background border-b">
            <AppHeader breadcrumbs={breadcrumbs} user={user} />
          </header>

          {/* Scrollable Content */}
          <main className={`flex-1 overflow-auto w-full ${isRTL ? 'text-right' : 'text-left'} ${noPadding ? 'p-0' : 'p-4 sm:p-6'}`}>
            <div className="w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}