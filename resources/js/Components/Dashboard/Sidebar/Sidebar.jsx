"use client";

import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Database,
  Mail,
  Calendar,
  HelpCircle,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NavItem } from "./NavItem";
import { NavGroup } from "./NavGroup";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { usePage } from '@inertiajs/react';

export function Sidebar() {
  const { auth } = usePage().props;
  const pathname = window.location.pathname;
  const isChatActive = pathname.startsWith('/chat');

  let navItems = [];
  if (auth?.user?.role === 'freelancer') {
    navItems = [
      { href: "/freelancer/dashboard", icon: LayoutDashboard, label: "Dashboard", active: pathname === "/freelancer/dashboard" },
      { href: "/freelancer/services", icon: Users, label: "Services", active: pathname.startsWith("/freelancer/services") },
      { href: "/freelancer/orders", icon: FileText, label: "Orders", active: pathname.startsWith("/freelancer/orders") },
      { href: "/chat", icon: Mail, label: "Messages", active: isChatActive },
      { href: "/freelancer/earnings", icon: Database, label: "Earnings", active: pathname.startsWith("/freelancer/earnings") },
      { href: "/freelancer/analytics", icon: Calendar, label: "Analytics", active: pathname.startsWith("/freelancer/analytics") },
      { href: "/freelancer/clients", icon: Users, label: "Clients", active: pathname.startsWith("/freelancer/clients") },
      { href: "/support", icon: HelpCircle, label: "Support", active: pathname.startsWith("/support") },
    ];
  } else {
    navItems = [
      { href: "/client/dashboard", icon: LayoutDashboard, label: "Dashboard", active: pathname === "/client/dashboard" },
      { href: "/services", icon: Users, label: "Find Services", active: pathname.startsWith("/services") },
      { href: "/orders", icon: FileText, label: "My Orders", active: pathname.startsWith("/orders") },
      { href: "/chat", icon: Mail, label: "Messages", active: isChatActive },
      { href: "/support", icon: HelpCircle, label: "Support", active: pathname.startsWith("/support") },
    ];
  }

  // Example navGroups for demonstration; customize as needed
  const navGroups = [
    {
      icon: Database,
      label: "Resources",
      items: [
        { href: "/api-keys", label: "API Keys", active: pathname.startsWith("/api-keys") },
        { href: "/logs", label: "Logs", active: pathname.startsWith("/logs") },
      ],
    },
  ];

  return (
    <div className="hidden md:flex flex-col h-full w-[var(--sidebar-width)] border-r bg-background">
      <div className="p-4">
        <WorkspaceSwitcher currentWorkspace={{ name: "Acme Inc" }} />
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>
        <Separator className="my-2" />
        <div className="flex flex-col gap-1">
          {navGroups.map((group) => (
            <NavGroup key={group.label} {...group} />
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 mt-auto">
        <NavItem href="/settings" icon={Settings} label="Settings" active={pathname.startsWith("/settings")} />
      </div>
    </div>
  );
} 