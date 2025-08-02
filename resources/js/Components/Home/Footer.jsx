import { useTranslation } from "react-i18next";
import { useLanguageChange } from "@/lib/useLanguageChange";
import { Link } from "@inertiajs/react";
import { Facebook, Instagram, MessageSquare, Globe, Code } from "lucide-react";

export default function Footer() {
    const { t } = useTranslation();
    const { isRTL, currentLanguage, switchLanguage } = useLanguageChange();
    const currentYear = new Date().getFullYear();

    // Custom SVG icons for platforms not in Lucide
    const XIcon = () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );

    const WhatsAppIcon = () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );

    const linkGroups = [
        {
            title: t("footer.links.company.title", "Company"),
            links: [
                {
                    name: t("footer.links.company.about", "About Us"),
                    href: route("about"),
                },
            ],
        },
        {
            title: t("footer.links.services.title", "Services"),
            links: [
                {
                    name: t(
                        "footer.links.services.webDevelopment",
                        "Web Development"
                    ),
                    href: route("services.index"),
                },
                {
                    name: t(
                        "footer.links.services.graphicDesign",
                        "Graphic Design"
                    ),
                    href: route("services.index"),
                },
                {
                    name: t(
                        "footer.links.services.contentWriting",
                        "Content Writing"
                    ),
                    href: route("services.index"),
                },
                {
                    name: t(
                        "footer.links.services.digitalMarketing",
                        "Digital Marketing"
                    ),
                    href: route("services.index"),
                },
            ],
        },
        {
            title: t("footer.links.support.title", "Support"),
            links: [
                {
                    name: t("footer.links.support.help", "Help Center"),
                    href: route("faq"),
                },
                {
                    name: t("footer.links.support.contact", "Contact Us"),
                    href: route("contact"),
                },
            ],
        },
        {
            title: t("footer.links.legal.title", "Legal"),
            links: [
                {
                    name: t("footer.links.legal.terms", "Terms of Service"),
                    href: route("terms"),
                },
                {
                    name: t("footer.links.legal.privacy", "Privacy Policy"),
                    href: route("privacy"),
                },
                {
                    name: t("footer.links.legal.disclaimer", "Disclaimer"),
                    href: route("rights"),
                },
            ],
        },
    ];

    const socialLinks = [
        {
            name: t("footer.social.facebook", "Facebook"),
            icon: Facebook,
            href: "https://www.facebook.com/Angez.Platform?mibextid=ZbWKwL",
            color: "hover:text-blue-600",
        },
        {
            name: t("footer.social.twitter", "X (Twitter)"),
            icon: XIcon,
            href: "https://x.com/Angez_Platform?t=aGMjgKUUsvMksyvAd8sesw&s=09",
            color: "hover:text-black dark:hover:text-white",
        },
        {
            name: t("footer.social.instagram", "Instagram"),
            icon: Instagram,
            href: "https://www.instagram.com/angez_platform?igsh=MW1wanB2ZmtyMjh5aQ==",
            color: "hover:text-pink-500",
        },
        {
            name: t("footer.social.whatsapp", "WhatsApp Channel"),
            icon: WhatsAppIcon,
            href: "https://whatsapp.com/channel/0029VawdWrqEFeXhX70GfQ3r",
            color: "hover:text-green-500",
        },
    ];

    const handleLanguageChange = async (language) => {
        await switchLanguage(language);
    };

    return (
        <footer className="bg-gradient-to-br rtl:bg-gradient-to-bl from-background to-primary/5 rtl dark:bg-background border-t border-border text-foreground rtl">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="mb-8">
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Angez
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                {t(
                                    "footer.description",
                                    "Anjez is Sudan's premier freelance marketplace, connecting talented professionals with clients who need their services. Join our growing community today."
                                )}
                            </p>
                        </div>

                        {/* Social Links */}
                        <div>
                            <h4 className="text-lg font-semibold text-foreground mb-4">
                                {t("footer.social.title", "Follow Us")}
                            </h4>
                            <div className="flex gap-4">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-12 h-12 bg-card rounded-xl flex items-center justify-center transition-all duration-300 ${social.color} hover:scale-110 hover:shadow-lg`}
                                        aria-label={social.name}
                                    >
                                        <social.icon />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Link Groups */}
                    {linkGroups.map((group) => (
                        <div key={group.title}>
                            <h4 className="text-lg font-semibold text-foreground mb-6">
                                {group.title}
                            </h4>
                            <ul className="space-y-4">
                                {group.links.map((link) => (
                                    <li key={link.name}>
                                        {link.href === "#" ? (
                                            <span className="text-muted-foreground cursor-not-allowed opacity-50 text-base">
                                                {link.name}
                                            </span>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-base hover:translate-x-1 inline-block"
                                            >
                                                {link.name}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                        {/* Copyright & Credits */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
                            <span>
                                {t(
                                    "footer.bottom.copyright",
                                    "\u00a9 {{year}} Anjez Platform. All rights reserved.",
                                    { year: currentYear }
                                )}
                            </span>
                            <div className="flex items-center gap-2">
                                <Code className="w-4 h-4 text-primary" />
                                <a
                                    href="https://www.linkedin.com/in/abdelaziz-elrasheed-3b1748257?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors duration-200"
                                >
                                    {t("footer.bottom.madeBy", "Made by Aziz")}
                                </a>
                            </div>
                        </div>

                        {/* Language Selector */}
                        <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground font-medium">
                                {t("footer.bottom.language", "Language")}:
                            </span>
                            <div className="flex gap-1 bg-card rounded-lg p-1">
                                <button
                                    onClick={() => handleLanguageChange("en")}
                                    className={`text-sm px-3 py-2 rounded-md transition-all duration-200 font-medium ${
                                        currentLanguage === "en"
                                            ? "bg-primary text-primary-foreground shadow-lg"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}
                                >
                                    EN
                                </button>
                                <button
                                    onClick={() => handleLanguageChange("ar")}
                                    className={`text-sm px-3 py-2 rounded-md transition-all duration-200 font-medium ${
                                        currentLanguage === "ar"
                                            ? "bg-primary text-primary-foreground shadow-lg"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}
                                >
                                    AR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
