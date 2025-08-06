import { Head, Link, router } from "@inertiajs/react";
import Navbar from "@/Components/Home/Navbar";
import Footer from "@/Components/Home/Footer";
import { useTranslation } from "react-i18next";
import { 
    Mail, 
    Clock, 
    Headphones, 
    Facebook, 
    Twitter, 
    Linkedin,
    Instagram,
    MapPin,
    Loader2
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContactSchema } from "@/lib/validations/contact";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/Components/ui/form";
import { Textarea } from "@/Components/ui/textarea";
import { Toaster, toast } from "sonner";

export default function Contact({ auth, errors, success }) {
    const { t, i18n } = useTranslation();
    const lang = i18n.language || (typeof window !== "undefined" ? document.documentElement.lang : "en");
    const isRTL = lang === "ar";
    const [loading, setLoading] = useState(false);

    // Create localized validation schema
    const contactSchema = createContactSchema(t);

    const form = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    const onSubmit = async (values) => {
        setLoading(true);
        router.post(route("contact.submit"), values, {
            onSuccess: () => {
                toast.success(t("contact.sections.form.success"));
                form.reset();
                setLoading(false);
            },
            onError: (errors) => {
                Object.entries(errors).forEach(([field, messages]) => {
                    if (Array.isArray(messages)) {
                        form.setError(field, {
                            type: "server",
                            message: messages[0],
                        });
                    } else {
                        form.setError(field, {
                            type: "server",
                            message: messages,
                        });
                    }
                });

                if (Object.keys(errors).length === 0) {
                    toast.error(t("contact.errors.general"));
                } else {
                    toast.error(t("contact.errors.server"));
                }

                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    const renderIcon = (iconName) => {
        switch(iconName) {
            case 'mail': return <Mail className="w-5 h-5 text-primary" />;
            case 'clock': return <Clock className="w-5 h-5 text-primary" />;
            case 'support': return <Headphones className="w-5 h-5 text-primary" />;
            default: return null;
        }
    };

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

    const socialLinks = [
        {
            name: t("footer.social.facebook", "Facebook"),
            icon: Facebook,
            href: "https://www.facebook.com/Angez.Platform?mibextid=ZbWKwL",
            color: "hover:text-blue-600"
        },
        {
            name: t("footer.social.twitter", "X (Twitter)"),
            icon: XIcon,
            href: "https://x.com/Angez_Platform?t=aGMjgKUUsvMksyvAd8sesw&s=09",
            color: "hover:text-black dark:hover:text-white"
        },
        {
            name: t("footer.social.instagram", "Instagram"),
            icon: Instagram,
            href: "https://www.instagram.com/angez_platform?igsh=MW1wanB2ZmtyMjh5aQ==",
            color: "hover:text-pink-500"
        },
        {
            name: t("footer.social.whatsapp", "WhatsApp Channel"),
            icon: WhatsAppIcon,
            href: "https://whatsapp.com/channel/0029VawdWrqEFeXhX70GfQ3r",
            color: "hover:text-green-500"
        }
    ];

    return (
        <>
            <Head title={t('contact.title')} />

            <Navbar auth={auth} />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary/5 to-background py-20 rtl">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                        {t('contact.title')}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t('contact.description')}
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16 rtl">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Contact Form */}
                    <div className="lg:w-1/2">
                        <div className="bg-card rounded-xl shadow-sm p-8 border border-border">
                            <h2 className="text-2xl font-bold mb-6 text-foreground">
                                {t('contact.sections.form.heading')}
                            </h2>
                            
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t('contact.sections.form.fields.name')}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder={t('contact.sections.form.fields.name')}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t('contact.sections.form.fields.email')}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder={t('contact.sections.form.fields.email')}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t('contact.sections.form.fields.subject')}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder={t('contact.sections.form.fields.subject')}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t('contact.sections.form.fields.message')}
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder={t('contact.sections.form.fields.message')}
                                                        rows={5}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <Button
                                        type="submit"
                                        className="w-full py-3 text-base font-semibold bg-primary text-primary-foreground hover:opacity-90"
                                        disabled={form.formState.isSubmitting || loading}
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                {t('contact.sections.form.fields.submit')}
                                            </span>
                                        ) : form.formState.isSubmitting ? (
                                            t('contact.sections.form.fields.submit')
                                        ) : (
                                            t('contact.sections.form.fields.submit')
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:w-1/2 space-y-8">
                        {/* Contact Information */}
                        <div className="bg-card rounded-xl shadow-sm p-8 border border-border">
                            <h2 className="text-2xl font-bold mb-6 text-foreground">
                                {t('contact.sections.info.heading')}
                            </h2>
                            <div className="space-y-4">
                                {t('contact.sections.info.items', { returnObjects: true }).map((item, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="me-4 mt-0.5">
                                            {renderIcon(item.icon)}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-foreground">{item.title}</h3>
                                            <p className="text-muted-foreground">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-card rounded-xl shadow-sm p-8 border border-border">
                            <h2 className="text-2xl font-bold mb-6 text-foreground">
                                {t('footer.social.title', 'Follow Us')}
                            </h2>
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
                </div>
            </div>

            <Footer />
        </>
    );
}