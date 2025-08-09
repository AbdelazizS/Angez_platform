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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Lock,
  Unlock,
  MoreHorizontal,
  User,
  DollarSign,
  Download,
  CheckCircle,
  XCircle,
  Banknote,
  Image,
  ChevronFirst,
  ChevronLeft,
  ChevronRight,
  ChevronLast,
  ArrowUpDown,
  Eye,
  Plus,
  Minus,
  Calendar,
  Clock,
  FileText,
  CreditCard,
} from "lucide-react";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

const columnHelper = createColumnHelper();

export default function AdminWalletIndex({ wallets = {}, pendingPayouts = {} }) {
  const { t } = useTranslation();
  // Data preparation
  
  
  const lang =
  i18n.language ||
  (typeof window !== "undefined" ? document.documentElement.lang : "en");
const isRTL = lang === "ar";



  const walletsData = Array.isArray(wallets) ? wallets : (wallets?.data || []);
  const payoutsData = Array.isArray(pendingPayouts) ? pendingPayouts : (pendingPayouts?.data || []);

  // Modal states
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [showViewPayoutModal, setShowViewPayoutModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  // Form states
  const [manualForm, setManualForm] = useState({ 
    user_id: "", 
    type: "credit", 
    amount: "", 
    reason: "" 
  });
  const [approveForm, setApproveForm] = useState({ 
    reference_number: "", 
    payment_screenshot: null, 
    notes: "" 
  });
  const [rejectForm, setRejectForm] = useState({ 
    rejection_reason: "" 
  });

  // Table states
  const [walletRowSelection, setWalletRowSelection] = useState({});
  const [walletPagination, setWalletPagination] = useState({ 
    pageIndex: 0, 
    pageSize: 10 
  });
  const [walletSorting, setWalletSorting] = useState([]);
  
  const [payoutPagination, setPayoutPagination] = useState({ 
    pageIndex: 0, 
    pageSize: 10 
  });
  const [payoutSorting, setPayoutSorting] = useState([]);

  // Bulk selection
  const bulkSelectedIds = useMemo(() => {
    return Object.keys(walletRowSelection).map(index => {
      const rowIndex = parseInt(index);
      return walletsData[rowIndex]?.id;
    }).filter(Boolean);
  }, [walletRowSelection, walletsData]);

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
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Status badges
  const getWalletStatusBadge = (isLocked) => {
    return isLocked ? (
      <Badge variant="destructive" className="flex items-center gap-1">
        <Lock className="ms-2 h-3 w-3" />
        {t('admin.wallet.status.locked')}
      </Badge>
    ) : (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Unlock className="ms-2 h-3 w-3" />
        {t('admin.wallet.status.active')}
      </Badge>
    );
  };

  const getPayoutStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-800", 
        icon: Clock,
        text: t('admin.payout.status.pending') 
      },
      paid: { 
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800", 
        icon: CheckCircle,
        text: t('admin.payout.status.paid') 
      },
      payout_paid: { 
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800", 
        icon: CheckCircle,
        text: t('admin.payout.status.paid') 
      },
      rejected: { 
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800", 
        icon: XCircle,
        text: t('admin.payout.status.rejected') 
      },
      payout_rejected: { 
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800", 
        icon: XCircle,
        text: t('admin.payout.status.rejected') 
      },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="ms-2 h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  // Wallets table columns
  const walletColumns = useMemo(() => [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('common.selectAll')}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('common.selectRow')}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor("user.name", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-semibold"
        >
          <User className="ms-2 h-4 w-4" />
          {t('admin.wallet.table.user')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.user?.name || t('common.na'),
    }),
    columnHelper.accessor("user.email", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-semibold"
        >
          {t('admin.wallet.table.email')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.user?.email || t('common.na'),
    }),
    columnHelper.accessor("balance", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-semibold"
        >
          <DollarSign className="ms-2 h-4 w-4" />
          {t('admin.wallet.table.balance')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-semibold">
          {formatPrice(row.original.balance)}
        </span>
      ),
    }),
    columnHelper.accessor("is_locked", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-semibold"
        >
          {t('admin.wallet.table.status')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => getWalletStatusBadge(row.original.is_locked),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">{t('common.actions')}</span>,
      cell: ({ row }) => {
        const wallet = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t('common.openMenu')}</span>
                <MoreHorizontal className="ms-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-48">
              <DropdownMenuLabel>
                {t('common.actions')}
              </DropdownMenuLabel>
            
              <DropdownMenuSeparator />
              {wallet.is_locked ? (
                <DropdownMenuItem 
                  onClick={() => handleUnlock(wallet)}
                  className="text-green-600 dark:text-green-400"
                >
                  <Unlock className="ms-2 h-4 w-4" />
                  {t('admin.wallet.actions.unlock')}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={() => handleLock(wallet)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Lock className="ms-2 h-4 w-4" />
                  {t('admin.wallet.actions.lock')}
                </DropdownMenuItem>
              )}
              
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ], []);

  // Payouts table columns
  const payoutColumns = useMemo(() => [
    columnHelper.accessor("user.name", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-semibold"
        >
          <User className="ms-2 h-4 w-4" />
          {t('admin.payout.table.user')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.user?.name || t('common.na'),
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-semibold"
        >
          <DollarSign className="ms-2 h-4 w-4" />
          {t('admin.payout.table.amount')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-semibold">
          {formatPrice(row.original.amount)}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-semibold"
        >
          {t('admin.payout.table.status')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => getPayoutStatusBadge(row.original.status),
    }),
    columnHelper.accessor("created_at", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-semibold"
        >
          <Calendar className="ms-2 h-4 w-4" />
          {t('admin.payout.table.requestedAt')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => formatDate(row.original.created_at),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">{t('common.actions')}</span>,
      cell: ({ row }) => {
        const payout = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t('common.openMenu')}</span>
                <MoreHorizontal className="ms-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-48">
              <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  setSelectedPayout(payout);
                  setShowViewPayoutModal(true);
                }}
              >
                <Eye className="ms-2 h-4 w-4" />
                {t('admin.payout.actions.viewDetails')}
              </DropdownMenuItem>
              {payout.status === 'pending' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => {
                      setSelectedPayout(payout);
                      setApproveForm({
                        reference_number: "",
                        payment_screenshot: null,
                        notes: ""
                      });
                      setShowApproveModal(true);
                    }}
                    className="text-green-600 dark:text-green-400"
                  >
                    <CheckCircle className="ms-2 h-4 w-4" />
                    {t('admin.payout.actions.approve')}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      setSelectedPayout(payout);
                      setRejectForm({
                        rejection_reason: ""
                      });
                      setShowRejectModal(true);
                    }}
                    className="text-red-600 dark:text-red-400"
                  >
                    <XCircle className="ms-2 h-4 w-4" />
                    {t('admin.payout.actions.reject')}
                  </DropdownMenuItem>
                </>
              )}
              {payout.payment_proof && (
                <DropdownMenuItem 
                  onClick={() => window.open(`/storage/${payout.payment_proof.screenshot_path}`, '_blank')}
                >
                  <Image className="ms-2 h-4 w-4" />
                  {t('admin.payout.actions.viewProof')}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ], []);

  // Table instances
  const walletTable = useReactTable({
    data: walletsData,
    columns: walletColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setWalletSorting,
    onRowSelectionChange: setWalletRowSelection,
    onPaginationChange: setWalletPagination,
    state: {
      sorting: walletSorting,
      rowSelection: walletRowSelection,
      pagination: walletPagination,
    },
  });

  const payoutTable = useReactTable({
    data: payoutsData,
    columns: payoutColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setPayoutSorting,
    onPaginationChange: setPayoutPagination,
    state: {
      sorting: payoutSorting,
      pagination: payoutPagination,
    },
  });

  // Action handlers
  const handleLock = (wallet) => {
    router.post(route("admin.wallets.lock", wallet.id), {}, {
      preserveScroll: true,
      onSuccess: () => toast.success(t('admin.wallet.actions.lockSuccess')),
      onError: () => toast.error(t('admin.wallet.actions.lockError')),
    });
  };

  const handleUnlock = (wallet) => {
    router.post(route("admin.wallets.unlock", wallet.id), {}, {
      preserveScroll: true,
      onSuccess: () => toast.success(t('admin.wallet.actions.unlockSuccess')),
      onError: () => toast.error(t('admin.wallet.actions.unlockError')),
    });
  };

  const handleBulkLock = () => {
    router.post(route("admin.wallets.bulk-lock"), { wallet_ids: bulkSelectedIds }, {
      preserveScroll: true,
      onSuccess: () => {
        setWalletRowSelection({});
        toast.success(t('admin.wallet.actions.bulkLockSuccess'));
      },
      onError: () => toast.error(t('admin.wallet.actions.bulkLockError')),
    });
  };

  const handleBulkUnlock = () => {
    router.post(route("admin.wallets.bulk-unlock"), { wallet_ids: bulkSelectedIds }, {
      preserveScroll: true,
      onSuccess: () => {
        setWalletRowSelection({});
        toast.success(t('admin.wallet.actions.bulkUnlockSuccess'));
      },
      onError: () => toast.error(t('admin.wallet.actions.bulkUnlockError')),
    });
  };

  const handleExport = () => {
    router.get(route("admin.wallets.export"), {}, { preserveState: true });
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    router.post(route("admin.wallets.manual"), {
      user_id: selectedWallet.user.id,
      type: manualForm.type,
      amount: manualForm.amount,
      reason: manualForm.reason,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setShowManualModal(false);
        toast.success(t('admin.wallet.actions.manualOperationSuccess'));
        setManualForm({ user_id: "", type: "credit", amount: "", reason: "" });
      },
      onError: () => toast.error(t('admin.wallet.actions.manualOperationError')),
    });
  };

  const handleApproveSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("status", "approved");
    formData.append("reference_number", approveForm.reference_number);
    formData.append("payment_screenshot", approveForm.payment_screenshot);
    formData.append("notes", approveForm.notes);
    
    router.post(route("admin.payouts.process", selectedPayout.id), formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setShowApproveModal(false);
        toast.success(t('admin.payout.actions.approveSuccess'));
        setApproveForm({ reference_number: "", payment_screenshot: null, notes: "" });
      },
      onError: (errors) => {
        toast.error(errors.error || t('admin.payout.actions.approveError'));
      },
    });
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    router.post(route("admin.payouts.process", selectedPayout.id), {
      status: "rejected",
      rejection_reason: rejectForm.rejection_reason,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setShowRejectModal(false);
        toast.success(t('admin.payout.actions.rejectSuccess'));
        setRejectForm({ rejection_reason: "" });
      },
      onError: (errors) => {
        toast.error(errors.error || t('admin.payout.actions.rejectError'));
      },
    });
  };

  // Stats cards
  const statsCards = [
    {
      title: t('admin.wallet.stats.totalWallets'),
      value: walletsData.length,
      icon: User,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: t('admin.wallet.stats.totalBalance'),
      value: formatPrice(walletsData.reduce((sum, wallet) => {
        const balance = Number(wallet.balance) || 0; // Ensure numeric value
        return sum + balance;
      }, 0)),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: t('admin.wallet.stats.lockedWallets'),
      value: walletsData.filter(w => w.is_locked).length,
      icon: Lock,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20"
    },
    {
      title: t('admin.wallet.stats.pendingPayouts'),
      value: payoutsData.length,
      icon: Banknote,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
    },
  ];

  return (
    <AdminLayout>
      <Head title={t('admin.wallet.header')} />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('admin.wallet.header')}</h1>
          <p className="mt-2 text-muted-foreground">
            {t('admin.wallet.description')}
          </p>
        </div>
       
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <card.icon className={`ms-2 h-8 w-8 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bulk Actions */}
      {bulkSelectedIds.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg shadow-sm mb-6">
          <Badge variant="secondary" className="bg-primary/10 text-primary font-medium">
            {bulkSelectedIds.length} {t('admin.wallet.bulkActions.selected')}
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setWalletRowSelection({})}
          >
            {t('admin.wallet.bulkActions.clearSelection')}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBulkLock}
          >
            <Lock className="ms-2 h-4 w-4" />
            {t('admin.wallet.bulkActions.lockSelected')}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBulkUnlock}
          >
            <Unlock className="ms-2 h-4 w-4" />
            {t('admin.wallet.bulkActions.unlockSelected')}
          </Button>
        </div>
      )}

      {/* Wallets Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('admin.wallet.table.userWallets')}</span>
            <div className="text-sm text-muted-foreground">
              {walletTable.getFilteredRowModel().rows.length} {t('admin.wallet.table.of')} {walletsData.length} {t('admin.wallet.table.wallets')}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-1">
            <Table>
              <TableHeader>
                {walletTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {walletTable.getRowModel().rows?.length ? (
                  walletTable.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
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
                    <TableCell colSpan={walletColumns.length} className="h-24 text-center">
                      {t('admin.wallet.table.noWalletsFound')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4">
           
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">{t('admin.wallet.table.rowsPerPage', {n: walletTable.getState().pagination.pageSize})}</p>
                <Select
                  value={`${walletTable.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    walletTable.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={walletTable.getState().pagination.pageSize} />
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
                {t('admin.wallet.table.page', {n: walletTable.getState().pagination.pageIndex + 1, total: walletTable.getPageCount()})}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => walletTable.setPageIndex(0)}
                  disabled={!walletTable.getCanPreviousPage()}
                >
                  <span className="sr-only">{t('admin.wallet.table.goToFirstPage')}</span>
                  <ChevronFirst className="ms-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => walletTable.previousPage()}
                  disabled={!walletTable.getCanPreviousPage()}
                >
                  <span className="sr-only">{t('admin.wallet.table.goToPreviousPage')}</span>
                  <ChevronLeft className="ms-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => walletTable.nextPage()}
                  disabled={!walletTable.getCanNextPage()}
                >
                  <span className="sr-only">{t('admin.wallet.table.goToNextPage')}</span>
                  <ChevronRight className="ms-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => walletTable.setPageIndex(walletTable.getPageCount() - 1)}
                  disabled={!walletTable.getCanNextPage()}
                >
                  <span className="sr-only">{t('admin.wallet.table.goToLastPage')}</span>
                  <ChevronLast className="ms-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Payouts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('admin.payout.table.pendingPayoutRequests')}</span>
            <div className="text-sm text-muted-foreground">
              {payoutTable.getFilteredRowModel().rows.length} {t('admin.payout.table.of')} {payoutsData.length} {t('admin.payout.table.requests')}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-1">
            <Table>
              <TableHeader>
                {payoutTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {payoutTable.getRowModel().rows?.length ? (
                  payoutTable.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
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
                    <TableCell colSpan={payoutColumns.length} className="h-24 text-center">
                      {t('admin.payout.table.noPendingPayoutRequestsFound')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {t('admin.payout.table.showing', {n: payoutTable.getFilteredRowModel().rows.length, total: payoutsData.length})}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">{t('admin.payout.table.rowsPerPage')}</p>
                <Select
                  value={`${payoutTable.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    payoutTable.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={payoutTable.getState().pagination.pageSize} />
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
                {t('admin.payout.table.page', {n: payoutTable.getState().pagination.pageIndex + 1, total: payoutTable.getPageCount()})}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => payoutTable.setPageIndex(0)}
                  disabled={!payoutTable.getCanPreviousPage()}
                >
                  <span className="sr-only">{t('admin.payout.table.goToFirstPage')}</span>
                  <ChevronFirst className="ms-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => payoutTable.previousPage()}
                  disabled={!payoutTable.getCanPreviousPage()}
                >
                  <span className="sr-only">{t('admin.payout.table.goToPreviousPage')}</span>
                  <ChevronLeft className="ms-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => payoutTable.nextPage()}
                  disabled={!payoutTable.getCanNextPage()}
                >
                  <span className="sr-only">{t('admin.payout.table.goToNextPage')}</span>
                  <ChevronRight className="ms-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => payoutTable.setPageIndex(payoutTable.getPageCount() - 1)}
                  disabled={!payoutTable.getCanNextPage()}
                >
                  <span className="sr-only">{t('admin.payout.table.goToLastPage')}</span>
                  <ChevronLast className="ms-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Payout Details Modal */}
      <Dialog open={showViewPayoutModal} dir={isRTL ? "rtl" : "ltr"} onOpenChange={setShowViewPayoutModal}>
        <DialogContent className="max-w-2xl ">
          <DialogHeader className={'rtl'}>
            <DialogTitle>{t('admin.payout.viewDetails.title')}</DialogTitle>
            <DialogDescription>
              {t('admin.payout.viewDetails.description')}
            </DialogDescription>
          </DialogHeader>
          {selectedPayout && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.payout.viewDetails.user')}</p>
                  <p className="font-medium">{selectedPayout.user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.payout.viewDetails.email')}</p>
                  <p className="font-medium">{selectedPayout.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.payout.viewDetails.amount')}</p>
                  <p className="font-medium text-green-600">{formatPrice(selectedPayout.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.payout.viewDetails.status')}</p>
                  <div>{getPayoutStatusBadge(selectedPayout.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.payout.viewDetails.requestedAt')}</p>
                  <p className="font-medium">{formatDate(selectedPayout.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.payout.viewDetails.paymentMethod')}</p>
                  <p className="font-medium">{selectedPayout.payment_method || t('admin.payout.viewDetails.bankTransfer')}</p>
                </div>
              </div>

              {selectedPayout.bank_account_details && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t('admin.payout.viewDetails.bankAccountDetails')}</p>
                  <div className="bg-muted p-4 rounded-md">
                    <pre className="whitespace-pre-wrap font-sans">{selectedPayout.bank_account_details}</pre>
                  </div>
                </div>
              )}

              {selectedPayout.payment_proof && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t('admin.payout.viewDetails.paymentProof')}</p>
                  <div className="border rounded-md p-4">
                    <img 
                      src={`/storage/${selectedPayout.payment_proof.screenshot_path}`} 
                      alt={t('admin.payout.viewDetails.paymentProofAlt')} 
                      className="max-w-full max-h-64 object-contain"
                    />
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('admin.payout.viewDetails.referenceNumber')}</p>
                        <p className="font-medium">{selectedPayout.payment_proof.reference_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('admin.payout.viewDetails.paymentDate')}</p>
                        <p className="font-medium">{formatDate(selectedPayout.payment_proof.payment_date)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedPayout.admin_notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t('admin.payout.viewDetails.adminNotes')}</p>
                  <div className="bg-muted p-4 rounded-md">
                    <p>{selectedPayout.admin_notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewPayoutModal(false)}>
              {t('admin.payout.viewDetails.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Payout Modal */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('admin.payout.approve.title')}</DialogTitle>
            <DialogDescription>
              {t('admin.payout.approve.description')}
            </DialogDescription>
          </DialogHeader>
          {selectedPayout && (
            <form onSubmit={handleApproveSubmit} className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.payout.approve.user')}</p>
                <p className="font-medium">{selectedPayout.user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.payout.approve.amount')}</p>
                <p className="font-medium text-green-600">{formatPrice(selectedPayout.amount)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('admin.payout.approve.referenceNumber')}</label>
                <Input 
                  value={approveForm.reference_number}
                  onChange={(e) => setApproveForm({...approveForm, reference_number: e.target.value})}
                  placeholder={t('admin.payout.approve.referenceNumberPlaceholder')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('admin.payout.approve.paymentProof')}</label>
                <Input 
                  type="file"
                  accept="image/*"
                  onChange={(e) => setApproveForm({...approveForm, payment_screenshot: e.target.files[0]})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('admin.payout.approve.notes')}</label>
                <Input 
                  value={approveForm.notes}
                  onChange={(e) => setApproveForm({...approveForm, notes: e.target.value})}
                  placeholder={t('admin.payout.approve.notesPlaceholder')}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowApproveModal(false)}>
                  {t('admin.payout.approve.cancel')}
                </Button>
                <Button type="submit">
                  {t('admin.payout.approve.approvePayout')}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Payout Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('admin.payout.reject.title')}</DialogTitle>
            <DialogDescription>
              {t('admin.payout.reject.description')}
            </DialogDescription>
          </DialogHeader>
          {selectedPayout && (
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.payout.reject.user')}</p>
                <p className="font-medium">{selectedPayout.user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.payout.reject.amount')}</p>
                <p className="font-medium text-green-600">{formatPrice(selectedPayout.amount)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('admin.payout.reject.rejectionReason')}</label>
                <Input 
                  value={rejectForm.rejection_reason}
                  onChange={(e) => setRejectForm({...rejectForm, rejection_reason: e.target.value})}
                  placeholder={t('admin.payout.reject.rejectionReasonPlaceholder')}
                  required
                />
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowRejectModal(false)}>
                  {t('admin.payout.reject.cancel')}
                </Button>
                <Button type="submit" variant="destructive">
                  {t('admin.payout.reject.rejectPayout')}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Manual Operation Modal */}
      <Dialog open={showManualModal} onOpenChange={setShowManualModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('admin.wallet.manualOperation.title')}</DialogTitle>
            <DialogDescription>
              {t('admin.wallet.manualOperation.description')}
            </DialogDescription>
          </DialogHeader>
          {selectedWallet && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.wallet.manualOperation.user')}</p>
                <p className="font-medium">{selectedWallet.user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.wallet.manualOperation.currentBalance')}</p>
                <p className="font-medium text-green-600">{formatPrice(selectedWallet.balance)}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant={manualForm.type === "credit" ? "default" : "outline"}
                  onClick={() => setManualForm({...manualForm, type: "credit"})}
                  className="flex-1"
                >
                  <Plus className="ms-2 h-4 w-4" />
                  {t('admin.wallet.manualOperation.credit')}
                </Button>
                <Button 
                  type="button"
                  variant={manualForm.type === "debit" ? "default" : "outline"}
                  onClick={() => setManualForm({...manualForm, type: "debit"})}
                  className="flex-1"
                >
                  <Minus className="ms-2 h-4 w-4" />
                  {t('admin.wallet.manualOperation.debit')}
                </Button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('admin.wallet.manualOperation.amount')}</label>
                <Input 
                  type="number"
                  min="0"
                  step="0.01"
                  value={manualForm.amount}
                  onChange={(e) => setManualForm({...manualForm, amount: e.target.value})}
                  placeholder={t('admin.wallet.manualOperation.amountPlaceholder')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('admin.wallet.manualOperation.reason')}</label>
                <Input 
                  value={manualForm.reason}
                  onChange={(e) => setManualForm({...manualForm, reason: e.target.value})}
                  placeholder={t('admin.wallet.manualOperation.reasonPlaceholder')}
                  required
                />
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowManualModal(false)}>
                  {t('admin.wallet.manualOperation.cancel')}
                </Button>
                <Button type="submit">
                  {manualForm.type === "credit" ? t('admin.wallet.manualOperation.creditWallet') : t('admin.wallet.manualOperation.debitWallet')}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}