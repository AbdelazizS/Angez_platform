import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/Components/ui/card";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Progress } from "@/Components/ui/progress";
import { Head, Link } from "@inertiajs/react";
import { useTranslation } from 'react-i18next';
import { useLanguageChange } from '@/lib/useLanguageChange';
import {
    DollarSign,
    TrendingUp,
    Package,
    Users,
    BarChart2,
    Briefcase,
    Settings,
    HelpCircle,
    ArrowUpRight,
    Plus,
    UserPlus,
    LogIn,
    Activity,
    CheckCircle,
    Clock,
    AlertCircle,
    ArrowUpDown,
    Star,
    Wallet,
    CreditCard,
    UserCheck,
    Zap,
    Target,
    Award,
    Calendar,
    Eye,
    MoreHorizontal
} from "lucide-react";

export default function Dashboard({
    stats = {},
    chartData = {},
    recentOrders = [],
    recentServices = [],
    recentUsers = [],
    topFreelancers = [],
    recentTransactions = [],
    auth,
}) {
    const { t } = useTranslation();
    const { isRTL } = useLanguageChange();

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat("ar-SD", {
            style: "currency",
            currency: "SDG",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const statusConfig = {
            'pending': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', text: t('admin.dashboard.status.pending', 'Pending') },
            'completed': { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', text: t('admin.dashboard.status.completed', 'Completed') },
            'cancelled': { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', text: t('admin.dashboard.status.cancelled', 'Cancelled') },
            'in_progress': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', text: t('admin.dashboard.status.inProgress', 'In Progress') },
        };
        
        const config = statusConfig[status] || statusConfig['pending'];
        return <Badge className={config.color}>{config.text}</Badge>;
    };

    // Stats cards
    const statsCards = [
        {
            title: t('admin.dashboard.stats.totalRevenue', 'Total Revenue'),
            value: formatPrice(stats.totalRevenue || 0),
            description: t('admin.dashboard.stats.revenueGrowth', '+{percent}% from last month', { percent: Math.floor(Math.random() * 20) + 5 }),
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-900/20"
        },
        {
            title: t('admin.dashboard.stats.totalOrders', 'Total Orders'),
            value: stats.totalOrders || 0,
            description: t('admin.dashboard.stats.ordersGrowth', '+{percent}% from last month', { percent: Math.floor(Math.random() * 15) + 3 }),
            icon: Package,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-900/20"
        },
        {
            title: t('admin.dashboard.stats.totalUsers', 'Total Users'),
            value: stats.totalUsers || 0,
            description: t('admin.dashboard.stats.usersGrowth', '+{percent}% from last month', { percent: Math.floor(Math.random() * 25) + 8 }),
            icon: Users,
            color: "text-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-900/20"
        },
        {
            title: t('admin.dashboard.stats.totalServices', 'Total Services'),
            value: stats.totalServices || 0,
            description: t('admin.dashboard.stats.currentlyActive', 'Currently active'),
            icon: Briefcase,
            color: "text-orange-600",
            bgColor: "bg-orange-50 dark:bg-orange-900/20"
        },
        {
            title: t('admin.dashboard.stats.pendingOrders', 'Pending Orders'),
            value: stats.pendingOrders || 0,
            description: t('admin.dashboard.stats.requireAttention', 'Require attention'),
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
        },
        {
            title: t('admin.dashboard.stats.totalWalletBalance', 'Wallet Balance'),
            value: formatPrice(stats.totalWalletBalance || 0),
            description: t('admin.dashboard.stats.totalPlatformBalance', 'Total platform balance'),
            icon: Wallet,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-900/20"
        }
    ];

    // Quick actions
    const quickActions = [
        {
            title: t('admin.dashboard.quickActions.manageUsers', 'Manage Users'),
            description: t('admin.dashboard.quickActions.manageUsersDesc', 'View and manage all users'),
            icon: UserPlus,
            href: "/admin/users",
            color: "bg-purple-500",
        },
    
        {
            title: t('admin.dashboard.quickActions.viewOrders', 'View Orders'),
            description: t('admin.dashboard.quickActions.viewOrdersDesc', 'See all platform orders'),
            icon: Package,
            href: "/admin/orders",
            color: "bg-green-500",
        },
        {
            title: t('admin.dashboard.quickActions.analytics', 'Analytics'),
            description: t('admin.dashboard.quickActions.analyticsDesc', 'Platform analytics'),
            icon: BarChart2,
            href: "/admin/analytics",
            color: "bg-orange-500",
        },
    ];

  return (
        <AdminLayout>
            <Head title={t('admin.dashboard.title', 'Admin Dashboard')} />
            <div className="p-6 space-y-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">
                        {t('admin.dashboard.welcome', { name: auth.user.name })}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {t('admin.dashboard.overview', 'Here\'s an overview of your platform\'s performance today.')}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    {statsCards.map((card, idx) => (
                        <Card key={idx} className="hover:shadow-lg transition-all duration-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {card.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                                    <card.icon className={`h-4 w-4 ${card.color}`} />
                                </div>
                </CardHeader>
                <CardContent>
                                <div className="text-2xl font-bold text-foreground">
                                    {card.value}
                                </div>
                                {/* <p className="text-xs text-muted-foreground flex items-center mt-1">
                                    <TrendingUp className="h-3 w-3 me-1" />
                                    {card.description}
                                </p> */}
                </CardContent>
              </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    {quickActions.map((action, idx) => (
                        <Card key={idx} className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
                            <Link href={action.href} className="block">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                        <div className={`p-3 rounded-lg ${action.color} text-white`}>
                                            <action.icon className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-foreground">
                                                {action.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {action.description}
                                            </p>
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                </CardContent>
                            </Link>
              </Card>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {/* Recent Orders */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                {t('admin.dashboard.sections.recentOrders', 'Recent Orders')}
                            </CardTitle>
                            <CardDescription>
                                {t('admin.dashboard.sections.recentOrdersDesc', 'Latest platform orders')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <Package className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">
                                                        #{order.id}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {order.service?.title || 'Service'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-foreground">
                                                    {formatPrice(order.total_amount)}
                                                </div>
                                                {getStatusBadge(order.status)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted-foreground py-8 text-center">
                                        {t('admin.dashboard.empty.noRecentOrders', 'No recent orders.')}
                                    </div>
                                )}
                            </div>
                            <div className="mt-4">
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/admin/orders">
                                        {t('admin.dashboard.actions.viewAll', 'View All')}
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Services */}
                    <Card className="lg:col-span-1">
                <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                {t('admin.dashboard.sections.recentServices', 'Recent Services')}
                            </CardTitle>
                            <CardDescription>
                                {t('admin.dashboard.sections.recentServicesDesc', 'Newly added services')}
                            </CardDescription>
                </CardHeader>
                <CardContent>
                            <div className="space-y-4">
                                {recentServices.length > 0 ? (
                                    recentServices.map((service) => (
                                        <div key={service.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                <Avatar className="w-8 h-8">
                                                    <AvatarImage src={service.user?.avatar} />
                                                    <AvatarFallback className="text-xs">
                                                        {service.user?.name?.charAt(0) || t('admin.dashboard.fallback.service', 'S')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground line-clamp-1">
                                                        {service.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {service.user?.name || t('admin.dashboard.fallback.freelancer', 'Freelancer')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-foreground">
                                                    {formatPrice(service.price)}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {formatDate(service.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted-foreground py-8 text-center">
                                        {t('admin.dashboard.empty.noRecentServices', 'No recent services.')}
                                    </div>
                                )}
                            </div>
                            <div className="mt-4">
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/admin/services">
                                        {t('admin.dashboard.actions.viewAll', 'View All')}
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Freelancers */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                {t('admin.dashboard.sections.topFreelancers', 'Top Freelancers')}
                            </CardTitle>
                            <CardDescription>
                                {t('admin.dashboard.sections.topFreelancersDesc', 'Best performing freelancers')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topFreelancers.length > 0 ? (
                                    topFreelancers.map((freelancer, index) => (
                                        <div key={freelancer.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                <div className="relative">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarImage src={freelancer.user?.avatar} />
                                                        <AvatarFallback className="text-xs">
                                                            {freelancer.user?.name?.charAt(0) || t('admin.dashboard.fallback.freelancer', 'F')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {index < 3 && (
                                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                                                            <span className="text-xs text-white font-bold">{index + 1}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">
                                                        {freelancer.user?.name || t('admin.dashboard.fallback.freelancer', 'Freelancer')}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {freelancer.title || t('admin.dashboard.fallback.professional', 'Professional')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                                    <span className="text-sm font-medium">
                                                        {freelancer.average_rating || 0}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {t('admin.dashboard.reviews.count', '{count} reviews', { count: freelancer.total_reviews || 0 })}
                                            </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted-foreground py-8 text-center">
                                        {t('admin.dashboard.empty.noTopFreelancers', 'No top freelancers.')}
            </div>
          )}
                            </div>
                            <div className="mt-4">
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/admin/users">
                                        {t('admin.dashboard.actions.viewAll', 'View All')}
                                    </Link>
                                </Button>
                            </div>
              </CardContent>
            </Card>
      </div>
    </div>
        </AdminLayout>
  );
} 
