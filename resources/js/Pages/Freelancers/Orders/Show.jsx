import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { 
  ArrowLeft, CheckCircle, Loader2, DollarSign, ListChecks, 
  User, BadgeDollarSign, Calendar, FileText, ClipboardList,
  Clock, AlertCircle, CheckCheck, CircleDollarSign, Globe,
  XCircle
} from 'lucide-react';
import FreelancerDashboardLayout from '@/Layouts/FreelancerDashboardLayout';
import { useTranslation } from 'react-i18next';
import { useLanguageChange } from '@/lib/useLanguageChange';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export default function OrderShow({ order, auth }) {
  const { t } = useTranslation();
  const { isRTL } = useLanguageChange();
  const [processing, setProcessing] = useState(false);

  // Formatting helpers
  const formatPrice = (price) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SD' : 'en-US', {
      style: 'currency',
      currency: 'SDG',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SD' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString(isRTL ? 'ar-SD' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Status configuration with fallbacks
  const getStatusConfig = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4" /> },
      payment_verified: { color: 'bg-blue-100 text-blue-800', icon: <CheckCircle className="h-4 w-4" /> },
      in_progress: { color: 'bg-primary/10 text-primary', icon: <Loader2 className="h-4 w-4 animate-spin" /> },
      review: { color: 'bg-purple-100 text-purple-800', icon: <AlertCircle className="h-4 w-4" /> },
      completed: { color: 'bg-green-100 text-green-800', icon: <CheckCheck className="h-4 w-4" /> },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4" /> }
    };
    return statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: <Clock className="h-4 w-4" /> };
  };

  const getPaymentStatusConfig = (paymentStatus) => {
    const paymentStatusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4" /> },
      paid: { color: 'bg-green-100 text-green-800', icon: <CheckCheck className="h-4 w-4" /> },
      failed: { color: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4" /> },
      refunded: { color: 'bg-gray-100 text-gray-800', icon: <CircleDollarSign className="h-4 w-4" /> }
    };
    return paymentStatusConfig[paymentStatus] || { color: 'bg-gray-100 text-gray-800', icon: <Clock className="h-4 w-4" /> };
  };

  const currentStatus = getStatusConfig(order?.status || 'pending');
  const currentPaymentStatus = getPaymentStatusConfig(order?.payment_status || 'pending');

  const handleDeliverWork = () => {
    if (!order?.id) return;
    
    setProcessing(true);
    router.post(`/freelancer/orders/${order.id}/deliver-work`, {}, {
      onSuccess: () => {
        toast.success(t('freelancerOrderShow.messages.workDelivered'));
        router.reload({ only: ['order'] });
      },
      onError: (errors) => {
        toast.error(errors.status || t('freelancerOrderShow.messages.deliveryFailed'));
      },
      onFinish: () => setProcessing(false)
    });
  };

  // Timeline events with null checks
  const orderEvents = [
    {
      date: order?.created_at,
      title: t('freelancerOrderShow.timeline.orderPlaced'),
      icon: <FileText className="h-4 w-4" />,
      active: true
    },
    {
      date: order?.payment_verified_at,
      title: t('freelancerOrderShow.timeline.paymentVerified'),
      icon: <CheckCircle className="h-4 w-4" />,
      active: order?.status !== 'pending'
    },
    {
      date: order?.started_at,
      title: t('freelancerOrderShow.timeline.workStarted'),
      icon: <Loader2 className="h-4 w-4" />,
      active: ['in_progress', 'review', 'completed'].includes(order?.status)
    },
    {
      date: order?.completed_at,
      title: t('freelancerOrderShow.timeline.orderCompleted'),
      icon: <CheckCheck className="h-4 w-4" />,
      active: order?.status === 'completed'
    }
  ].filter(event => event.date);

  // Early return if order is not available
  if (!order) {
    return (
      <FreelancerDashboardLayout breadcrumbs={[
        { label: t('freelancerOrderShow.backToOrders'), href: '/freelancer/orders' }
      ]}>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{t('freelancerOrderShow.orderNotFound')}</p>
        </div>
      </FreelancerDashboardLayout>
    );
  }

  return (
    <FreelancerDashboardLayout 
      breadcrumbs={[
        { label: t('freelancerOrderShow.backToOrders'), href: '/freelancer/orders' },
        { label: t('freelancerOrderShow.orderNumber', { number: order.order_number }) }
      ]}
    >
      <Head title={t('freelancerOrderShow.orderNumber', { number: order.order_number })} />

      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/freelancer/orders" 
            className={buttonVariants({ variant: 'outline', size: 'icon' })}
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t('freelancerOrderShow.orderNumber', { number: order.order_number })}
            </h1>
            <p className="text-muted-foreground">
              {formatDate(order.created_at)} • {order.service?.title || t('freelancerOrderShow.noService')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge className={`${currentStatus.color} gap-1`}>
            {currentStatus.icon}
            {t(`freelancerOrderShow.status.${order.status}`)}
          </Badge>
          <Badge className={`${currentPaymentStatus.color} gap-1`}>
            {currentPaymentStatus.icon}
            {t(`freelancerOrderShow.paymentStatus.${order.payment_status}`)}
          </Badge>
          {order.due_date && (
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-4 w-4" />
              {t('ordersConfirmation.dueDate')}: {formatDate(order.due_date)}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('freelancerOrderShow.orderSummary')}</CardTitle>
              <CardDescription>
                {t('freelancerOrderShow.orderPlacedOn')} {formatDateTime(order.created_at)}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('freelancerOrderShow.summary.client')}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={order.client?.avatar_url} 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <AvatarFallback>
                        {order.client?.name?.charAt(0) || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium">{order.client?.name || t('freelancerOrderShow.noClient')}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('freelancerOrderShow.summary.service')}</p>
                  <p className="font-medium mt-1">{order.service?.title || t('freelancerOrderShow.noService')}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('freelancerOrderShow.summary.package')}</span>
                  <span className="font-medium">{order.package_name || t('freelancerOrderShow.noPackage')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('freelancerOrderShow.summary.price')}</span>
                  <span className="font-medium">{formatPrice(order.package_price || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('freelancerOrderShow.summary.serviceFee')}</span>
                  <span className="font-medium">{formatPrice(order.service_fee || 0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('freelancerOrderShow.summary.total')}</span>
                  <span className="font-bold text-lg">{formatPrice(order.total_amount || 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Requirements Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  {t('freelancerOrderShow.summary.requirements')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(order.requirements) && order.requirements.length > 0 ? (
                  <ul className="space-y-2">
                    {order.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : order.requirements ? (
                  <p>{order.requirements}</p>
                ) : (
                  <p className="text-muted-foreground">{t('freelancerOrderShow.summary.noRequirements')}</p>
                )}
              </CardContent>
            </Card>

            {/* Notes Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t('freelancerOrderShow.summary.additionalNotes')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.additional_notes ? (
                  <p className="whitespace-pre-line">{order.additional_notes}</p>
                ) : (
                  <p className="text-muted-foreground">{t('freelancerOrderShow.summary.noNotes')}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Actions & Timeline */}
        <div className="space-y-6">
          {/* Order Events Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('freelancerOrderShow.orderHistory')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderEvents.length > 0 ? (
                orderEvents.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`flex items-center justify-center h-8 w-8 rounded-full ${event.active ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {event.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm ${event.active ? 'font-medium' : 'text-muted-foreground'}`}>
                          {event.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(event.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">{t('freelancerOrderShow.noEvents')}</p>
              )}
            </CardContent>
          </Card>

          {/* Client Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('freelancerOrderShow.clientInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={order.client?.avatar_url} 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <AvatarFallback>
                    {order.client?.name?.charAt(0) || <User className="h-5 w-5" />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{order.client?.name || t('freelancerOrderShow.noClient')}</p>
                  {order.client?.created_at && (
                    <p className="text-sm text-muted-foreground">
                      {t('freelancerOrderShow.memberSince')} {formatDate(order.client.created_at)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FreelancerDashboardLayout>
  );
}