import { Link } from '@inertiajs/react';
import {
  Bell,
  Search,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

export function TopBar({ user }) {
  // For theme toggle (replace with your own dark mode logic if needed)
  const [theme, setTheme] = useState(
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  // Example notification count (replace with real data)
  const notificationCount = 3;

  return (
    <header className="sticky top-0 z-10 bg-background border-b">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Search Bar */}
        <div className="hidden md:flex items-center space-x-4">
          <Input
            placeholder="Search..."
            className="w-64"
            starticon={<Search className="w-4 h-4" />}
            aria-label="Search"
          />
        </div>

        {/* Right: User Controls */}
        <div className="flex items-center space-x-4">
          {/* Quick Action Button */}
          <Button size="sm" className="hidden md:flex">
            <Plus className="w-4 h-4 mr-2" /> New Order
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs">{notificationCount}</Badge>
            )}
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2" aria-label="User menu">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">{user?.name}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="w-4 h-4 mr-2" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={route('logout')} method="post" className="w-full">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
} 