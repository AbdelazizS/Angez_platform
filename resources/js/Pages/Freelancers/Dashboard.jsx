import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import FreelancerDashboardLayout from '@/Layouts/FreelancerDashboardLayout';
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  Users, 
  Star, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowUpRight,
  Plus,
  Calendar,
  MessageSquare,
  BarChart3,
  Activity
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Dashboard({ stats, recentOrders, recentMessages, recentActivities, upcomingDeadlines }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || (typeof window !== 'undefined' ? document.documentElement.lang : 'en');
  const isRTL = lang === 'ar';

  const cards = [
    {
      title: t('dashboardFreelancer.cards.totalRevenue'),
      value: stats?.totalEarnings ? `${stats.totalEarnings.toLocaleString()}` : '0',
      currency: t('dashboardFreelancer.cards.currency'),
      description: stats?.earningsGrowth > 0 
        ? t('dashboardFreelancer.cards.revenueDesc', { percent: `${stats.earningsGrowth}%` })
        : stats?.earningsGrowth === 100 
        ? t('dashboardFreelancer.cards.revenueDescNew')
        : t('dashboardFreelancer.cards.revenueDescNoGrowth'),
      icon: DollarSign,
      trend: 'up',
      color: 'text-green-600'
    },
    {
      title: t('dashboardFreelancer.cards.activeOrders'),
      value: stats?.activeOrders || '0',
      description: t('dashboardFreelancer.cards.activeOrdersDesc', { count: stats?.pendingOrders || '0' }),
      icon: Package,
      trend: 'up',
      color: 'text-blue-600'
    },
    {
      title: t('dashboardFreelancer.cards.totalClients'),
      value: stats?.totalClients || '0',
      description: stats?.clientsGrowth > 0 
        ? t('dashboardFreelancer.cards.clientsDesc', { percent: `${stats.clientsGrowth}%` })
        : stats?.clientsGrowth === 100 
        ? t('dashboardFreelancer.cards.clientsDescNew')
        : t('dashboardFreelancer.cards.clientsDescNoGrowth'),
      icon: Users,
      trend: 'up',
      color: 'text-purple-600'
    },
    {
      title: t('dashboardFreelancer.cards.averageRating'),
      value: stats?.averageRating || '0',
      description: t('dashboardFreelancer.cards.ratingDesc', { count: stats?.totalReviews || '0' }),
      icon: Star,
      trend: 'up',
      color: 'text-yellow-600'
    }
  ];

  const quickActions = [
    {
      title: t('dashboardFreelancer.quickActions.createService.title'),
      description: t('dashboardFreelancer.quickActions.createService.desc'),
      icon: Plus,
      href: '/freelancer/services/create',
      color: 'bg-blue-500'
    },
    {
      title: t('dashboardFreelancer.quickActions.viewOrders.title'),
      description: t('dashboardFreelancer.quickActions.viewOrders.desc'),
      icon: Package,
      href: '/freelancer/orders',
      color: 'bg-green-500'
    },
    {
      title: t('dashboardFreelancer.quickActions.messages.title'),
      description: t('dashboardFreelancer.quickActions.messages.desc'),
      icon: MessageSquare,
      href: '/chat',
      color: 'bg-purple-500'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'unread':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'in_progress':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'review':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{t('dashboardFreelancer.recentActivities.status.completed')}</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">{t('dashboardFreelancer.recentActivities.status.pending')}</Badge>;
      case 'unread':
        return <Badge variant="destructive" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{t('dashboardFreelancer.recentActivities.status.unread')}</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">In Progress</Badge>;
      case 'review':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">In Review</Badge>;
      default:
        return <Badge variant="outline">{t('dashboardFreelancer.recentActivities.status.unknown')}</Badge>;
    }
  };

  return (
    <FreelancerDashboardLayout>
      <Head title={t('dashboardFreelancer.welcome', { name: stats?.userName || 'Freelancer' })} />
      
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('dashboardFreelancer.welcome', { name: stats?.userName || 'Freelancer' })}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('dashboardFreelancer.subtitle')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {cards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.value}
                {card.currency && <span className="text-sm font-normal text-muted-foreground ms-1">{card.currency}</span>}
              </div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {/* <TrendingUp className="h-3 w-3 me-1" /> */}
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
            <Link href={action.href} className="block">
              <CardContent className="p-6">
                <div className="flex items-center space-s-4 rtl:space-x-reverse">
                  <div className={`p-3 rounded-lg ${action.color} text-white me-2`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('dashboardFreelancer.recentActivities.title')}</CardTitle>
            <CardDescription>
              {t('dashboardFreelancer.recentActivities.desc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities && recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-s-4 rtl:space-x-reverse p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="flex-shrink-0 mt-1 me-2">
                      {getStatusIcon(activity.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                          {activity.title}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ms-2">
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>{t('dashboardFreelancer.recentActivities.noActivities', 'No recent activities')}</p>
                </div>
              )}
            </div>
            {/* <div className="mt-6">
              <Button variant="outline" className="w-full">
                {t('dashboardFreelancer.recentActivities.viewAll')}
              </Button>
            </div> */}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboardFreelancer.deadlines.title')}</CardTitle>
            <CardDescription>
              {t('dashboardFreelancer.deadlines.desc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines && upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-center space-s-4 rtl:space-x-reverse p-4 rounded-lg border border-border">
                    <div className="flex-shrink-0 me-2">
                      <Calendar className={`h-8 w-8 ${deadline.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {deadline.project}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {deadline.days}
                      </p>
                    </div>
                    <Badge variant={deadline.badgeVariant}>{deadline.badge}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>{t('dashboardFreelancer.deadlines.noDeadlines', 'No upcoming deadlines')}</p>
                </div>
              )}
            </div>
           
          </CardContent>
        </Card>
      </div>
    </FreelancerDashboardLayout>
  );
}
