import { Head, Link, router } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/Components/ui/select";
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
import { createRegisterSchema } from "@/lib/validations/auth";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import Logo from "@/Components/Logo";

export default function Register() {
    const { t, i18n } = useTranslation();
    const lang =
        i18n.language ||
        (typeof window !== "undefined" ? document.documentElement.lang : "en");
    const isRTL = lang === "ar";
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    // Create localized validation schema
    const registerSchema = createRegisterSchema(t);

    const valueProps = [
        {
            icon: (
                <svg
                    className="w-6 h-6 text-[hsl(var(--primary))]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            ),
            text: t("register.valueProps.0"),
        },
        {
            icon: (
                <svg
                    className="w-6 h-6 text-[hsl(var(--primary))]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3"
                    />
                </svg>
            ),
            text: t("register.valueProps.1"),
        },
        {
            icon: (
                <svg
                    className="w-6 h-6 text-[hsl(var(--primary))]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 17v-2a4 4 0 018 0v2"
                    />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            ),
            text: t("register.valueProps.2"),
        },
        {
            icon: (
                <svg
                    className="w-6 h-6 text-[hsl(var(--primary))]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7m-1 4V7a1 1 0 00-1-1h-3m-10 0H4a1 1 0 00-1 1v4"
                    />
                </svg>
            ),
            text: t("register.valueProps.3"),
        },
    ];

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            password_confirmation: "",
            role: "",
            terms: false,
        },
    });

    const onSubmit = async (values) => {
        setLoading(true);
        router.post(route("register"), values, {
            onSuccess: () => {
                toast.success(t("register.success.accountCreated"));
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
                    toast.error(t("register.errors.general"));
                } else {
                    toast.error(t("register.errors.server"));
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
            <Head title={t("register.title")} />
            <div
                className={`flex min-h-screen w-full items-stretch justify-center bg-background rtl ${
                    isRTL ? "rtl lang-ar" : "ltr lang-en"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
            >
                {/* Left column: Branding & Marketing */}
                <div className="hidden lg:flex flex-col flex-1 justify-between bg-gradient-to-br from-primary/40 p-12 relative">
                    {/* Subtle Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)]" />
                    <div>
                        <Logo className="h-14 w-auto mb-8" />
                        <h2 className="text-3xl font-bold mb-4">
                            {t("register.platformTitle")}
                        </h2>
                        <p className="text-lg mb-8 opacity-90">
                            {t("register.platformDesc")}
                        </p>
                    </div>
                    <div className="mt-12 opacity-80 text-sm">
                        {t("register.rights", {
                            year: new Date().getFullYear(),
                        })}
                    </div>
                </div>
                {/* Right column: Registration form */}
                <div className="flex-1 flex items-center justify-center bg-background">
                    <div className="w-full max-w-xl px-6 py-12">
                        <h1 className="text-3xl font-bold mb-2 text-[hsl(var(--primary))]">
                            {t("register.title")}
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            {t("register.subtitle")}
                        </p>
                        <div className="relative">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-6"
                                >
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t("register.fullName")}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder={t(
                                                            "register.fullNamePlaceholder"
                                                        )}
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
                                                    {t("register.emailLabel")}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder={t(
                                                            "register.emailPlaceholder"
                                                        )}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t("register.phoneLabel")}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="tel"
                                                        placeholder={t(
                                                            "register.phonePlaceholder"
                                                        )}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex gap-4">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem className="w-1/2">
                                                    <FormLabel>
                                                        {t("register.password")}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                dir={
                                                                    isRTL
                                                                        ? "rtl"
                                                                        : "ltr"
                                                                }
                                                                type={
                                                                    showPassword
                                                                        ? "text"
                                                                        : "password"
                                                                }
                                                                placeholder="••••••••"
                                                                autoComplete="new-password"
                                                                className="pr-10 rtl:pl-10 rtl:pr-3"
                                                                {...field}
                                                            />
                                                            <button
                                                                type="button"
                                                                tabIndex={-1}
                                                                aria-label={
                                                                    showPassword
                                                                        ? t(
                                                                              "register.hide"
                                                                          )
                                                                        : t(
                                                                              "register.show"
                                                                          )
                                                                }
                                                                onClick={() =>
                                                                    setShowPassword(
                                                                        (v) =>
                                                                            !v
                                                                    )
                                                                }
                                                                className={`absolute top-1/2 -translate-y-1/2 ${
                                                                    isRTL
                                                                        ? "left-2"
                                                                        : "right-2"
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
                                            name="password_confirmation"
                                            render={({ field }) => (
                                                <FormItem className="w-1/2">
                                                    <FormLabel>
                                                        {t(
                                                            "register.confirmPassword"
                                                        )}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type={
                                                                    showPasswordConfirm
                                                                        ? "text"
                                                                        : "password"
                                                                }
                                                                placeholder="••••••••"
                                                                autoComplete="new-password"
                                                                className="pr-10 rtl:pl-10 rtl:pr-3"
                                                                dir={
                                                                    isRTL
                                                                        ? "rtl"
                                                                        : "ltr"
                                                                }
                                                                {...field}
                                                            />
                                                            <button
                                                                type="button"
                                                                tabIndex={-1}
                                                                aria-label={
                                                                    showPasswordConfirm
                                                                        ? t(
                                                                              "register.hide"
                                                                          )
                                                                        : t(
                                                                              "register.show"
                                                                          )
                                                                }
                                                                onClick={() =>
                                                                    setShowPasswordConfirm(
                                                                        (v) =>
                                                                            !v
                                                                    )
                                                                }
                                                                className={`absolute top-1/2 -translate-y-1/2 ${
                                                                    isRTL
                                                                        ? "left-2"
                                                                        : "right-2"
                                                                } text-muted-foreground focus:outline-none`}
                                                            >
                                                                {showPasswordConfirm ? (
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
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t("register.roleLabel")}
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue=""
                                                    >
                                                        <SelectTrigger
                                                            dir={
                                                                isRTL
                                                                    ? "rtl"
                                                                    : "ltr"
                                                            }
                                                        >
                                                            <SelectValue
                                                                placeholder={t(
                                                                    "register.rolePlaceholder"
                                                                )}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent
                                                            dir={
                                                                isRTL
                                                                    ? "rtl"
                                                                    : "ltr"
                                                            }
                                                        >
                                                            <SelectItem value="client">
                                                                {t(
                                                                    "register.client"
                                                                )}
                                                            </SelectItem>
                                                            <SelectItem value="freelancer">
                                                                {t(
                                                                    "register.freelancer"
                                                                )}
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="terms"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center gap-2">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                        id="terms"
                                                    />
                                                </FormControl>
                                                <label
                                                    htmlFor="terms"
                                                    className="text-sm text-muted-foreground"
                                                >
                                                    {t("register.termsPrefix")}
                                                    <a
                                                        href="#"
                                                        className="underline text-[hsl(var(--primary))] hover:opacity-80"
                                                    >
                                                        {t("register.terms")}
                                                    </a>
                                                    {t("register.and")}
                                                    <a
                                                        href="#"
                                                        className="underline text-[hsl(var(--primary))] hover:opacity-80"
                                                    >
                                                        {t("register.privacy")}
                                                    </a>
                                                </label>
                                                <FormMessage className="blcok" />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="pt-4">
                                        <Button
                                            className="w-full py-3 text-base font-semibold bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90"
                                            disabled={
                                                form.formState.isSubmitting ||
                                                loading
                                            }
                                            type="submit"
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />{" "}
                                                    {t("register.registering")}
                                                </span>
                                            ) : form.formState.isSubmitting ? (
                                                t("register.registering")
                                            ) : (
                                                t("register.button")
                                            )}
                                        </Button>
                                    </div>
                                    <div className="text-center text-sm text-muted-foreground mt-2">
                                        {t("register.alreadyAccount") + " "}
                                        <Link
                                            href={route("login")}
                                            className="text-[hsl(var(--primary))] hover:underline font-medium"
                                        >
                                            {t("register.login")}
                                        </Link>
                                    </div>
                                </form>
                            </Form>
                            {loading && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 dark:bg-gray-900/70">
                                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
