import React, { useState, useMemo, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import AdminLayout from "@/Layouts/AdminLayout";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
    TableCell,
} from "@/Components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/Components/ui/dialog";
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
    Eye,
    Search,
    ArrowUpDown,
    User,
    ListChecks,
    BadgeDollarSign,
    Calendar,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    Clock,
    Package,
    BarChart2,
    DollarSign,
    Trash2,
    ChevronFirst,
    ChevronLeft,
    ChevronRight,
    ChevronLast,
} from "lucide-react";

const columnHelper = createColumnHelper();

export default function AdminOrdersIndex({ orders = {}, stats = {} }) {
    const { t } = useTranslation();
    const { isRTL } = useLanguageChange();

    // Defensive: always array
    const ordersData = Array.isArray(orders) ? orders : (orders?.data || []);
    const isLoading = !ordersData || ordersData.length === 0;

    // Modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

    // Filters
  const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");

    // Table state
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    // Filtered data
    const filteredOrders = useMemo(() => {
        let filtered = ordersData;
        if (search) {
            filtered = filtered.filter(
          (order) =>
            order.order_number?.toLowerCase().includes(search.toLowerCase()) ||
            order.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
            order.freelancer?.name?.toLowerCase().includes(search.toLowerCase()) ||
            order.service?.title?.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (statusFilter !== "all") {
            filtered = filtered.filter((order) => order.status === statusFilter);
        }
        if (paymentFilter !== "all") {
            filtered = filtered.filter((order) => order.payment_status === paymentFilter);
        }
        return filtered;
    }, [ordersData, search, statusFilter, paymentFilter]);

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
        return new Date(date).toLocaleDateString(isRTL ? "ar-SD" : "en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Status badge
    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", text: t("admin.orders.status.pending", "Pending") },
            completed: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", text: t("admin.orders.status.completed", "Completed") },
            cancelled: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", text: t("admin.orders.status.cancelled", "Cancelled") },
            in_progress: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", text: t("admin.orders.status.inProgress", "In Progress") },
        };
        const config = statusConfig[status] || statusConfig["pending"];
        return <Badge className={config.color}>{config.text}</Badge>;
    };

    // Payment badge
    const getPaymentBadge = (status) => {
        const paymentConfig = {
            paid: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", text: t("admin.orders.payment.paid", "Paid") },
            unpaid: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", text: t("admin.orders.payment.unpaid", "Unpaid") },
            pending: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", text: t("admin.orders.payment.pending", "Pending") },
        };
        const config = paymentConfig[status] || paymentConfig["pending"];
        return <Badge className={config.color}>{config.text}</Badge>;
    };

    // Columns
  const columns = useMemo(() => [
        columnHelper.accessor("order_number", {
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 p-0 font-semibold">
          # <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
            cell: ({ row }) => <span className="font-semibold">{row.original.order_number}</span>,
        }),
        columnHelper.accessor("service.title", {
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 p-0 font-semibold">
                    <ListChecks className="mr-2 h-4 w-4" />{t("admin.orders.table.service", "Service")} <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => row.original.service?.title,
        }),
        columnHelper.accessor("client.name", {
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 p-0 font-semibold">
                    <User className="mr-2 h-4 w-4" />{t("admin.orders.table.client", "Client")} <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => row.original.client?.name,
        }),
        columnHelper.accessor("freelancer.name", {
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 p-0 font-semibold">
                    <User className="mr-2 h-4 w-4" />{t("admin.orders.table.freelancer", "Freelancer")} <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => row.original.freelancer?.name,
        }),
        columnHelper.accessor("status", {
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 p-0 font-semibold">
                    {t("admin.orders.table.status", "Status")} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
            cell: ({ row }) => getStatusBadge(row.original.status),
        }),
        columnHelper.accessor("payment_status", {
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 p-0 font-semibold">
                    <BadgeDollarSign className="mr-2 h-4 w-4" />{t("admin.orders.table.payment", "Payment")} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
            cell: ({ row }) => getPaymentBadge(row.original.payment_status),
        }),
        columnHelper.accessor("created_at", {
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 p-0 font-semibold">
                    <Calendar className="mr-2 h-4 w-4" />{t("admin.orders.table.created", "Created")} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
            cell: ({ row }) => formatDate(row.original.created_at),
        }),
        columnHelper.display({
            id: "actions",
            header: () => <span className="sr-only">{t("common.actions")}</span>,
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">{t("common.openMenu")}</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-40">
                        <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => { setSelectedOrder(row.original); setShowDetails(true); }}>
                            <Eye className="me-2 h-4 w-4" />{t("common.view")}
                        </DropdownMenuItem>
                        {/* Add more admin actions here if needed */}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        }),
    ], [t, isRTL]);

    // Table instance
    const table = useReactTable({
        data: filteredOrders,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        state: {
            sorting,
            pagination,
        },
    });

    // Stats cards
    const statsCards = [
        {
            title: t('admin.orders.stats.totalOrders', 'Total Orders'),
            value: stats.total_orders || 0,
            icon: Package,
            color: "text-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-900/20"
        },
        {
            title: t('admin.orders.stats.completedOrders', 'Completed'),
            value: stats.completed_orders || 0,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-900/20"
        },
        {
            title: t('admin.orders.stats.pendingOrders', 'Pending'),
            value: stats.pending_orders || 0,
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
        },
        {
            title: t('admin.orders.stats.cancelledOrders', 'Cancelled'),
            value: stats.cancelled_orders || 0,
            icon: XCircle,
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-900/20"
        },
        {
            title: t('admin.orders.stats.totalRevenue', 'Total Revenue'),
            value: formatPrice(stats.total_revenue || 0),
            icon: DollarSign,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-900/20"
        },
    ];

  return (
    <AdminLayout>
            <Head title={t('admin.orders.title', 'Orders Management')} />
            <div className="p-6 space-y-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">
                        {t('admin.orders.title', 'Orders Management')}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {t('admin.orders.description', 'View and manage all orders on the platform.')}
                    </p>
                </div>
                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
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
                            </CardContent>
                        </Card>
                    ))}
        </div>
               
        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
                            <span>{t('admin.orders.ordersList', 'Orders List')}</span>
                            <div className="text-sm text-muted-foreground">
                                {table.getFilteredRowModel().rows.length} {t('admin.orders.results', 'results')}
                            </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                  <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                                    <span className="ml-2 text-muted-foreground">{t('admin.orders.loading', 'Loading orders...')}</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow key={row.id}>
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                    ))}
                  </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                                {t('admin.orders.noOrdersFound', 'No orders found.')}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
              </Table>
            </div>
                        {/* Pagination Controls */}
                        <div className="flex items-center justify-between space-x-2 py-4">
                            <div className="flex-1 text-sm text-muted-foreground">
                                {t('admin.orders.pagination.showing', 'Showing')} {table.getFilteredRowModel().rows.length} {t('admin.orders.pagination.of', 'of')} {ordersData.length} {t('admin.orders.pagination.results', 'results')}
                            </div>
                            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-6 lg:space-x-reverse lg:space-x-8' : 'space-x-6 lg:space-x-8'}`}>
                                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                                    <p className="text-sm font-medium">{t('admin.orders.pagination.rowsPerPage', 'Rows per page')}</p>
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
                                    {t('admin.orders.pagination.page', 'Page')} {table.getState().pagination.pageIndex + 1} {t('admin.orders.pagination.of', 'of')} {table.getPageCount()}
                                </div>
                                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                                    <Button
                                        variant="outline"
                                        className="hidden h-8 w-8 p-0 lg:flex"
                                        onClick={() => table.setPageIndex(0)}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <span className="sr-only">{t('admin.orders.pagination.goToFirst', 'Go to first page')}</span>
                                        <ChevronFirst className={`h-4 w-4  ${isRTL ? 'rotate-180' : ''}`} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-8 w-8 p-0"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <span className="sr-only">{t('admin.orders.pagination.goToPrevious', 'Go to previous page')}</span>
                                        <ChevronLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-8 w-8 p-0"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <span className="sr-only">{t('admin.orders.pagination.goToNext', 'Go to next page')}</span>
                                        <ChevronRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="hidden h-8 w-8 p-0 lg:flex"
                                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <span className="sr-only">{t('admin.orders.pagination.goToLast', 'Go to last page')}</span>
                                        <ChevronLast className={`h-4 w-4  ${isRTL ? 'rotate-180' : ''}`} />
                                    </Button>
                                </div>
                            </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
                        <DialogTitle>{t('admin.orders.detailsTitle', 'Order Details')}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                                <div className="text-sm text-muted-foreground">{t('admin.orders.details.orderNumber', 'Order #')}</div>
                <div className="font-semibold">{selectedOrder.order_number}</div>
              </div>
              <div>
                                <div className="text-sm text-muted-foreground">{t('admin.orders.details.service', 'Service')}</div>
                <div>{selectedOrder.service?.title}</div>
              </div>
              <div>
                                <div className="text-sm text-muted-foreground">{t('admin.orders.details.client', 'Client')}</div>
                <div>{selectedOrder.client?.name}</div>
              </div>
              <div>
                                <div className="text-sm text-muted-foreground">{t('admin.orders.details.freelancer', 'Freelancer')}</div>
                <div>{selectedOrder.freelancer?.name}</div>
              </div>
              <div>
                                <div className="text-sm text-muted-foreground">{t('admin.orders.details.status', 'Status')}</div>
                                <div className="capitalize">{getStatusBadge(selectedOrder.status)}</div>
              </div>
              <div>
                                <div className="text-sm text-muted-foreground">{t('admin.orders.details.paymentStatus', 'Payment Status')}</div>
                                <div className="capitalize">{getPaymentBadge(selectedOrder.payment_status)}</div>
              </div>
              <div>
                                <div className="text-sm text-muted-foreground">{t('admin.orders.details.created', 'Created')}</div>
                                <div>{formatDate(selectedOrder.created_at)}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
                            <Button variant="outline">{t('common.close', 'Close')}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
} 