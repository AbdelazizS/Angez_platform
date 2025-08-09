import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, X, User, LogOut, Settings, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useDarkMode } from "@/lib/dark-mode";
import { useLanguageChange } from "@/lib/useLanguageChange";
import DarkModeToggle from "@/components/DarkModeToggle";
import LanguageDropdown from "@/components/LanguageDropdown";
import Logo from "@/components/Logo";

export default function ModernNavbar({ auth }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t } = useTranslation();
    const { isDarkMode } = useDarkMode();
    const { isRTL } = useLanguageChange();

    const { url } = usePage();

    console.log(url, window.location.pathname);

    // Handle scroll effect for sticky navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/", label: t("nav.home", "Home") },
        { href: "/about", label: t("nav.about", "About") },
        { href: "/services", label: t("nav.services", "Services") },
        { href: "/contact", label: t("nav.contact", "Contact") },
    ];

    return (
        <header
            className={`rtl sticky top-0 z-50 w-full transition-all duration-300 ${
                isScrolled
                    ? "bg-background dark:bg-muted backdrop-blur-md border-b border-border  shadow-sm"
                    : "bg-background dark:bg-background backdrop-blur-sm"
            }`}
        >
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-3 group"
                        aria-label="Anjez Home"
                    >
                        <div className="relative">
                            <Logo className="h-8 w-auto lg:h-10 transition-transform duration-200 group-hover:scale-105" />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center">
                        {navLinks.map((link) => {
                            const isActive =
                                url === link.href ||
                                url.startsWith(link.href + "/");

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative text-sm font-medium transition-colors duration-200 group ms-8
                ${
                    isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                }
            `}
                                >
                                    {link.label}
                                    <span
                                        className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-200
                    ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                `}
                                    ></span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <LanguageDropdown />
                        <DarkModeToggle />

                        {auth.user ? (
                            <div className="flex items-center space-x-4">
                                {/* <Badge
                                    variant="secondary"
                                    className="text-xs font-medium me-2"
                                >
                                    {auth.user.role === "freelancer"
                                        ? t("auth.freelancer")
                                        : t("auth.client")}
                                </Badge> */}
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="font-medium text-muted-foreground  hover:text-primary transition-all duration-200 hover:shadow-md"
                                >
                                    <Link href={route("dashboard")}>
                                        <User className="h-4 w-4 me-2" />
                                        {t("nav.dashboard")}
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground"
                                >
                                    <Link href={route("logout")} method="post">
                                        <LogOut className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="font-medium text-muted-foreground  hover:text-primary me-2"
                                >
                                    <Link href={route("login")}>
                                        {t("nav.signIn")}
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className="font-medium bg-primary/90 hover:bg-primary shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    <Link href={route("register")}>
                                        {t("nav.joinAsFreelancer")}
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center space-x-2">
                        <LanguageDropdown />
                        <DarkModeToggle />
                        <Sheet
                            open={isMobileMenuOpen}
                            onOpenChange={setIsMobileMenuOpen}
                        >
                            <SheetTrigger asChild>
                                <div
                                    className="p-2 h-9 w-9 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground"
                                    aria-label="Open mobile menu"
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" ||
                                            e.key === " "
                                        ) {
                                            e.preventDefault();
                                            setIsMobileMenuOpen(true);
                                        }
                                    }}
                                >
                                    <Menu className="h-5 w-5" />
                                </div>
                            </SheetTrigger>
                            <SheetContent
                                side={isRTL ? "left" : "right"}
                                className="w-[300px] sm:w-[400px] p-0"
                            >
                                <SheetHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <SheetTitle className="flex items-center space-x-3">
                                        <Logo className="h-8 w-auto" />
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="flex flex-col h-full">
                                    {/* Mobile Navigation Links */}
                                    <div className="flex-1 px-6 py-6">
                                        <nav className="space-y-1">
                                            {navLinks.map((link) => {
                                                const isActive =
                                                    url === link.href ||
                                                    url.startsWith(
                                                        link.href + "/"
                                                    );

                                                return (
                                                    <Link
                                                        key={link.href}
                                                        href={link.href}
                                                        onClick={() =>
                                                            setIsMobileMenuOpen(
                                                                false
                                                            )
                                                        }
                                                        className={`flex items-center justify-between w-full px-3 py-3 text-base font-medium rounded-lg transition-colors duration-200 group
                ${
                    isActive
                        ? "text-primary bg-accent"
                        : "text-muted-foreground hover:text-primary"
                }
            `}
                                                    >
                                                        <span>
                                                            {link.label}
                                                        </span>
                                                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                                    </Link>
                                                );
                                            })}
                                        </nav>
                                    </div>

                                    {/* Mobile Auth Section */}
                                    <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-700">
                                        {auth.user ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {t("auth.welcome")},{" "}
                                                            {auth.user.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {auth.user.email}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {auth.user.role ===
                                                        "freelancer"
                                                            ? t(
                                                                  "auth.freelancer"
                                                              )
                                                            : t("auth.client")}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        className="w-full justify-start"
                                                        onClick={() =>
                                                            setIsMobileMenuOpen(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        <Link
                                                            href={route(
                                                                "dashboard"
                                                            )}
                                                            className="w-full"
                                                        >
                                                            <User className="h-4 w-4 me-3" />
                                                            {t("nav.dashboard")}
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        className="w-full justify-start"
                                                        onClick={() =>
                                                            setIsMobileMenuOpen(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        <Link
                                                            href={route(
                                                                "profile.edit"
                                                            )}
                                                            className="w-full"
                                                        >
                                                            <Settings className="h-4 w-4 me-3" />
                                                            {t("nav.profile")}
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                                                        onClick={() =>
                                                            setIsMobileMenuOpen(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        <Link
                                                            href={route(
                                                                "logout"
                                                            )}
                                                            method="post"
                                                            className="w-full"
                                                        >
                                                            <LogOut className="h-4 w-4 me-3" />
                                                            {t("nav.signOut")}
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() =>
                                                        setIsMobileMenuOpen(
                                                            false
                                                        )
                                                    }
                                                >
                                                    <Link
                                                        href={route("login")}
                                                        className="w-full"
                                                    >
                                                        {t("nav.signIn")}
                                                    </Link>
                                                </Button>
                                                <Button
                                                    asChild
                                                    className="w-full bg-[#0077B6] hover:bg-[#023E8A] shadow-lg hover:shadow-xl transition-all duration-200"
                                                    onClick={() =>
                                                        setIsMobileMenuOpen(
                                                            false
                                                        )
                                                    }
                                                >
                                                    <Link
                                                        href={route("register")}
                                                        className="w-full"
                                                    >
                                                        {t(
                                                            "nav.joinAsFreelancer"
                                                        )}
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>
        </header>
    );
}
