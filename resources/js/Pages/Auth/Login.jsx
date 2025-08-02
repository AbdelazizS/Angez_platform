import { Head, Link, router } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/Components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLoginSchema } from "@/lib/validations/auth";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import Logo from "@/Components/Logo";

export default function Login({ status, canResetPassword }) {
    const { t, i18n } = useTranslation();
    const lang = i18n.language || (typeof window !== "undefined" ? document.documentElement.lang : "en");
    const isRTL = lang === "ar";
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Create localized validation schema
    const loginSchema = createLoginSchema(t);

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    const onSubmit = async (values) => {
        setLoading(true);
        router.post(route("login"), values, {
            onSuccess: () => {
                toast.success(t("auth.success.loginSuccessful"));
                form.reset();
                setLoading(false);
            },
            onError: (errors) => {
                // Handle server-side validation errors
                Object.entries(errors).forEach(([field, messages]) => {
                    if (Array.isArray(messages)) {
                        // Handle array of error messages
                        form.setError(field, {
                            type: "server",
                            message: messages[0], // Use first error message
                        });
                    } else {
                        // Handle single error message
                        form.setError(field, {
                            type: "server",
                            message: messages,
                        });
                    }
                });

                // Show general error toast if no specific field errors
                if (Object.keys(errors).length === 0) {
                    toast.error(t("auth.errors.general"));
                } else {
                    toast.error(t("auth.errors.invalidCredentials"));
                }

                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    return (
        <>
            <Head title={t("nav.signIn")} />
            <div
                className={`min-h-screen flex bg-background rtl ${
                    isRTL ? "rtl lang-ar" : "ltr lang-en"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
            >
                {/* Left Column - Decorative */}
                <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-primary/5 to-primary/20 overflow-hidden">
                    {/* Subtle Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)]" />

                    <div className="flex flex-col p-12">
                        <div className="relative z-10">
                            <Logo className="h-14 w-auto mb-8" />
                            <div className="max-w-md">
                                <h2 className="text-4xl font-bold mb-4">
                                    {t("auth.welcomeBack")}
                                </h2>
                                <p className="text-lg">
                                    {t("auth.loginDescription")}
                                </p>
                            </div>
                        </div>
                        <div className="mt-auto opacity-80 text-sm">
                            {t("register.rights", { year: new Date().getFullYear() })}
                        </div>
                    </div>
                </div>

                {/* Right Column - Form */}
                <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                    <div className="w-full max-w-md">
                        <div className="mb-10 text-center">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                {t("nav.signIn")}
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {t("auth.loginSubtitle")}
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 px-4 py-3 text-sm font-medium text-green-600 bg-green-50 rounded-md">
                                {status}
                            </div>
                        )}

                        <div className="relative">
                            {loading && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/70 rounded-lg">
                                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                </div>
                            )}

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t("forms.emailLabel")}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder={t("forms.emailPlaceholder")}
                                                        autoComplete="username"
                                                        autoFocus
                                                        disabled={loading}
                                                        className="h-11 text-base"
                                                        dir={isRTL ? "rtl" : "ltr"}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center justify-between">
                                                    <FormLabel>{t("forms.passwordLabel")}</FormLabel>
                                                
                                                </div>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="••••••••"
                                                            autoComplete="current-password"
                                                            disabled={loading}
                                                            className="h-11 text-base pr-10 rtl:pl-10 rtl:pr-3"
                                                            dir={isRTL ? "rtl" : "ltr"}
                                                            {...field}
                                                        />
                                                        <button
                                                            type="button"
                                                            tabIndex={-1}
                                                            aria-label={showPassword ? t("register.hide") : t("register.show")}
                                                            onClick={() => setShowPassword((v) => !v)}
                                                            className={`absolute top-1/2 -translate-y-1/2 ${
                                                                isRTL ? "left-2" : "right-2"
                                                            } text-muted-foreground focus:outline-none`}
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff className="w-5 h-5" />
                                                            ) : (
                                                                <Eye className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="remember"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        disabled={loading}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal me-2">
                                                    {t("auth.rememberMe")}
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full h-11 text-base font-medium"
                                        disabled={form.formState.isSubmitting || loading}
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                {t("auth.signingIn")}
                                            </span>
                                        ) : (
                                            t("nav.signIn")
                                        )}
                                    </Button>
                                </form>
                            </Form>

                            <div className="mt-6 text-center text-sm text-muted-foreground">
                                {t("auth.noAccount") + " "}
                                <Link
                                    href={route("register")}
                                    className="font-medium text-primary hover:underline"
                                >
                                    {t("auth.register")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}