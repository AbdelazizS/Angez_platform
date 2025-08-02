import React, { useState, useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import FreelancerDashboardLayout from "@/Layouts/FreelancerDashboardLayout";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
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
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import { useServiceLanguageFallback } from "@/lib/useLanguageFallback";
import { useTranslation } from "react-i18next";
import { useLanguageChange } from "@/lib/useLanguageChange";
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Copy,
    Star,
    TrendingUp,
    Award,
    Globe,
    Languages,
    Calendar,
    DollarSign,
    Package,
    Tag,
    Settings,
    ArrowUpDown,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

const columnHelper = createColumnHelper();

export default function Services({ services }) {
    const { t } = useTranslation();
    const { isRTL } = useLanguageChange();

    // Delete modal state
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        serviceId: null,
        serviceTitle: "",
        isLoading: false,
    });

    // Unified state for shadcn/ui Data Table
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});

    // Format price for display
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
        return new Date(dateString).toLocaleDateString(
            isRTL ? "ar-SD" : "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );
    };

    // Get status badge
    const getStatusBadge = (service) => {
        if (service.is_featured) {
            return (
                <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                >
                    <Award className="w-3 h-3 me-1" />
                    {t("freelancerServices.status.featured")}
                </Badge>
            );
        }
        if (service.is_popular) {
            return (
                <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                >
                    <TrendingUp className="w-3 h-3 me-1" />
                    {t("freelancerServices.status.popular")}
                </Badge>
            );
        }

        if (service.is_popular) {
            return (
                <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                    <Settings className="w-3 h-3 me-1" />
                    {t("admin.services.status.active")}
                </Badge>
            );
        } else {
            return (
                <Badge
                    variant="outline"
                >
                    <Settings className="w-3 h-3 me-1" />
                    {t("admin.services.status.inactive")}
                </Badge>
            );
        }
    };

    // Get language badge
    const getLanguageBadge = (service) => {
        const hasArabic = service.title_ar || service.description_ar;
        const hasEnglish = service.title || service.description;

        if (hasArabic && hasEnglish) {
            return (
                <Badge variant="outline" className="flex items-center gap-1">
                    <Languages className="w-3 h-3" />
                    {t("freelancerServices.language.both")}
                </Badge>
            );
        }
        if (hasArabic) {
            return (
                <Badge variant="outline" className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {t("freelancerServices.language.ar")}
                </Badge>
            );
        }
        return (
            <Badge variant="outline" className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {t("freelancerServices.language.en")}
            </Badge>
        );
    };

    // Get content preview
    const getContentPreview = (service, field) => {
        const serviceContent = useServiceLanguageFallback(service);
        const content = serviceContent[field] || "";
        return content.length > 50 ? `${content.substring(0, 50)}...` : content;
    };

    // Get features count
    const getFeaturesCount = (service) => {
        const serviceContent = useServiceLanguageFallback(service);
        return serviceContent.features?.length || 0;
    };

    // Get packages count
    const getPackagesCount = (service) => {
        return service.packages?.length || 0;
    };

    // Get FAQ count
    const getFAQCount = (service) => {
        const serviceContent = useServiceLanguageFallback(service);
        return serviceContent.faq?.length || 0;
    };

    // Define columns
    const columns = useMemo(
        () => [
            // Service Title & Status
            columnHelper.accessor("title", {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="h-8 p-0 font-semibold"
                    >
                        {t("freelancerServices.table.title")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => {
                    const service = row.original;
                    const serviceContent = useServiceLanguageFallback(service);
                    return (
                        <div className="flex flex-col gap-2">
                            <div className="font-medium text-gray-900 dark:text-white">
                                {serviceContent.title}
                            </div>
                            <div className="flex items-center gap-2">
                                {getStatusBadge(service)}
                                {getLanguageBadge(service)}
                            </div>
                        </div>
                    );
                },
            }),

            // Category
            columnHelper.accessor("category", {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="h-8 p-0 font-semibold"
                    >
                        {t("freelancerServices.table.category")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => {
                    const service = row.original;
                    const serviceContent = useServiceLanguageFallback(service);
                    return (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {serviceContent.category || "-"}
                        </div>
                    );
                },
            }),

            // Price
            columnHelper.accessor("price", {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="h-8 p-0 font-semibold"
                    >
                        {t("freelancerServices.table.price")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                        <DollarSign className="w-3 h-3 text-green-600" />
                        {formatPrice(row.getValue("price"))}
                    </div>
                ),
            }),

            // Delivery Time
            columnHelper.accessor("delivery_time", {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="h-8 p-0 font-semibold"
                    >
                        {t("freelancerServices.table.deliveryTime")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => {
                    const service = row.original;
                    const serviceContent = useServiceLanguageFallback(service);
                    return (
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-3 h-3" />
                            {serviceContent.deliveryTime || "-"}
                        </div>
                    );
                },
            }),

            // Orders (for sorting/filtering)
            columnHelper.accessor("orders_count", {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="h-8 p-0 font-semibold"
                    >
                        {t("freelancerServices.table.orders")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {row.original.orders_count || 0}{" "}
                        {t("freelancerServices.table.orders")}
                    </div>
                ),
            }),

            // Language support (for filtering)
            columnHelper.accessor("title_ar", {
                header: () => null,
                cell: () => null,
                enableHiding: true,
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
                        {t("freelancerServices.table.created")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(row.getValue("created_at"))}
                    </div>
                ),
            }),

            // Actions
            columnHelper.display({
                id: "actions",
                header: () => (
                    <span className="sr-only">{t("common.actions")}</span>
                ),
                cell: ({ row }) => {
                    const service = row.original;
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
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/services/${service.id}`}
                                        className="flex items-center"
                                    >
                                        <Eye className="me-2 h-4 w-4" />
                                        {t("common.view")}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={route(
                                            "freelancer.services.edit",
                                            service.id
                                        )}
                                        className="flex items-center"
                                    >
                                        <Edit className="me-2 h-4 w-4" />
                                        {t("common.edit")}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => handleDeleteClick(service)}
                                    className="flex items-center text-red-600 dark:text-red-400"
                                >
                                    <Trash2 className="me-2 h-4 w-4" />
                                    {t("common.delete")}
                                </DropdownMenuItem>
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
        data: services,
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

    // Handlers
    const handleDeleteClick = (service) => {
        setDeleteModal({
            isOpen: true,
            serviceId: service.id,
            serviceTitle: service.title,
            isLoading: false,
        });
    };

    const handleDeleteConfirm = () => {
        setDeleteModal((prev) => ({ ...prev, isLoading: true }));

        router.delete(
            route("freelancer.services.destroy", deleteModal.serviceId),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteModal({
                        isOpen: false,
                        serviceId: null,
                        serviceTitle: "",
                        isLoading: false,
                    });
                    toast.success(t("freelancerServices.deleteSuccess"));
                },
                onError: (errors) => {
                    setDeleteModal((prev) => ({ ...prev, isLoading: false }));

                    // Handle specific delete error from backend
                    if (errors?.delete_error) {
                        toast.error(errors.delete_error);
                    } else if (errors?.message) {
                        toast.error(errors.message);
                    } else {
                        toast.error(t("freelancerServices.deleteGenericError"));
                    }
                },
                onFinish: () => {
                    setDeleteModal((prev) => ({ ...prev, isLoading: false }));
                },
            }
        );
    };

    const handleDeleteCancel = () => {
        setDeleteModal({
            isOpen: false,
            serviceId: null,
            serviceTitle: "",
            isLoading: false,
        });
    };

    const handleDuplicate = (id) => {
        // Implement duplicate functionality
        console.log("Duplicate service:", id);
    };

    return (
        <FreelancerDashboardLayout>
            <Head title={t("freelancerServices.title")} />
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t("freelancerServices.title")}
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {t("freelancerServices.description")}
                    </p>
                </div>
                <Button asChild className="flex items-center gap-2">
                    <Link href={route("freelancer.services.create")}>
                        <Plus className="h-4 w-4" />
                        {t("freelancerServices.addNew")}
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
                                    {t("freelancerServices.totalServices")}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {services.length}
                                </p>
                            </div>
                            <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {t("freelancerServices.activeServices")}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {
                                        services.filter(
                                            (s) =>
                                                !s.is_popular && !s.is_featured
                                        ).length
                                    }
                                </p>
                            </div>
                            <Settings className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder={t(
                                        "freelancerServices.searchPlaceholder"
                                    )}
                                    value={globalFilter ?? ""}
                                    onChange={(event) =>
                                        setGlobalFilter(event.target.value)
                                    }
                                    className="ps-10"
                                />
                            </div>
                        </div>
                        {/* Reset Filters Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setGlobalFilter("");
                                setColumnFilters([]);
                                setSorting([]);
                                setColumnVisibility({});
                                setRowSelection({});
                            }}
                        >
                            {t("freelancerServices.resetFilters")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
            {/* Data Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>{t("freelancerServices.servicesList")}</span>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {table.getFilteredRowModel().rows.length}{" "}
                            {t("freelancerServices.of")} {services.length}{" "}
                            {t("freelancerServices.services")}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column
                                                                  .columnDef
                                                                  .header,
                                                              header.getContext()
                                                          )}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={
                                                row.getIsSelected() &&
                                                "selected"
                                            }
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
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
                                            {t(
                                                "freelancerServices.noServicesFound"
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title={t("freelancerServices.deleteConfirm")}
                description={t("freelancerServices.deleteWarning")}
                confirmText={t("common.delete")}
                cancelText={t("common.cancel")}
                isLoading={deleteModal.isLoading}
            />
        </FreelancerDashboardLayout>
    );
}
