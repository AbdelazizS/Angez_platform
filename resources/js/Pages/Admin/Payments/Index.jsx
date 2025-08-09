import React, { useState, useMemo, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/Layouts/AdminLayout";
import { toast } from "sonner";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useLanguageChange } from "@/lib/useLanguageChange";
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    BarChart2,
    TrendingUp,
    TrendingDown,
    Calendar,
    User,
    Package,
    Download,
    ChevronFirst,
    ChevronLeft,
    ChevronRight,
    ChevronLast,
    ArrowUpDown,
    AlertCircle,
    CheckSquare,
    Square,
    FileText,
    CreditCard,
    Shield,
    Zap,
    Image,
    ExternalLink,
} from "lucide-react";

const columnHelper = createColumnHelper();

export default function AdminPaymentsIndex({ 
    orders = {}, 
    stats = {}, 
    filters = {}, 
    filterOptions = {} 
}) {
    const { t } = useTranslation();
    const { isRTL } = useLanguageChange();

    // Ensure orders is always an array
    const ordersData = Array.isArray(orders) ? orders : (orders?.data || []);
    const isLoading = !ordersData || ordersData.length === 0;

    // Modal states
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [bulkActionModal, setBulkActionModal] = useState({
        isOpen: false,
        action: '',
        selectedIds: [],
    });

    // Table state
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(filters.search || "");
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // Update selected orders when rowSelection changes
    useEffect(() => {
        const selectedIds = Object.keys(rowSelection).map(index => {
            const rowIndex = parseInt(index);
            return ordersData[rowIndex]?.id;
        }).filter(Boolean);
        setBulkActionModal(prev => ({ ...prev, selectedIds }));
    }, [rowSelection, ordersData]);

    // Format price for display
    const formatPrice = (price) => {
        return new Intl.NumberFormat("ar-SD", {
            style: "currency",
            currency: "SDG",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price / 100); // Convert from cents
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(
            isRTL ? "ar-SD" : "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    // Get payment status badge
    const getPaymentStatusBadge = (status) => {
        const statusConfig = {
            pending: { 
                color: "bg-yellow-100 text-yellow-800 ho dark:bg-yellow-900 dark:text-yellow-200 hover:", 
                icon: Clock,
                text: t("admin.payments.status.pending", "Pending") 
            },
            verified: { 
                color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 ", 
                icon: CheckCircle,
                text: t("admin.payments.status.verified", "Verified") 
            },
            failed: { 
                color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", 
                icon: XCircle,
                text: t("admin.payments.status.failed", "Failed") 
            },
        };
        const config = statusConfig[status] || statusConfig["pending"];
        const IconComponent = config.icon;
        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <IconComponent className="w-3 h-3" />
                {config.text}
            </Badge>
        );
    };

    // Get order status badge
    const getOrderStatusBadge = (status) => {
        const statusConfig = {
            pending: { 
                color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200", 
                text: t("admin.payments.orderStatus.pending", "Pending") 
            },
            payment_verified: { 
                color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", 
                text: t("admin.payments.orderStatus.paymentVerified", "Payment Verified") 
            },
            in_progress: { 
                color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", 
                text: t("admin.payments.orderStatus.inProgress", "In Progress") 
            },
            review: { 
                color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", 
                text: t("admin.payments.orderStatus.review", "In Review") 
            },
            completed: { 
                color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", 
                text: t("admin.payments.orderStatus.completed", "Completed") 
            },
            cancelled: { 
                color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", 
                text: t("admin.payments.orderStatus.cancelled", "Cancelled") 
            },
            delivered: { 
                color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200", 
                text: t("admin.payments.orderStatus.delivered", "Delivered") 
            },
            revision_requested: { 
                color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200", 
                text: t("admin.payments.orderStatus.revisionRequested", "Revision Requested") 
            },
        };
        const config = statusConfig[status] || statusConfig["pending"];
        return <Badge className={config.color}>{config.text}</Badge>;
    };

    // Define columns
    const columns = useMemo(
        () => [
            // Selection column
            columnHelper.display({
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            }),

            // Order Number
            columnHelper.accessor("order_number", {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="h-8 p-0 font-semibold"
                    >
                        {t("admin.payments.table.orderNumber", "Order #")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="font-semibold text-foreground">
                        {row.getValue("order_number")}
                    </div>
                ),
            }),

            // Service
            columnHelper.accessor("service.title", {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="h-8 p-0 font-semibold"
                    >
                        <Package className="me-2 h-4 w-4" />
                        {t("admin.payments.table.service", "Service")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="text-sm text-muted-foreground">
                        {row.original.service?.title || t("admin.payments.fallback.service", "N/A")}
                    </div>
                ),
            }),

            // Client
            columnHelper.accessor("client.name", {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="h-8 p-0 font-semibold"
                    >
                        <User className="me-2 h-4 w-4" />
                        {t("admin.payments.table.client", "Client")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="text-sm text-muted-foreground">
                        {row.original.client?.name || t("admin.payments.fallback.client", "N/A")}
                    </div>
                ),
            }),

            // Freelancer
            columnHelper.accessor("freelancer.name", {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="h-8 p-0 font-semibold"
                    >
                        <User className="me-2 h-4 w-4" />
                        {t("admin.payments.table.freelancer", "Freelancer")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="text-sm text-muted-foreground">
                        {row.original.freelancer?.name || t("admin.payments.fallback.freelancer", "N/A")}
                    </div>
                ),
            }),

            // Amount
            columnHelper.accessor("total_amount", {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="h-8 p-0 font-semibold"
                    >
                        <DollarSign className="me-2 h-4 w-4" />
                        {t("admin.payments.table.amount", "Amount")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                        <DollarSign className="w-3 h-3 text-green-600" />
                        {formatPrice(row.getValue("total_amount"))}
                    </div>
                ),
            }),

            // Payment Status
            columnHelper.accessor("payment_status", {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="h-8 p-0 font-semibold"
                    >
                        <CreditCard className="me-2 h-4 w-4" />
                        {t("admin.payments.table.paymentStatus", "Payment")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => getPaymentStatusBadge(row.getValue("payment_status")),
            }),

            // Order Status
            columnHelper.accessor("status", {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="h-8 p-0 font-semibold"
                    >
                        <BarChart2 className="me-2 h-4 w-4" />
                        {t("admin.payments.table.orderStatus", "Status")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => getOrderStatusBadge(row.getValue("status")),
            }),

            // Created Date
            columnHelper.accessor("created_at", {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="h-8 p-0 font-semibold"
                    >
                        <Calendar className="me-2 h-4 w-4" />
                        {t("admin.payments.table.created", "Created")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="text-sm text-muted-foreground">
                        {formatDate(row.getValue("created_at"))}
                    </div>
                ),
            }),

            // Payment Proof
            columnHelper.accessor("payment_proof_url", {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        className="h-8 p-0 font-semibold"
                    >
                        <Image className="me-2 h-4 w-4" />
                        {t("admin.payments.table.paymentProof", "Proof")}
                    </Button>
                ),
                cell: ({ row }) => {
                    const hasProof = row.original.payment_proof_url;
                    return (
                        <div className="flex items-center gap-2">
                            {hasProof ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedOrder(row.original);
                                        setShowDetails(true);
                                    }}
                                    className="h-6 w-6 p-0"
                                    title={t("admin.payments.table.viewProof", "View Payment Proof")}
                                >
                                    <Image className="h-3 w-3 text-blue-600" />
                                </Button>
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    {t("admin.payments.table.noProof", "No Proof")}
                                </span>
                            )}
                        </div>
                    );
                },
            }),

            // Actions
            columnHelper.display({
                id: "actions",
                header: () => (
                    <span className="sr-only">{t("common.actions")}</span>
                ),
                cell: ({ row }) => {
                    const order = row.original;
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">
                                        {t("common.openMenu")}
                                    </span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align={isRTL ? "start" : "end"}
                                className="w-48"
                            >
                                <DropdownMenuLabel>
                                    {t("common.actions")}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setShowDetails(true);
                                    }}
                                    className="flex items-center"
                                >
                                    <Eye className="me-2 h-4 w-4" />
                                    {t("common.view")}
                                </DropdownMenuItem>
                                
                                {order.payment_status === 'pending' && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => handleApprovePayment(order)}
                                            className="flex items-center text-green-600 dark:text-green-400"
                                        >
                                            <CheckCircle className="me-2 h-4 w-4" />
                                            {t("admin.payments.actions.approve")}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleRejectPayment(order)}
                                            className="flex items-center text-red-600 dark:text-red-400"
                                        >
                                            <XCircle className="me-2 h-4 w-4" />
                                            {t("admin.payments.actions.reject")}
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            }),
        ],
        [t, isRTL]
    );

    // Table instance
    const table = useReactTable({
        data: ordersData || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            columnVisibility,
            rowSelection,
            pagination,
        },
    });

    // Handlers
    const handleApprovePayment = (order) => {
        router.post(route("admin.payments.approve", order.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(t("admin.payments.approveSuccess"));
            },
            onError: (errors) => {
                toast.error(errors.error || t("admin.payments.approveError"));
            },
        });
    };

    const handleRejectPayment = (order) => {
        router.post(route("admin.payments.reject", order.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(t("admin.payments.rejectSuccess"));
            },
            onError: (errors) => {
                toast.error(errors.error || t("admin.payments.rejectError"));
            },
        });
    };

    const handleBulkAction = () => {
        if (!bulkActionModal.action || bulkActionModal.selectedIds.length === 0) {
            toast.error(t("admin.payments.selectOrdersForBulkAction"));
            return;
        }

        const routeName = bulkActionModal.action === 'approve' 
            ? 'admin.payments.bulk-approve' 
            : 'admin.payments.bulk-reject';

        router.post(route(routeName), {
            order_ids: bulkActionModal.selectedIds,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setRowSelection({});
                setBulkActionModal({ isOpen: false, action: '', selectedIds: [] });
                toast.success(t(`admin.payments.bulk${bulkActionModal.action.charAt(0).toUpperCase() + bulkActionModal.action.slice(1)}Success`));
            },
            onError: (errors) => {
                toast.error(errors.error || t("admin.payments.bulkActionError"));
            },
        });
    };

    const handleExport = () => {
        const currentFilters = {
            payment_status: filters.payment_status,
            date_from: filters.date_from,
            date_to: filters.date_to,
        };
        
        router.get(route("admin.payments.export"), currentFilters, {
            preserveState: true,
        });
    };

    // Stats cards
    const statsCards = [
        {
            title: t('admin.payments.stats.totalOrders', 'Total Orders'),
            value: stats.total_orders || 0,
            icon: Package,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-900/20"
        },
        {
            title: t('admin.payments.stats.pendingPayments', 'Pending Payments'),
            value: stats.pending_payments || 0,
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
        },
        {
            title: t('admin.payments.stats.verifiedPayments', 'Verified Payments'),
            value: stats.verified_payments || 0,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-900/20"
        },
        {
            title: t('admin.payments.stats.totalRevenue', 'Total Revenue'),
            value: formatPrice(stats.total_revenue || 0),
            icon: DollarSign,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-900/20"
        },
        // {
        //     title: t('admin.payments.stats.monthlyRevenue', 'Monthly Revenue'),
        //     value: formatPrice(stats.monthly_revenue || 0),
        //     icon: TrendingUp,
        //     color: "text-purple-600",
        //     bgColor: "bg-purple-50 dark:bg-purple-900/20"
        // },
    ];

    return (
        <AdminLayout>
            <Head title={t("admin.payments.title")} />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        {t("admin.payments.title")}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {t("admin.payments.description")}
                    </p>
                </div>
                {/* <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        {t("admin.payments.export")}
                    </Button>
                </div> */}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-4 gap-6 mb-8">
                {statsCards.map((card, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition-all duration-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {card.title}
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {card.value}
                                    </p>
                                </div>
                                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                                    <card.icon className={`h-8 w-8 ${card.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters and Bulk Actions */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder={t("admin.payments.searchPlaceholder")}
                                    value={globalFilter ?? ""}
                                    onChange={(event) =>
                                        setGlobalFilter(event.target.value)
                                    }
                                    className="ps-10"
                                />
                            </div>
                            
                            <Select 
                                value={filters.payment_status || "all"} 
                                onValueChange={(value) => {
                                    router.get(route("admin.payments.index"), 
                                        { ...filters, payment_status: value === "all" ? "" : value }, 
                                        { preserveState: true }
                                    );
                                }}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder={t("admin.payments.filters.paymentStatus")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t("admin.payments.filters.allPaymentStatuses")}</SelectItem>
                                    {Object.entries(filterOptions.payment_statuses || {}).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>{value}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select 
                                value={filters.order_status || "all"} 
                                onValueChange={(value) => {
                                    router.get(route("admin.payments.index"), 
                                        { ...filters, order_status: value === "all" ? "" : value }, 
                                        { preserveState: true }
                                    );
                                }}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder={t("admin.payments.filters.orderStatus")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t("admin.payments.filters.allOrderStatuses")}</SelectItem>
                                    {Object.entries(filterOptions.order_statuses || {}).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>{value}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Bulk Actions */}
                        {bulkActionModal.selectedIds.length > 0 && (
                            <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="bg-primary/10 text-primary font-medium">
                                        {bulkActionModal.selectedIds.length} {t("admin.payments.selected")}
                                    </Badge>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => setRowSelection({})}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        {t("admin.payments.clearSelection")}
                                    </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select 
                                        value={bulkActionModal.action} 
                                        onValueChange={(value) => setBulkActionModal(prev => ({ ...prev, action: value }))}
                                    >
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder={t("admin.payments.bulkActions.select")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="approve">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                    {t("admin.payments.bulkActions.approve")}
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="reject">
                                                <div className="flex items-center gap-2">
                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                    {t("admin.payments.bulkActions.reject")}
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button 
                                        onClick={handleBulkAction} 
                                        size="sm" 
                                        className="bg-primary hover:bg-primary/90 text-white"
                                        disabled={!bulkActionModal.action}
                                    >
                                        {t("admin.payments.bulkActions.apply")}
                                    </Button>
                                </div>
                            </div>
                        )}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setGlobalFilter("");
                                setColumnFilters([]);
                                setSorting([]);
                                setColumnVisibility({});
                                setRowSelection({});
                                router.get(route("admin.payments.index"));
                            }}
                        >
                            {t("admin.payments.resetFilters")}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Data Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>{t("admin.payments.paymentsList")}</span>
                        <div className="flex items-center gap-4">
                            {bulkActionModal.selectedIds.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => {
                                            const allRows = table.getRowModel().rows;
                                            const allSelected = {};
                                            allRows.forEach((row, index) => {
                                                allSelected[index] = true;
                                            });
                                            setRowSelection(allSelected);
                                        }}
                                    >
                                        {t("admin.payments.selectAll")}
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setRowSelection({})}
                                    >
                                        {t("admin.payments.selectNone")}
                                    </Button>
                                </div>
                            )}
                            <div className="text-sm text-muted-foreground">
                                {table.getFilteredRowModel().rows.length}{" "}
                                {t("admin.payments.of")} {ordersData.length}{" "}
                                {t("admin.payments.payments")}
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border p-1">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                                <span className="ml-2 text-muted-foreground">
                                                    {t("admin.payments.loading")}
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : table.getRowModel().rows?.length ? (
                                    table
                                        .getRowModel()
                                        .rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={
                                                    row.getIsSelected() && "selected"
                                                }
                                            >
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <TableCell key={cell.id}>
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )}
                                                        </TableCell>
                                                    ))}
                                            </TableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            {t("admin.payments.noPaymentsFound")}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    
                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between space-x-2 py-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                            {t("admin.payments.pagination.showing")} {table.getFilteredRowModel().rows.length} {t("admin.payments.pagination.of")} {ordersData.length} {t("admin.payments.pagination.results")}
                        </div>
                        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-6 lg:space-x-reverse lg:space-x-8' : 'space-x-6 lg:space-x-8'}`}>
                            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                                <p className="text-sm font-medium">{t("admin.payments.pagination.rowsPerPage")}</p>
                                <Select
                                    value={`${table.getState().pagination.pageSize}`}
                                    onValueChange={(value) => {
                                        table.setPageSize(Number(value))
                                    }}
                                >
                                    <SelectTrigger className="h-8 w-[70px]">
                                        <SelectValue placeholder={table.getState().pagination.pageSize} />
                                    </SelectTrigger>
                                    <SelectContent side="top">
                                        {[10, 20, 30, 40, 50].map((pageSize) => (
                                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                                {pageSize}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                                {t("admin.payments.pagination.page")} {table.getState().pagination.pageIndex + 1} {t("admin.payments.pagination.of")} {table.getPageCount()}
                            </div>
                            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                                <Button
                                    variant="outline"
                                    className="hidden h-8 w-8 p-0 lg:flex"
                                    onClick={() => table.setPageIndex(0)}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <span className="sr-only">{t("admin.payments.pagination.goToFirst")}</span>
                                    <ChevronFirst className={`h-4 w-4  ${isRTL ? 'rotate-180' : ''}`} />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <span className="sr-only">{t("admin.payments.pagination.goToPrevious")}</span>
                                    <ChevronLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <span className="sr-only">{t("admin.payments.pagination.goToNext")}</span>
                                    <ChevronRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="hidden h-8 w-8 p-0 lg:flex"
                                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <span className="sr-only">{t("admin.payments.pagination.goToLast")}</span>
                                    <ChevronLast className={`h-4 w-4  ${isRTL ? 'rotate-180' : ''}`} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Order Details Modal */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{t("admin.payments.detailsTitle")}</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-muted-foreground">{t("admin.payments.details.orderNumber")}</div>
                                    <div className="font-semibold">{selectedOrder.order_number}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">{t("admin.payments.details.transactionRef")}</div>
                                    <div className="font-semibold">{selectedOrder.transaction_ref || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">{t("admin.payments.details.service")}</div>
                                    <div>{selectedOrder.service?.title || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">{t("admin.payments.details.amount")}</div>
                                    <div className="font-semibold">{formatPrice(selectedOrder.total_amount)}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">{t("admin.payments.details.client")}</div>
                                    <div>{selectedOrder.client?.name || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">{t("admin.payments.details.freelancer")}</div>
                                    <div>{selectedOrder.freelancer?.name || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">{t("admin.payments.details.paymentStatus")}</div>
                                    <div>{getPaymentStatusBadge(selectedOrder.payment_status)}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">{t("admin.payments.details.orderStatus")}</div>
                                    <div>{getOrderStatusBadge(selectedOrder.status)}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">{t("admin.payments.details.created")}</div>
                                    <div>{formatDate(selectedOrder.created_at)}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">{t("admin.payments.details.paymentVerified")}</div>
                                    <div>{selectedOrder.payment_verified_at ? formatDate(selectedOrder.payment_verified_at) : 'N/A'}</div>
                                </div>
                            </div>
                            
                            {selectedOrder.requirements && (
                                <div>
                                    <div className="text-sm text-muted-foreground mb-2">{t("admin.payments.details.requirements")}</div>
                                    <div className="bg-muted p-3 rounded-md text-sm">
                                        {selectedOrder.requirements}
                                    </div>
                                </div>
                            )}
                            
                            {selectedOrder.additional_notes && (
                                <div>
                                    <div className="text-sm text-muted-foreground mb-2">{t("admin.payments.details.additionalNotes")}</div>
                                    <div className="bg-muted p-3 rounded-md text-sm">
                                        {selectedOrder.additional_notes}
                                    </div>
                                </div>
                            )}
                            
                            {/* Payment Proof Section */}
                            {selectedOrder.payment_proof_url && (
                                <div>
                                    <div className="text-sm text-muted-foreground mb-2">{t("admin.payments.details.paymentProof")}</div>
                                    <div className="space-y-3">
                                        {/* Image Preview */}
                                        <div className="relative">
                                            <img
                                                src={selectedOrder.payment_proof_url}
                                                alt="Payment Proof"
                                                className="max-w-full max-h-64 rounded-lg border shadow-sm object-contain bg-gray-50"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />
                                            <div 
                                                className="hidden items-center justify-center max-h-64 rounded-lg border bg-gray-50 text-gray-500 text-sm"
                                                style={{ minHeight: '200px' }}
                                            >
                                                <div className="text-center">
                                                    <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                                    <p>{t("admin.payments.details.imageNotAvailable")}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Download and View Actions */}
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.open(selectedOrder.payment_proof_url, '_blank')}
                                                className="flex items-center gap-2"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                {t("admin.payments.details.viewFullSize")}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = selectedOrder.payment_proof_url;
                                                    link.download = `payment_proof_${selectedOrder.order_number}.jpg`;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                }}
                                                className="flex items-center gap-2"
                                            >
                                                <Download className="w-4 h-4" />
                                                {t("admin.payments.details.downloadProof")}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {!selectedOrder.payment_proof_url && (
                                <div>
                                    <div className="text-sm text-muted-foreground mb-2">{t("admin.payments.details.paymentProof")}</div>
                                    <div className="bg-muted p-3 rounded-md text-sm text-gray-500">
                                        {t("admin.payments.details.noPaymentProof")}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDetails(false)}>
                            {t("common.close")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
