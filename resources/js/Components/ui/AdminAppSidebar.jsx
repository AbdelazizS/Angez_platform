import React from 'react';
import { Link } from '@inertiajs/react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
  Home, 
  Briefcase, 
  Package, 
  Users, 
  BarChart2, 
  LogOut,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { url: '/dashboard', icon: Home, label: 'Dashboard' },
  { url: '/admin/services', icon: Briefcase, label: 'Services' },
  { url: '/orders', icon: Package, label: 'Orders' },
  { url: '/admin/payments', icon: DollarSign, label: 'Payments' },
  { url: '/admin/wallets', icon: Wallet, label: 'Wallet Management' },
  { url: '/admin/users', icon: Users, label: 'Users' },
  { url: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
];

export default function AdminAppSidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState('/dashboard');

  return (
    <Sidebar 
      className={cn(
        "h-screen border-r bg-background transition-all duration-300 ease-in-out",
        collapsed ? "w-[80px]" : "w-[240px]"
      )}
    >
      {/* Header with logo and collapse button */}
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <img 
                src={collapsed ? '/logo.png' : '/logo.png'} 
                alt="Logo" 
                className="h-12"
              />
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="flex-1 py-4">
        <SidebarGroup>
          <SidebarMenu>
            {sidebarItems.map((item) => (
              <Tooltip key={item.url} delayDuration={0}>
                <TooltipTrigger asChild>
                  <SidebarMenuItem
                    asChild
                    active={activeItem === item.url}
                    onClick={() => setActiveItem(item.url)}
                  >
                    <Link 
                      href={item.url} 
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg mx-2",
                        activeItem === item.url 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "hover:bg-accent"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 flex-shrink-0",
                        collapsed ? "mx-auto" : ""
                      )} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </SidebarMenuItem>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Secondary Navigation */}
        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <SidebarMenuItem
                  asChild
                  active={activeItem === '/settings'}
                  onClick={() => setActiveItem('/settings')}
                >
                  <Link 
                    href="/settings" 
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg mx-2",
                      activeItem === '/settings' 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "hover:bg-accent"
                    )}
                  >
                    <Settings className={cn(
                      "h-5 w-5 flex-shrink-0",
                      collapsed ? "mx-auto" : ""
                    )} />
                    {!collapsed && <span>Settings</span>}
                  </Link>
                </SidebarMenuItem>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  Settings
                </TooltipContent>
              )}
            </Tooltip>

            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <SidebarMenuItem
                  asChild
                  active={activeItem === '/help'}
                  onClick={() => setActiveItem('/help')}
                >
                  <Link 
                    href="/help" 
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg mx-2",
                      activeItem === '/help' 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "hover:bg-accent"
                    )}
                  >
                    <HelpCircle className={cn(
                      "h-5 w-5 flex-shrink-0",
                      collapsed ? "mx-auto" : ""
                    )} />
                    {!collapsed && <span>Help</span>}
                  </Link>
                </SidebarMenuItem>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  Help
                </TooltipContent>
              )}
            </Tooltip>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with user profile */}
      <SidebarFooter className="p-2 border-t">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/user-avatar.jpg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
              </div>
            </div>
          )}
          {collapsed && (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src="/user-avatar.jpg" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div className="space-y-1">
                  <p className="font-medium">Admin User</p>
                  <p className="text-muted-foreground">admin@example.com</p>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
          {!collapsed && (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}