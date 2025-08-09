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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  Home, 
  Package, 
  FileText, 
  MessageSquare, 
  DollarSign, 
  BarChart3, 
  Calendar, 
  Users, 
  HelpCircle, 
  Wallet,
  Shield,
  Settings,
  CreditCard,
  TrendingUp,
  UserCheck,
  Activity,
  Briefcase
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Admin sidebar navigation links - matching your admin routes
const navigation = [
    { title: "Dashboard", href: "/admin/dashboard", icon: Home },
    { title: "Services", href: "/admin/services", icon: Briefcase },
    { title: "Orders", href: "/admin/orders", icon: FileText, }, // User removed badge
    { title: "Payments", href: "/admin/payments", icon: CreditCard, }, // User removed badge
    { title: "Wallets", href: "/admin/wallets", icon: Wallet },

    { title: "Users", href: "/admin/users", icon: Users }, // Commented out as route is commented
    // { title: "Analytics", href: "/admin/analytics", icon: TrendingUp }, // Commented out as route is commented
    // { title: "Settings", href: "/admin/settings", icon: Settings }, // Add when route is available
];

const secondaryNavigation = [
  { title: "Help & Support", href: "/admin/help", icon: HelpCircle },
];

function AdminSidebar() {
  const { auth } = usePage().props;
  const { t, i18n } = useTranslation();
  const currentUrl = typeof window !== "undefined" ? window.location.pathname : "";
  const isRTL = i18n.language === 'ar';

  return (
    <Sidebar className={isRTL ? 'rtl' : 'ltr'} side={isRTL ? 'right' : 'left'}>
      <SidebarHeader>
        <Link href="/admin/dashboard">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-lg font-bold text-foreground">Admin Panel</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {/* Main navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={isRTL ? 'text-right' : 'text-left'}>
            {isRTL ? 'الإدارة' : 'Administration'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = currentUrl.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href} active={isActive ? "true" : "false"}>
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
                        <span className={isRTL ? 'text-right' : 'text-left'}>
                          {t(`admin.nav.${item.title.toLowerCase()}`) || item.title}
                        </span>
                        {item.badge && (
                          <SidebarMenuBadge className={isRTL ? 'mr-auto' : 'ml-auto'}>
                            {item.badge}
                          </SidebarMenuBadge>
                        )}
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
            <AvatarImage src={auth?.user?.avatar} alt="Admin" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {auth?.user?.name?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${isRTL ? 'text-right' : 'text-left'}`}>
              {auth?.user?.name || "Admin"}
            </p>
            <p className={`text-xs text-muted-foreground truncate ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('admin.role', 'Administrator')}
            </p>
          </div>
        </div>
      </SidebarFooter>

    </Sidebar>
  );
}

export default AdminSidebar; 