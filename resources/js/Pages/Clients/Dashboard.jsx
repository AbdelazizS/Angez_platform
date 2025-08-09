import { Head, Link } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowUpRight,
    Package,
    Users,
    DollarSign,
    MessageSquare,
    Search,
    Clock,
    CheckCircle,
    XCircle,
    ChevronRight,
    AlertCircle,
    Loader2,
    Plus,
    FileText,
    Calendar,
    CreditCard,
    Zap,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ClientDashboardLayout from "@/Layouts/ClientDashboardLayout";
import { useTranslation } from "react-i18next";
import { Progress } from "@/components/ui/progress";
import { route } from "ziggy-js";

export default function ClientDashboard({
    user,
    stats,
    recentOrders,
    quickActions,
}) {
    const { t, i18n } = useTranslation();
    // Format currency with SDG
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(
            i18n.language === "ar" ? "ar-EG" : "en-US",
            {
                style: "currency",
                currency: "SDG",
                minimumFractionDigits: 0,
            }
        ).format(amount);
    };
    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(
            i18n.language === "ar" ? "ar-EG" : "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );
    };
    // Status badge configuration (all statuses from migration)
    const statusConfig = {
        pending: {
            variant: "warning",
            icon: <Clock className="w-4 h-4 me-1" />,
            text: t("orders.status.pending", "Pending"),
        },
        payment_verified: {
            variant: "secondary",
            icon: <CreditCard className="w-4 h-4 me-1" />,
            text: t("orders.status.payment_verified", "Payment Verified"),
        },
        in_progress: {
            variant: "secondary",
            icon: <Loader2 className="w-4 h-4 me-1 animate-spin" />,
            text: t("orders.status.in_progress", "In Progress"),
        },
        review: {
            variant: "outline",
            icon: <FileText className="w-4 h-4 me-1" />,
            text: t("orders.status.review", "In Review"),
        },
        completed: {
            variant: "default",
            icon: <CheckCircle className="w-4 h-4 me-1" />,
            text: t("orders.status.completed", "Completed"),
        },
        cancelled: {
            variant: "destructive",
            icon: <XCircle className="w-4 h-4 me-1" />,
            text: t("orders.status.cancelled", "Cancelled"),
        },
    };

    // Localize quickActions from backend keys
    const localizedQuickActions = quickActions.map((action) => ({
        ...action,
        title: t(`dashboard.quickActions.${action.key}.title`),
        description: t(`dashboard.quickActions.${action.key}.description`),
    }));

    return (
        <ClientDashboardLayout>
            <Head title="Dashboard" />

            {/* Welcome Section with Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        {t("dashboard.welcome", "Welcome back")},{" "}
                        <span className="text-primary">
                            {user?.name || "Client"}
                        </span>
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {t(
                            "dashboard.orders_today",
                            "Here's what's happening with your orders today"
                        )}
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <Card className="hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("dashboard.active_orders", "Active Orders")}
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.activeOrders}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {t(
                                "dashboard.currently_in_progress",
                                "Currently in progress"
                            )}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t(
                                "dashboard.completed_orders",
                                "Completed Orders"
                            )}
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.completedOrders}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {t(
                                "dashboard.all_time_completed",
                                "All time completed"
                            )}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("dashboard.total_spent", "Total Spent")}
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(stats.totalSpent)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {t(
                                "dashboard.across_all_orders",
                                "Across all orders"
                            )}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {localizedQuickActions.map((action, idx) => (
                    <Card
                        key={idx}
                        className="group hover:shadow-md transition-all"
                    >
                        <Link href={action.href} className="block">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`p-3 rounded-lg ${
                                            action.key === "find_services"
                                                ? "bg-blue-100 text-blue-600"
                                                : action.key === "my_orders"
                                                ? "bg-purple-100 text-purple-600"
                                                : "bg-green-100 text-green-600"
                                        }`}
                                    >
                                        {action.key === "find_services" && (
                                            <Search className="h-5 w-5" />
                                        )}
                                        {action.key === "my_orders" && (
                                            <Package className="h-5 w-5" />
                                        )}
                                        {action.key === "messages" && (
                                            <MessageSquare className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
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

            {/* Recent Orders */}
            <Card className="mb-8">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>
                                {t("dashboard.recent_orders", "Recent Orders")}
                            </CardTitle>
                            <CardDescription>
                                {t(
                                    "dashboard.latest_transactions_status",
                                    "Your latest transactions and their status"
                                )}
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={'/client/orders'}>
                                {t(
                                    "dashboard.view_all_orders",
                                    "View all orders"
                                )}
                                <ChevronRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {recentOrders.length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="">
                                            {t("dashboard.service", "Service")}
                                        </TableHead>
                                        <TableHead>
                                            {t(
                                                "dashboard.freelancer",
                                                "Freelancer"
                                            )}
                                        </TableHead>
                                        <TableHead className="">
                                            {t("dashboard.amount", "Amount")}
                                        </TableHead>
                                        <TableHead>
                                            {t("dashboard.status", "Status")}
                                        </TableHead>
                                        <TableHead className="">
                                            {t("dashboard.date", "Date")}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentOrders.map((order) => (
                                        <TableRow
                                            key={order.id}
                                            className="hover:bg-muted/50"
                                        >
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={route(
                                                        "orders.show",
                                                        order.id
                                                    )}
                                                    className="hover:text-primary hover:underline"
                                                >
                                                    {order.service}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    href={route(
                                                        "freelancers.show",
                                                        order.freelancer_id
                                                    )}
                                                    className="hover:text-primary hover:underline"
                                                >
                                                    {order.freelancer}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="">
                                                {formatCurrency(order.amount)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        statusConfig[
                                                            order.status
                                                        ]?.variant || "outline"
                                                    }
                                                >
                                                    {
                                                        statusConfig[
                                                            order.status
                                                        ]?.icon
                                                    }
                                                    {statusConfig[order.status]
                                                        ?.text || order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="">
                                                {formatDate(order.date)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                                {t("dashboard.no_orders_yet", "No orders yet")}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {t(
                                    "dashboard.get_started_first_order",
                                    "Get started by placing your first order"
                                )}
                            </p>
                            <Button asChild>
                                <Link href={route("services.index")}>
                                    <Search className="w-4 h-4 me-2" />
                                    {t(
                                        "dashboard.browse_services",
                                        "Browse Services"
                                    )}
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
                {recentOrders.length > 0 && (
                    <CardFooter className="flex justify-center border-t p-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={'/client/orders'}>
                                {t(
                                    "dashboard.view_all_orders",
                                    "View all orders"
                                )}
                                <ChevronRight className="w-4 h-4 ms-2 rtl:rotate-180" />
                            </Link>
                        </Button>
                    </CardFooter>
                )}
            </Card>

            {/* Performance Metrics */}
            <div className="grid gap-4 md:grid-cols-2 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t(
                                "dashboard.order_status_distribution",
                                "Order Status Distribution"
                            )}
                        </CardTitle>
                        <CardDescription>
                            {t(
                                "dashboard.breakdown_orders_status",
                                "Breakdown of your orders by status"
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.orderStatusDistribution &&
                        Object.keys(stats.orderStatusDistribution).length >
                            0 ? (
                            <div className="space-y-4">
                                {Object.entries(
                                    stats.orderStatusDistribution
                                ).map(([status, count]) => (
                                    <div key={status} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                {statusConfig[status]?.icon}
                                                <span className="ml-2 text-sm font-medium">
                                                    {statusConfig[status]
                                                        ?.text || status}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium">
                                                {count}
                                            </span>
                                        </div>
                                        <Progress
                                            value={
                                                (count / stats.totalOrders) *
                                                100
                                            }
                                            className="h-2"
                                            indicatorClassName={
                                                status === "completed"
                                                    ? "bg-green-500"
                                                    : status === "in_progress"
                                                    ? "bg-blue-500"
                                                    : status === "pending"
                                                    ? "bg-yellow-500"
                                                    : "bg-gray-500"
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <AlertCircle className="w-10 h-10 text-muted-foreground mb-4" />
                                <p className="text-sm text-muted-foreground">
                                    {t(
                                        "dashboard.no_order_data_available",
                                        "No order data available"
                                    )}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t("dashboard.recent_activity", "Recent Activity")}
                        </CardTitle>
                        <CardDescription>
                            {t(
                                "dashboard.latest_account_updates",
                                "Latest updates on your account"
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.recentActivity &&
                        stats.recentActivity.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recentActivity.map((activity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            {activity.type === "order" && (
                                                <Package className="h-4 w-4 text-blue-500" />
                                            )}
                                            {activity.type === "message" && (
                                                <MessageSquare className="h-4 w-4 text-green-500" />
                                            )}
                                            {activity.type === "payment" && (
                                                <DollarSign className="h-4 w-4 text-purple-500" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                {activity.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {activity.description}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatDate(activity.date)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Clock className="w-10 h-10 text-muted-foreground mb-4" />
                                <p className="text-sm text-muted-foreground">
                                    {t(
                                        "dashboard.no_recent_activity",
                                        "No recent activity"
                                    )}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </ClientDashboardLayout>
    );
}
