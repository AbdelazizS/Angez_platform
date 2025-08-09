import React, { useRef, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  FileText,
  MessageSquare,
  Upload,
  Download,
  MoreVertical,
  Loader2,
  Star,
  ChevronRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ClientDashboardLayout from '@/Layouts/ClientDashboardLayout';
import ReviewForm from '@/components/ReviewForm';
import ReviewCard from '@/components/ReviewCard';
import { Label } from '@/components/ui/label';

export default function OrderShow({ order }) {
  const { t, i18n } = useTranslation();
  const { auth } = usePage().props;
  const [showUpload, setShowUpload] = useState(order.status === 'pending' && !order.payment_screenshot);
  const fileInputRef = useRef();
  const { data, setData, post, processing, errors, reset } = useForm({
    transaction_ref: '',
    payment_screenshot: null,
  });

  // Enhanced status configuration with modern styling
  const statusConfig = {
    completed: {
      variant: 'success',
      icon: <CheckCircle className="w-4 h-4" />,
      label: t('orders.status.completed'),
      className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
    },
    in_progress: {
      variant: 'info',
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      label: t('orders.status.in_progress'),
      className: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
    },
    review: {
      variant: 'warning',
      icon: <FileText className="w-4 h-4" />,
      label: t('orders.status.review'),
      className: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
    },
    payment_verified: {
      variant: 'success',
      icon: <CreditCard className="w-4 h-4" />,
      label: t('orders.status.payment_verified'),
      className: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
    },
    pending: {
      variant: 'pending',
      icon: <Clock className="w-4 h-4" />,
      label: t('orders.status.pending'),
      className: 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    },
    cancelled: {
      variant: 'destructive',
      icon: <XCircle className="w-4 h-4" />,
      label: t('orders.status.cancelled'),
      className: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
    }
  };

  const paymentStatusConfig = {
    verified: {
      variant: 'success',
      icon: <CheckCircle className="w-4 h-4" />,
      label: t('orders.paymentStatus.verified'),
      className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
    },
    pending: {
      variant: 'pending',
      icon: <Clock className="w-4 h-4" />,
      label: t('orders.paymentStatus.pending'),
      className: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
    },
    failed: {
      variant: 'destructive',
      icon: <XCircle className="w-4 h-4" />,
      label: t('orders.paymentStatus.failed'),
      className: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
    }
  };

  const handleFileChange = (e) => {
    setData('payment_screenshot', e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('client.orders.uploadPayment', order.id), {
      onSuccess: () => {
        reset();
        setShowUpload(false);
      },
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Modern status card component
  const StatusCard = ({ title, value, icon, className = '' }) => (
    <div className={`flex items-center p-4 rounded-lg border ${className}`}>
      <div className="flex-shrink-0 p-2 rounded-full bg-opacity-20">
        {icon}
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );

  return (
    <ClientDashboardLayout>
      <Head title={t('ordersDetails.title')} />
      
      {/* Modern header with breadcrumbs */}
      <div className="flex flex-col space-y-2 mb-6">
        <nav className="flex items-center text-sm text-muted-foreground">
          <Link href="/client/dashboard" className="hover:text-primary">
            {t('dashboard.title')}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/client/orders" className="hover:text-primary">
            {t('nav.orders')}
            </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-foreground">#{order.id}</span>
        </nav>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t('ordersDetails.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('ordersDetails.description')}
            </p>
        </div>
        <div className="flex items-center gap-2">
            {order.can_chat && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/chat?order=${order.id}`}>
                  <MessageSquare className="w-4 h-4 me-2" />
                  {t('nav.messages')}
            </Link>
              </Button>
            )}
            
          </div>
        </div>
      </div>

      {/* Status overview cards - Modern grid layout */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <StatusCard
          title={t('ordersDetails.status')}
          value={statusConfig[order.status]?.label}
          icon={statusConfig[order.status]?.icon}
          className={statusConfig[order.status]?.className}
        />
        <StatusCard
          title={t('ordersDetails.paymentStatus')}
          value={paymentStatusConfig[order.payment_status]?.label}
          icon={paymentStatusConfig[order.payment_status]?.icon}
          className={paymentStatusConfig[order.payment_status]?.className}
        />
        <StatusCard
          title={t('ordersDetails.totalAmount')}
          value={`${order.total_amount?.toLocaleString()} SDG`}
          icon={<CreditCard className="w-4 h-4" />}
          className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
        />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Order details card */}
        <Card className="md:col-span-2">
        <CardHeader>
            <CardTitle>{t('ordersDetails.orderDetails')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
            <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  {t('services.service')}
                </h4>
                <p className="font-medium mt-1">
                    {order.service?.title || '-'}
                </p>
                </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  {t('services.freelancer')}
                </h4>
                <p className="font-medium mt-1">
                    {order.freelancer?.name || '-'}
                </p>
                </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  {t('ordersDetails.placedOn')}
                </h4>
                <p className="font-medium mt-1">
                  {formatDate(order.created_at)}
                </p>
                </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  {t('ordersDetails.dueDate')}
                </h4>
                <p className="font-medium mt-1">
                    {order.due_date ? formatDate(order.due_date) : '-'}
                </p>
              </div>
            </div>

            {/* Payment proof section */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                {t('ordersDetails.paymentProof')}
              </h4>
                    {order.payment_screenshot ? (
                <Button variant="outline" asChild>
                        <a 
                          href={order.payment_screenshot} 
                          target="_blank" 
                          rel="noopener noreferrer"
                    className="flex items-center"
                        >
                    <FileText className="w-4 h-4 me-2" />
                    {t('ordersDetails.viewProof')}
                        </a>
                      </Button>
                    ) : (
                <div className="flex items-center text-sm text-muted-foreground">
                  <AlertTriangle className="w-4 h-4 me-2" />
                  {t('ordersDetails.notUploaded')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action sidebar */}
        <div className="space-y-4">
          {/* Payment upload card */}
          {order.status === 'pending' && !order.payment_screenshot && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t('ordersDetails.paymentRequired')}
                </CardTitle>
                <CardDescription>
                  {t('ordersDetails.uploadPaymentDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showUpload ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="transaction_ref">
                        {t('ordersDetails.transactionRef')}
                      </Label>
                    <Input
                        id="transaction_ref"
                      value={data.transaction_ref}
                      onChange={e => setData('transaction_ref', e.target.value)}
                      required
                    />
                  </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment_screenshot">
                        {t('ordersDetails.paymentScreenshot')}
                      </Label>
                    <Input
                        id="payment_screenshot"
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                    <Button type="submit" disabled={processing} className="w-full">
                    {processing ? (
                      <>
                          <Loader2 className="w-4 h-4 me-2 animate-spin" />
                          {t('ordersConfirmation.uploading')}
                      </>
                    ) : (
                        t('ordersDetails.uploadProof')
                    )}
                  </Button>
                  </form>
                ) : (
                  <Button 
                    onClick={() => setShowUpload(true)}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 me-2" />
                    {t('ordersDetails.uploadPayment')}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Review section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t('reviews.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!order.can_chat && (
                <div className="flex items-start p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400">
                  <AlertTriangle className="w-5 h-5 mt-0.5 me-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">{t('orders.chatClosedTitle')}</h4>
                    <p className="text-sm mt-1">{t('orders.chatClosed')}</p>
                  </div>
                </div>
              )}
              
              {order.can_review && (
                <ReviewForm 
                  orderId={order.id} 
                  onSuccess={() => window.location.reload()} 
                />
              )}
              
              {order.waiting_review && (
                <div className="flex items-start p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                  <Clock className="w-5 h-5 mt-0.5 me-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">{t('orders.reviewPendingTitle')}</h4>
                    <p className="text-sm mt-1">{t('orders.waitingForReview')}</p>
                  </div>
            </div>
          )}
              
              {order.review && (
                <ReviewCard review={order.review} />
          )}
        </CardContent>
      </Card>
        </div>
      </div>
    </ClientDashboardLayout>
  );
}