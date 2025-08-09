import React from "react";
import { usePage, Link } from "@inertiajs/react";
import { useTranslation } from 'react-i18next';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Home, Search, Package, MessageSquare, HelpCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";



function ClientSidebar() {
  const { t, i18n } = useTranslation();
  const navigation = [
    { key: 'dashboard', href: "/client/dashboard", icon: Home },
    { key: 'services', href: "/services", icon: Search },
    { key: 'orders', href: "/client/orders", icon: Package },
    { key: 'messages', href: "/chat", icon: MessageSquare },
  ];
  const { auth } = usePage().props;
  const currentUrl = typeof window !== "undefined" ? window.location.pathname : "";
  const isRTL = i18n.language === 'ar';

  return (
    <Sidebar className={isRTL ? 'rtl' : 'ltr'} side={isRTL ? 'right' : 'left'}>
      <SidebarHeader>
        <Link href="/">
          <img src="/logo.png" alt="Anjez" className="h-11 mx-auto" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {/* Main navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={isRTL ? 'text-right' : 'text-left'}>
            {isRTL ? 'الرئيسية' : 'Main'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = currentUrl.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href} active={isActive}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors group",
                          isActive
                            ? `bg-primary/10 text-primary font-semibold shadow-sm ${isRTL ? 'border-r-4 border-primary' : 'border-l-4 border-primary'}`
                            : `hover:bg-accent hover:text-accent-foreground ${isRTL ? 'border-r-4 border-transparent' : 'border-l-4 border-transparent'}`
                        )}
                        tabIndex={0}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <Icon className={cn(
                          isRTL ? "ml-3" : "mr-3",
                          "h-4 w-4",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
                        )}/>
                        <span className={isRTL ? 'text-right' : 'text-left'}>{t(`nav.${item.key}`)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* User info/footer */}
      <SidebarFooter>
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="User" />
            <AvatarFallback>
             

              {auth.user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${isRTL ? 'text-right' : 'text-left'}`}>
              {auth?.user?.name || "User"}
            </p>
            <p className={`text-xs text-muted-foreground truncate ${isRTL ? 'text-right' : 'text-left'}`}>
              {auth?.user?.email || "user@example.com"}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default ClientSidebar; 