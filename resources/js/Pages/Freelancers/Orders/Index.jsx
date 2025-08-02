import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import FreelancerDashboardLayout from '@/Layouts/FreelancerDashboardLayout';
import { toast } from 'sonner';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/Components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useLanguageChange } from '@/lib/useLanguageChange';
import {
  Plus,
  Search,
  DollarSign,
  ListChecks,
  Loader2,
  CheckCircle,
  ArrowUpDown,
  User,
  BadgeDollarSign,
  Calendar,
  MoreHorizontal,
  Play,
  Repeat,
  Send,
  Eye,
  TrendingUp,
  Clock,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/Components/ui/dropdown-menu';

const columnHelper = createColumnHelper();

export default function OrdersIndex({ orders, filters, auth, stats = {} }) {
  const { t } = useTranslation();
  const { isRTL } = useLanguageChange();

  // Unified state for shadcn/ui Data Table
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  // Add status change action handler
  const [processingId, setProcessingId] = useState(null);

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-SD', {
      style: 'currency',
      currency: 'SDG',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(
      isRTL ? 'ar-SD' : 'en-US',
      {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      }
    );
  };

  // Get status badge with proper styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        variant: 'secondary',
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        icon: Clock,
      },
      payment_verified: {
        variant: 'secondary',
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        icon: CheckCircle,
      },
      in_progress: {
        variant: 'secondary',
        className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        icon: Loader2,
      },
      review: {
        variant: 'secondary',
        className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        icon: Send,
      },
      completed: {
        variant: 'secondary',
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        icon: CheckCircle,
      },
      cancelled: {
        variant: 'secondary',
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.className}`}>
        <Icon className="w-3 h-3" />
        {t(`freelancerOrders.status.${status}`)}
      </Badge>
    );
  };

  // Get payment status badge
  const getPaymentStatusBadge = (paymentStatus) => {
    const paymentConfig = {
      pending: {
        variant: 'outline',
        className: 'text-yellow-600 border-yellow-600',
      },
      verified: {
        variant: 'outline',
        className: 'text-green-600 border-green-600',
      },
      failed: {
        variant: 'outline',
        className: 'text-red-600 border-red-600',
      },
    };

    const config = paymentConfig[paymentStatus] || paymentConfig.pending;

    return (
      <Badge variant={config.variant} className={config.className}>
        {t(`freelancerOrders.paymentStatus.${paymentStatus}`)}
      </Badge>
    );
  };

  // Check if order has available actions
  const getAvailableActions = (order) => {
    const actions = [];
    const { status, payment_status } = order;

    // Can start work if payment is verified
    if (status === 'payment_verified') {
      actions.push({
        key: 'in_progress',
        label: t('freelancerOrders.actions.markInProgress'),
        icon: Play,
        className: 'text-green-600',
      });
    }

    // Can deliver work if in progress
    if (status === 'in_progress') {
      actions.push({
        key: 'review',
        label: t('freelancerOrders.actions.deliverWork'),
        icon: Send,
        className: 'text-blue-600',
      });
    }

    // Can restart work if in review
    if (status === 'review') {
      actions.push({
        key: 'in_progress',
        label: t('freelancerOrders.actions.markInProgress'),
        icon: Repeat,
        className: 'text-orange-600',
      });
    }

    return actions;
  };

  const handleStatusChange = (orderId, status) => {
    setProcessingId(orderId + status);
    
    router.post(route('freelancer.orders.updateStatus', orderId), { status }, {
      onSuccess: () => {
        setProcessingId(null);
        toast.success(t('freelancerOrders.messages.statusUpdated'));
      },
      onError: (errors) => {
        setProcessingId(null);
        const errorMessage = errors.status || t('freelancerOrders.messages.updateFailed');
        toast.error(errorMessage);
      }
    });
  };

  // Define columns
  const columns = useMemo(() => [
    // Order Number
    columnHelper.accessor('order_number', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 p-0 font-semibold"
        >
          {t('freelancerOrders.table.orderNumber')}
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-semibold">{row.getValue('order_number')}</span>
      ),
    }),
    // Service
    columnHelper.accessor('service.title', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 p-0 font-semibold"
        >
          <ListChecks className="me-2 h-4 w-4" />
          {t('freelancerOrders.table.service')}
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>{row.original.service?.title}</span>
      ),
    }),
    // Client
    columnHelper.accessor('client.name', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 p-0 font-semibold"
        >
          <User className="me-2 h-4 w-4" />
          {t('freelancerOrders.table.client')}
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>{row.original.client?.name}</span>
      ),
    }),
    // Status
    columnHelper.accessor('status', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 p-0 font-semibold"
        >
          {t('freelancerOrders.table.status')}
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => getStatusBadge(row.getValue('status')),
    }),
    // Payment Status
    columnHelper.accessor('payment_status', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 p-0 font-semibold"
        >
          <BadgeDollarSign className="me-2 h-4 w-4" />
          {t('freelancerOrders.table.paymentStatus')}
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => getPaymentStatusBadge(row.getValue('payment_status')),
    }),
    // Created
    columnHelper.accessor('created_at', {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 p-0 font-semibold"
        >
          <Calendar className="me-2 h-4 w-4" />
          {t('freelancerOrders.table.created')}
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => formatDate(row.getValue('created_at')),
    }),
    // Actions
    columnHelper.display({
      id: 'actions',
      header: () => <span className="sr-only">{t('freelancerOrders.table.actions')}</span>,
      cell: ({ row }) => {
        const order = row.original;
        const availableActions = getAvailableActions(order);
        
        return (
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/freelancer/orders/${order.id}`}>
                <Eye className="me-2 h-4 w-4" />
                {t('freelancerOrders.table.view')}
              </Link>
            </Button>
            
            {availableActions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
              </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
                  {availableActions.map((action) => {
                    const Icon = action.icon;
                    return (
                  <DropdownMenuItem
                        key={action.key}
                        onClick={() => handleStatusChange(order.id, action.key)}
                        disabled={processingId === order.id + action.key}
                        className={action.className}
                      >
                        {processingId === order.id + action.key ? (
                          <Loader2 className="me-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Icon className="me-2 h-4 w-4" />
                        )}
                        {action.label}
                  </DropdownMenuItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            )}
          </div>
        );
      },
    }),
  ], [t, isRTL, processingId]);

  // Table instance
  const table = useReactTable({
    data: orders.data,
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
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <FreelancerDashboardLayout>
      <Head title={t('freelancerOrders.title')} />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('freelancerOrders.title')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('freelancerOrders.description')}
          </p>
        </div>
        <Button asChild className="flex items-center gap-2">
          <Link href={route('freelancer.services.create')}>
            <Plus className="h-4 w-4" />
            {t('freelancerOrders.addNewService')}
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('freelancerOrders.stats.totalEarnings')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(stats.totalEarnings || 0)}
                </p>
                {stats.earningsGrowth !== undefined && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stats.earningsGrowth > 0 ? (
                      <span className="text-green-600 flex items-center">
                        <TrendingUp className="w-3 h-3 me-1" />
                        +{stats.earningsGrowth}%
                      </span>
                    ) : stats.earningsGrowth === 100 ? (
                      <span className="text-green-600">
                        {t('freelancerOrders.stats.newEarnings')}
                      </span>
                    ) : (
                      <span className="text-gray-500">
                        {t('freelancerOrders.stats.noGrowth')}
                      </span>
                    )}
                  </p>
                )}
              </div>
              <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('freelancerOrders.stats.totalOrders')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalOrders || 0}
                </p>
              </div>
              <ListChecks className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('freelancerOrders.stats.inProgressOrders')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.inProgressOrders || 0}
                </p>
              </div>
              <Loader2 className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('freelancerOrders.stats.completedOrders')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.completedOrders || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('freelancerOrders.searchPlaceholder')}
                  value={globalFilter ?? ''}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  className="ps-10"
                />
              </div>
            </div>
            
            {/* Reset Filters Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setGlobalFilter('');
                setColumnFilters([]);
                setSorting([]);
                setColumnVisibility({});
                setRowSelection({});
              }}
            >
              {t('freelancerOrders.resetFilters')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('freelancerOrders.ordersList')}</span>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {table.getFilteredRowModel().rows.length} {t('freelancerOrders.of')} {orders.total} {t('freelancerOrders.results')}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="h-12">
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
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
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
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <ListChecks className="h-8 w-8 text-gray-400" />
                        <p className="text-gray-500 dark:text-gray-400">
                          {t('freelancerOrders.emptyState.title')}
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          {t('freelancerOrders.emptyState.description')}
                        </p>
                        <Button asChild variant="outline" size="sm">
                          <Link href={route('freelancer.services.create')}>
                            <Plus className="me-2 h-4 w-4" />
                            {t('freelancerOrders.emptyState.action')}
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
              {t('freelancerOrders.showing')} {table.getFilteredRowModel().rows.length} {t('freelancerOrders.of')} {orders.total} {t('freelancerOrders.results')}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {t('freelancerOrders.previous')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {t('freelancerOrders.next')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </FreelancerDashboardLayout>
  );
}
