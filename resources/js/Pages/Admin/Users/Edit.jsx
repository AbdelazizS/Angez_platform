import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function AdminUsersEdit({ user, roles }) {
  const { t } = useTranslation();
  
  const { data, setData, put, processing, errors } = useForm({
    name: user.name,
    email: user.email,
    phone: user.phone,
    password: '',
    password_confirmation: '',
    roles: user.roles?.map(r => r.role) || [],
    primary_role: user.primaryRole?.role || '',
    is_active: user.is_active,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('admin.users.update', user.id), {
      onSuccess: () => {
        toast.success(t('admin.users.updateSuccess'));
      },
      onError: () => {
        toast.error(t('admin.users.updateError'));
      },
    });
  };

  const handleRoleChange = (role) => {
    const newRoles = data.roles.includes(role)
      ? data.roles.filter(r => r !== role)
      : [...data.roles, role];
    
    setData('roles', newRoles);
    
    // If primary role is removed, clear it
    if (data.primary_role === role && !newRoles.includes(role)) {
      setData('primary_role', '');
    }
  };

  return (
    <AdminLayout>
      <Head title={t('admin.users.editTitle')} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t('admin.users.editTitle')}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {t('admin.users.editDescription')}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={route('admin.users.index')}>
              {t('common.back')}
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.users.userDetails')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('admin.users.name')}</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder={t('admin.users.namePlaceholder')}
                    error={errors.name}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('admin.users.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder={t('admin.users.emailPlaceholder')}
                    error={errors.email}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('admin.users.phone')}</Label>
                  <Input
                    id="phone"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    placeholder={t('admin.users.phonePlaceholder')}
                    error={errors.phone}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('admin.users.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder={t('admin.users.passwordPlaceholder')}
                    error={errors.password}
                    helperText={t('admin.users.passwordHelper')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">
                    {t('admin.users.confirmPassword')}
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    placeholder={t('admin.users.confirmPasswordPlaceholder')}
                    error={errors.password_confirmation}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('admin.users.roles')}</Label>
                  <div className="space-y-3">
                    {roles.map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={`role-${role}`}
                          checked={data.roles.includes(role)}
                          onCheckedChange={() => handleRoleChange(role)}
                        />
                        <Label htmlFor={`role-${role}`} className="font-normal">
                          {t(`admin.users.roles.${role}`)}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.roles && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.roles}
                    </p>
                  )}
                </div>

                {data.roles.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="primary_role">
                      {t('admin.users.primaryRole')}
                    </Label>
                    <Select
                      value={data.primary_role}
                      onValueChange={(value) => setData('primary_role', value)}
                      disabled={data.roles.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('admin.users.selectPrimaryRole')} />
                      </SelectTrigger>
                      <SelectContent>
                        {data.roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {t(`admin.users.roles.${role}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.primary_role && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.primary_role}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>{t('admin.users.status')}</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_active"
                      checked={data.is_active}
                      onCheckedChange={(checked) => setData('is_active', checked)}
                    />
                    <Label htmlFor="is_active" className="font-normal">
                      {t('admin.users.active')}
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" asChild>
                  <Link href={route('admin.users.index')}>
                    {t('common.cancel')}
                  </Link>
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? t('common.updating') : t('common.update')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}