import React from 'react';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import FreelancerDashboardLayout from '@/Layouts/FreelancerDashboardLayout';
import ServiceForm from './ServiceForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ServiceCreate({ errors }) {
  const { t } = useTranslation();
  const [processing, setProcessing] = React.useState(false);

  function handleSubmit(data) {
    setProcessing(true);
    router.post(route('freelancer.services.store'), data, {
      onFinish: () => setProcessing(false),
    });
  }

  return (
    <FreelancerDashboardLayout>
      <Head title={t('freelancerServiceCreate.pageTitle')} />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('freelancerServiceCreate.pageTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceForm 
              onSubmit={handleSubmit} 
              errors={errors} 
              processing={processing} 
              submitLabel={t('freelancerServiceCreate.createService')} 
            />
          </CardContent>
        </Card>
      </div>
    </FreelancerDashboardLayout>
  );
} 