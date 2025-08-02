import React, { useState, useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
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
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Lock,
  Unlock,
  ArrowUpDown,
  User,
  DollarSign,
  Download,
  MoreHorizontal,
  Plus,
  Minus,
  CheckCircle,
  XCircle,
  Clock,
  ChevronFirst,
  ChevronLeft,
  ChevronRight,
  ChevronLast,
} from "lucide-react";

const columnHelper = createColumnHelper();

export default function AdminWalletShow({ wallet, transactions }) {
  // Modal states
  const [showManualOperation, setShowManualOperation] = useState(false);
  const [operationType, setOperationType] = useState("credit");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status badge
  const getStatusBadge = (isLocked) => {
    return isLocked ? (
      <Badge variant="destructive" className="flex items-center gap-1 w-fit">
        <Lock className="w-3 h-3" />
        Locked
      </Badge>
    ) : (
      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
        <Unlock className="w-3 h-3" />
        Active
      </Badge>
    );
  };

  // Transaction type badge
  const getTransactionTypeBadge = (type) => {
    const types = {
      credit: { label: "Credit", color: "bg-green-100 text-green-800", icon: Plus },
      debit: { label: "Debit", color: "bg-red-100 text-red-800", icon: Minus },
      payout: { label: "Payout", color: "bg-blue-100 text-blue-800", icon: Download },
      refund: { label: "Refund", color: "bg-purple-100 text-purple-800", icon: CheckCircle },
    };

    const { label, color, icon: Icon } = types[type] || { label: "Unknown", color: "bg-gray-100 text-gray-800", icon: Clock };

    return (
      <Badge className={`${color} dark:${color.replace('100', '900').replace('800', '200')} flex items-center gap-1 w-fit`}>
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  // Handle lock/unlock
  const handleLockToggle = () => {
    const action = wallet.is_locked ? "unlock" : "lock";
    router.post(route(`admin.wallets.${action}`, wallet.id), {}, {
      preserveScroll: true,
      onSuccess: () => toast.success(`Wallet ${action}ed successfully`),
      onError: () => toast.error(`Failed to ${action} wallet`),
    });
  };

  // Handle manual operation
  const handleManualOperation = (e) => {
    e.preventDefault();
    router.post(route("admin.wallets.manual"), {
      user_id: wallet.user.id,
      type: operationType,
      amount: parseFloat(amount),
      reason: description,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setShowManualOperation(false);
        setAmount("");
        setDescription("");
        toast.success("Operation completed successfully");
      },
      onError: (errors) => {
        toast.error(errors.message || "Failed to perform operation");
      },
    });
  };

  // Define columns
  const columns = useMemo(() => [
    columnHelper.accessor("id", {
      header: "#",
      cell: ({ row }) => `#${row.original.id}`,
    }),
    columnHelper.accessor("type", {
      header: "Type",
      cell: ({ row }) => getTransactionTypeBadge(row.original.type),
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-semibold"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const type = row.original.type;
        const amount = parseFloat(row.original.amount);
        return (
          <span className={type === "credit" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {type === "credit" ? "+" : "-"}
            {formatCurrency(amount)}
          </span>
        );
      },
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">
          {row.original.description}
        </div>
      ),
    }),
    columnHelper.accessor("created_at", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 font-semibold"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => formatDate(row.original.created_at),
    }),
    columnHelper.accessor("reference_id", {
      header: "Reference",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.reference_id || "N/A"}
        </span>
      ),
    }),
  ], []);

  // Create table instance
  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
      sorting: [
        {
          id: "created_at",
          desc: true,
        },
      ],
    },
  });

  return (
    <AdminLayout>
      <Head title={`Wallet - ${wallet.user.name}`} />

      <div className="py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Wallet Summary Card */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{wallet.user.name}'s Wallet</CardTitle>
                <CardDescription>
                  User ID: {wallet.user.id} | Created: {formatDate(wallet.created_at)}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(wallet.is_locked)}
                <Button
                  variant={wallet.is_locked ? "default" : "destructive"}
                  size="sm"
                  onClick={handleLockToggle}
                >
                  {wallet.is_locked ? (
                    <>
                      <Unlock className="h-4 w-4 mr-2" />
                      Unlock
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Lock
                    </>
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => setShowManualOperation(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Manual Operation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
              <p className="text-3xl font-bold">{formatCurrency(wallet.balance)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Credits</p>
              <p className="text-2xl font-semibold text-green-600">
                {formatCurrency(wallet.total_credits || 0)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Debits</p>
              <p className="text-2xl font-semibold text-red-600">
                {formatCurrency(wallet.total_debits || 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              {transactions.length} transactions found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
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
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
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
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                Showing {table.getFilteredRowModel().rows.length} of {transactions.length} transactions
              </div>
              <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Rows per page</p>
                  <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                      table.setPageSize(Number(value));
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
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to first page</span>
                    <ChevronFirst className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to last page</span>
                    <ChevronLast className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual Operation Dialog */}
      <Dialog open={showManualOperation} onOpenChange={setShowManualOperation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Wallet Operation</DialogTitle>
            <DialogDescription>
              Add or remove funds from this wallet
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleManualOperation}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={operationType === "credit" ? "default" : "outline"}
                  onClick={() => setOperationType("credit")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Credit
                </Button>
                <Button
                  type="button"
                  variant={operationType === "debit" ? "destructive" : "outline"}
                  onClick={() => setOperationType("debit")}
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Debit
                </Button>
              </div>
              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-medium">
                  Amount
                </label>
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                  Description
                </label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Reason for this operation"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setShowManualOperation(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {operationType === "credit" ? "Credit Wallet" : "Debit Wallet"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}