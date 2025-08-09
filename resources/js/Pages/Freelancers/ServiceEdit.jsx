import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import FreelancerDashboardLayout from '@/Layouts/FreelancerDashboardLayout';
import ServiceForm from './ServiceForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ServiceEdit({ service, errors }) {
  const { t } = useTranslation();
  const [processing, setProcessing] = React.useState(false);

  function handleSubmit(data) {
    setProcessing(true);
    router.patch(route('freelancer.services.update', service.id), data, {
      onFinish: () => setProcessing(false),
    });
  }

  return (
    <FreelancerDashboardLayout>
      <Head title={t('freelancerServiceEdit.pageTitle', { title: service.title })} />
      <div className="w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t('freelancerServiceEdit.pageTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceForm 
              initialData={service} 
              onSubmit={handleSubmit} 
              errors={errors} 
              processing={processing} 
              submitLabel={t('freelancerServiceEdit.saveChanges')} 
            />
          </CardContent>
        </Card>
      </div>
    </FreelancerDashboardLayout>
  );
} 