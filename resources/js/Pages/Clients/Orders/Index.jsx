import React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Badge } from "@/Components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/Components/ui/card";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/Components/ui/table";
import {
    MoreVertical,
    Eye,
    MessageSquare,
    Upload,
    Download,
    CheckCircle,
    Clock,
    XCircle,
    CreditCard,
    FileSearch,
    ArrowRight,
    Plus,
    Package,
    Repeat,
    Quote,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import ClientDashboardLayout from "@/Layouts/ClientDashboardLayout";
import { Pagination } from "@/Components/ui/pagination";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
} from "@tanstack/react-table";
import { toast } from "sonner";
import ReviewCard from "@/Components/ReviewCard";

export default function OrdersIndex({ orders, filters }) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar";
    const { auth } = usePage().props;

    
    // Status configuration
    const statusConfig = {
        completed: {
            variant: "success",
            icon: <CheckCircle className="w-4 h-4 me-1.5" />,
            label: t("orders.status.completed", "Completed"),
        },
        in_progress: {
            variant: "info",
            icon: <Clock className="w-4 h-4 me-1.5 animate-spin" />,
            label: t("orders.status.in_progress", "In Progress"),
        },
        review: {
            variant: "warning",
            icon: <FileSearch className="w-4 h-4 me-1.5" />,
            label: t("orders.status.review", "In Review"),
        },
        payment_verified: {
            variant: "success",
            icon: <CreditCard className="w-4 h-4 me-1.5" />,
            label: t("orders.status.payment_verified", "Payment Verified"),
        },
        pending: {
            variant: "pending",
            icon: <Clock className="w-4 h-4 me-1.5" />,
            label: t("orders.status.pending", "Pending"),
        },
        cancelled: {
            variant: "error",
            icon: <XCircle className="w-4 h-4 me-1.5" />,
            label: t("orders.status.cancelled", "Cancelled"),
        },
    };

    // Payment status configuration
    const paymentStatusConfig = {
        verified: {
            variant: "success",
            icon: <CheckCircle className="w-4 h-4 me-1.5" />,
            label: t("orders.paymentStatus.verified", "Verified"),
        },
        pending: {
            variant: "pending",
            icon: <Clock className="w-4 h-4 me-1.5" />,
            label: t("orders.paymentStatus.pending", "Pending"),
        },
        failed: {
            variant: "error",
            icon: <XCircle className="w-4 h-4 me-1.5" />,
            label: t("orders.paymentStatus.failed", "Failed"),
        },
    };

    // Format currency
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

    const columns = [
        {
            accessorKey: "service",
            header: t("ordersList.service"),
            cell: ({ row }) => (
                <Link
                    href={route("client.orders.show", row.original.id)}
                    className="hover:text-primary hover:underline"
                >
                    {row.original.service?.title || "-"}
                </Link>
            ),
        },
        {
            accessorKey: "freelancer",
            header: t("ordersList.freelancer"),
            cell: ({ row }) => (
                <Link
                    href={`/freelancers/${row.original.freelancer?.id}`}
                    className="hover:text-primary hover:underline"
                >
                    {row.original.freelancer?.name || "-"}
                </Link>
            ),
        },
        {
            accessorKey: "status",
            header: t("ordersList.status"),
            cell: ({ row }) => (
                <Badge variant={statusConfig[row.original.status]?.variant}>
                    {statusConfig[row.original.status]?.icon}
                    {statusConfig[row.original.status]?.label}
                </Badge>
            ),
        },
        {
            accessorKey: "total_amount",
            header: t("ordersList.price"),
            cell: ({ row }) => formatCurrency(row.original.total_amount),
        },
        {
            accessorKey: "payment_status",
            header: t("ordersList.paymentStatus"),
            cell: ({ row }) => (
                <Badge
                    variant={
                        paymentStatusConfig[row.original.payment_status]
                            ?.variant
                    }
                >
                    {paymentStatusConfig[row.original.payment_status]?.icon}
                    {paymentStatusConfig[row.original.payment_status]?.label}
                </Badge>
            ),
        },
        {
            id: "actions",
            header: t("common.actions"),
            cell: ({ row }) => (
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                        >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">
                                {t("ordersList.openMenu", "Open menu")}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="rtl align-start">
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "client.orders.show",
                                    row.original.id
                                )}
                                className="flex items-center"
                            >
                                <Eye className="w-4 h-4 me-2" />
                                {t("common.view")}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={`/chat/${row.original.id}`}
                                className="flex items-center"
                            >
                                <MessageSquare className="w-4 h-4 me-2" />
                                {t("nav.messages")}
                            </Link>
                        </DropdownMenuItem>
                        {row.original.status === "pending" &&
                            !row.original.payment_screenshot && (
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={
                                            route(
                                                "client.orders.show",
                                                row.original.id
                                            ) + "#upload-payment"
                                        }
                                        className="flex items-center"
                                    >
                                        <Upload className="w-4 h-4 me-2" />
                                        {t("ordersList.uploadPayment")}
                                    </Link>
                                </DropdownMenuItem>
                            )}
                        {row.original.status === "completed" && (
                            <>
                                {row.original.can_review && (
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={route(
                                                "client.orders.show",
                                                row.original.id
                                            )}
                                            className="flex items-center"
                                        >
                                            <Quote className="w-4 h-4 me-2" />
                                            {t("orders.leaveReview")}
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                {/* {row.original.review && (
                                    <DropdownMenuItem asChild className='max-w-xs' >
                                        <span>
                                            <ReviewCard
                                                review={row.original.review}
                                                compact
                                            />
                                        </span>
                                    </DropdownMenuItem>
                                )} */}
                                {row.original.waiting_review && (
                                    <DropdownMenuItem asChild>
                                        <span className="badge badge-info">
                                            {t("orders.waitingForReview")}
                                        </span>
                                    </DropdownMenuItem>
                                )}
                            </>
                        )}
                        {row.original.status === "review" && (
                            <>
                                <DropdownMenuItem
                                    onClick={async () => {
                                        try {
                                            await router.post(
                                                route(
                                                    "orders.request-revision",
                                                    row.original.id
                                                ),
                                                {},
                                                {
                                                    onSuccess: (page) => {
                                                        toast.success(
                                                            "Revision requested!"
                                                        );
                                                        router.reload({
                                                            only: ["orders"],
                                                        });
                                                    },
                                                    onError: (errors) => {
                                                        toast.error(
                                                            errors?.message ||
                                                                "Failed to request revision."
                                                        );
                                                    },
                                                }
                                            );
                                        } catch (e) {
                                            toast.error(
                                                e?.message ||
                                                    "Failed to request revision."
                                            );
                                        }
                                    }}
                                >
                                    <Repeat className="w-4 h-4 me-2 text-yellow-600" />
                                    {t(
                                        "ordersList.requestRevision",
                                        "Request Revision"
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={async () => {
                                        try {
                                            await router.post(
                                                `/orders/${row.original.id}/confirm-completion`,
                                                {},
                                                {
                                                    onSuccess: (page) => {
                                                        toast.success(
                                                            "Order confirmed as completed!"
                                                        );
                                                        router.reload({
                                                            only: ["orders"],
                                                        });
                                                    },
                                                    onError: (errors) => {
                                                        toast.error(
                                                            errors?.message ||
                                                                "Failed to confirm completion."
                                                        );
                                                    },
                                                }
                                            );
                                        } catch (e) {
                                            toast.error(
                                                e?.message ||
                                                    "Failed to confirm completion."
                                            );
                                        }
                                    }}
                                >
                                    <CheckCircle className="w-4 h-4 me-2 text-green-600" />
                                    {t(
                                        "ordersList.confirmCompletion",
                                        "Confirm Completion"
                                    )}
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    // Remove .data and .total references, use orders as a flat array
    const table = useReactTable({
        data: orders,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <ClientDashboardLayout>
            <Head title={t("nav.orders")} />
            {/* Header with actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {t("nav.orders")}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {t("ordersList.description")}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild>
                        <Link href="/services">
                            <Plus className="w-4 h-4 me-2" />
                            {t("ordersList.newOrder")}
                        </Link>
                    </Button>
                </div>
            </div>
            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>{t("nav.orders")}</CardTitle>
                            <CardDescription></CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {orders.length > 0 ? (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        {table
                                            .getHeaderGroups()
                                            .map((headerGroup) => (
                                                <TableRow key={headerGroup.id}>
                                                    {headerGroup.headers.map(
                                                        (header) => (
                                                            <TableHead
                                                                key={header.id}
                                                            >
                                                                {flexRender(
                                                                    header
                                                                        .column
                                                                        .columnDef
                                                                        .header,
                                                                    header.getContext()
                                                                )}
                                                            </TableHead>
                                                        )
                                                    )}
                                                </TableRow>
                                            ))}
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                className="hover:bg-muted/50"
                                            >
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <TableCell
                                                            key={cell.id}
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext()
                                                            )}
                                                        </TableCell>
                                                    ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex items-center justify-end py-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    {t("common.previous", "Previous")}
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    {t("common.next", "Next")}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Package className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                                {t("ordersList.emptyTitle")}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {t("ordersList.emptyDescription")}
                            </p>
                            <Button asChild>
                                <Link href="/services">
                                    <Plus className="w-4 h-4 me-2" />
                                    {t("ordersList.newOrder")}
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </ClientDashboardLayout>
    );
}
