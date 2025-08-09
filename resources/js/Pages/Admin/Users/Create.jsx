import { Head, Link, router } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminUsersCreate({ roles = [] }) {
  const { t, i18n } = useTranslation();
  const lang =
    i18n.language ||
    (typeof window !== "undefined" ? document.documentElement.lang : "en");
  const isRTL = lang === "ar";
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Localized validation schema
  const schema = z.object({
    name: z.string().min(2, t('admin.users.create.validation.name.min')).max(255, t('admin.users.create.validation.name.max')),
    email: z.string().email(t('admin.users.create.validation.email.invalid')).max(255, t('admin.users.create.validation.email.max')),
    phone: z.string().max(20, t('admin.users.create.validation.phone.max')).optional().or(z.literal('')),
    password: z.string().min(8, t('admin.users.create.validation.password.min')),
    password_confirmation: z.string(),
    role: z.string().min(1, t('admin.users.create.validation.role.required')),
    is_active: z.boolean().optional(),
  }).refine((data) => data.password === data.password_confirmation, {
    message: t('admin.users.create.validation.password_confirmation.mismatch'),
    path: ['password_confirmation'],
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
      role: '',
      is_active: true,
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    router.post(route('admin.users.store'), values, {
      onSuccess: () => {
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
        setLoading(false);
      },
      onFinish: () => setLoading(false),
    });
  };

  // Normalize roles data (handle both array of strings and array of objects)
  const normalizedRoles = Array.isArray(roles) 
    ? roles.map(role => typeof role === 'string' ? role : role.role || role)
    : [];

  return (
    <AdminLayout>
      <Head title={t('admin.users.create.title')} />
      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          {t('admin.users.create.title')}
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('admin.users.create.fields.name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('admin.users.create.fields.namePlaceholder')} {...field} />
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
                  <FormLabel>{t('admin.users.create.fields.email')}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t('admin.users.create.fields.emailPlaceholder')} {...field} />
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
                  <FormLabel>{t('admin.users.create.fields.phone')}</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder={t('admin.users.create.fields.phonePlaceholder')} {...field} />
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
                    <FormLabel>{t('admin.users.create.fields.password')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          dir={isRTL ? "rtl" : "ltr"}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="pr-10 rtl:pl-10 rtl:pr-3"
                          {...field}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          aria-label={showPassword ? t('admin.users.create.hide') : t('admin.users.create.show')}
                          onClick={() => setShowPassword((v) => !v)}
                          className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-2' : 'right-2'} text-muted-foreground focus:outline-none`}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                    <FormLabel>{t('admin.users.create.fields.password_confirmation')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPasswordConfirm ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="pr-10 rtl:pl-10 rtl:pr-3"
                          dir={isRTL ? "rtl" : "ltr"}
                          {...field}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          aria-label={showPasswordConfirm ? t('admin.users.create.hide') : t('admin.users.create.show')}
                          onClick={() => setShowPasswordConfirm((v) => !v)}
                          className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-2' : 'right-2'} text-muted-foreground focus:outline-none`}
                        >
                          {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                  <FormLabel>{t('admin.users.create.fields.role')}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="rtl">
                        <SelectValue placeholder={t('admin.users.create.fields.rolePlaceholder')} />
                      </SelectTrigger>
                      <SelectContent className="rtl">
                        {normalizedRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {t(`admin.users.roles.${role}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="is_active"
                    />
                  </FormControl>
                  <label htmlFor="is_active" className="text-sm text-muted-foreground">
                    {t('admin.users.create.fields.is_active')}
                  </label>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-4">
              <Button
                className="w-full py-3 text-base font-semibold bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90"
                disabled={form.formState.isSubmitting || loading}
                type="submit"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('admin.users.create.creating')}
                  </span>
                ) : form.formState.isSubmitting ? (
                  t('admin.users.create.creating')
                ) : (
                  t('admin.users.create.button')
                )}
              </Button>
            </div>
            <div className="text-center text-sm text-muted-foreground mt-2 text-primary hover:underline font-medium">
                {t('admin.users.create.backToList')}
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}