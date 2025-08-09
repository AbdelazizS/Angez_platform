import React, { useState, useMemo, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/Layouts/AdminLayout";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
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
    Users,
    BarChart2,
    Zap,
    CheckCircle,
    XCircle,
    EyeOff,
    Star as StarIcon,
    TrendingUp as TrendingUpIcon,
    Award as AwardIcon,
    TrendingDown,
    ChevronFirst,
    ChevronLeft,
    ChevronRight,
    ChevronLast,
} from "lucide-react";

const columnHelper = createColumnHelper();

export default function AdminServicesIndex({ services = [], stats = {}, filters = {}, categories = [], freelancers = [] }) {
    const { t } = useTranslation();
    const { isRTL } = useLanguageChange();

    console.log(services);
    
    // Ensure services is always an array
    const servicesData = Array.isArray(services) ? services : (services?.data || []);
    
    // Loading state
    const isLoading = !servicesData || servicesData.length === 0;

    // Delete modal state
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        serviceId: null,
        serviceTitle: "",
        isLoading: false,
    });

    // Bulk actions state
    const [selectedServices, setSelectedServices] = useState([]);
    const [bulkAction, setBulkAction] = useState("");

    // Unified state for shadcn/ui Data Table
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(filters.search || "");
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // Update selectedServices when rowSelection changes
    useEffect(() => {
        const selectedIds = Object.keys(rowSelection).map(index => {
            const rowIndex = parseInt(index);
            return servicesData[rowIndex]?.id;
        }).filter(Boolean);
        setSelectedServices(selectedIds);
    }, [rowSelection, servicesData]);

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
        if (!service.is_active) {
            return (
                <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                    <XCircle className="w-3 h-3 me-1" />
                    {t("admin.services.status.inactive")}
                </Badge>
            );
        }
        if (service.is_featured) {
            return (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    <AwardIcon className="w-3 h-3 me-1" />
                    {t("admin.services.status.featured")}
                </Badge>
            );
        }
        if (service.is_popular) {
            return (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                    <TrendingUpIcon className="w-3 h-3 me-1" />
                    {t("admin.services.status.popular")}
                </Badge>
            );
        }
        return (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <CheckCircle className="w-3 h-3 me-1" />
                {t("admin.services.status.active")}
            </Badge>
        );
    };

    // Get language badge
    const getLanguageBadge = (service) => {
        const hasArabic = service.title_ar || service.description_ar;
        const hasEnglish = service.title || service.description;

        if (hasArabic && hasEnglish) {
            return (
                <Badge variant="outline" className="flex items-center gap-1">
                    <Languages className="w-3 h-3" />
                    {t("admin.services.language.both")}
                </Badge>
            );
        }
        if (hasArabic) {
            return (
                <Badge variant="outline" className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {t("admin.services.language.ar")}
                </Badge>
            );
        }
        return (
            <Badge variant="outline" className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {t("admin.services.language.en")}
            </Badge>
        );
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
                        {t("admin.services.table.title")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => {
                    const service = row.original;
                    return (
                        <div className="flex flex-col gap-2">
                            <div className="font-medium text-foreground">
                                {service.title}
                            </div>
                            <div className="flex items-center gap-2">
                                {getStatusBadge(service)}
                                {getLanguageBadge(service)}
                            </div>
                        </div>
                    );
                },
            }),

            // Freelancer
            columnHelper.accessor("user.name", {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="h-8 p-0 font-semibold"
                    >
                        {t("admin.services.table.freelancer")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="text-sm text-muted-foreground">
                        {row.original.user?.name || t("admin.services.fallback.freelancer")}
                    </div>
                ),
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
                        {t("admin.services.table.category")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="text-sm text-muted-foreground">
                        {row.getValue("category") || "-"}
                    </div>
                ),
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
                        {t("admin.services.table.price")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                        <DollarSign className="w-3 h-3 text-green-600" />
                        {formatPrice(row.getValue("price"))}
                    </div>
                ),
            }),

            // Orders
            columnHelper.accessor("orders_count", {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="h-8 p-0 font-semibold"
                    >
                        {t("admin.services.table.orders")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="text-sm text-muted-foreground">
                        {row.original.orders_count || 0}
                    </div>
                ),
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
                        {t("admin.services.table.created")}
                        <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="text-sm text-muted-foreground">
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
                                
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => handleToggleStatus(service)}
                                    className="flex items-center"
                                >
                                    {service.is_active ? (
                                        <>
                                            <EyeOff className="me-2 h-4 w-4" />
                                            {t("admin.services.actions.deactivate")}
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="me-2 h-4 w-4" />
                                            {t("admin.services.actions.activate")}
                                        </>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleToggleFeatured(service)}
                                    className="flex items-center"
                                >
                                    {service.is_featured ? (
                                        <>
                                            <XCircle className="me-2 h-4 w-4" />
                                            {t("admin.services.actions.unfeature")}
                                        </>
                                    ) : (
                                        <>
                                            <AwardIcon className="me-2 h-4 w-4" />
                                            {t("admin.services.actions.feature")}
                                        </>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleTogglePopular(service)}
                                    className="flex items-center"
                                >
                                    {service.is_popular ? (
                                        <>
                                            <TrendingDown className="me-2 h-4 w-4" />
                                            {t("admin.services.actions.unpopular")}
                                        </>
                                    ) : (
                                        <>
                                            <TrendingUpIcon className="me-2 h-4 w-4" />
                                            {t("admin.services.actions.popular")}
                                        </>
                                    )}
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
        data: servicesData || [],
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
    const handleDeleteClick = (service) => {
        setDeleteModal({
            isOpen: true,
            serviceId: service.id,
            serviceTitle: service.title,
            isLoading: false,
        });
    };

    const handleDeleteConfirm = () => {
        setDeleteModal(prev => ({ ...prev, isLoading: true }));
        
        router.delete(route("admin.services.destroy", deleteModal.serviceId), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModal({ isOpen: false, serviceId: null, serviceTitle: "", isLoading: false });
                toast.success(t("admin.services.deleteSuccess"));
            },
            onError: (errors) => {
                setDeleteModal(prev => ({ ...prev, isLoading: false }));
                
                if (errors?.delete_error) {
                    toast.error(errors.delete_error);
                } else if (errors?.message) {
                    toast.error(errors.message);
                } else {
                    toast.error(t("admin.services.deleteGenericError"));
                }
            },
        });
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, serviceId: null, serviceTitle: "", isLoading: false });
    };

    const handleToggleStatus = (service) => {
        router.post(route("admin.services.toggle-status", service.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(t("admin.services.statusToggleSuccess"));
            },
            onError: () => {
                toast.error(t("admin.services.statusToggleError"));
            },
        });
    };

    const handleToggleFeatured = (service) => {
        router.post(route("admin.services.toggle-featured", service.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(t("admin.services.featuredToggleSuccess"));
            },
            onError: () => {
                toast.error(t("admin.services.featuredToggleError"));
            },
        });
    };

    const handleTogglePopular = (service) => {
        router.post(route("admin.services.toggle-popular", service.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(t("admin.services.popularToggleSuccess"));
            },
            onError: () => {
                toast.error(t("admin.services.popularToggleError"));
            },
        });
    };

    const handleBulkAction = () => {
        if (!bulkAction || selectedServices.length === 0) {
            toast.error(t("admin.services.selectServicesForBulkAction"));
            return;
        }

        router.post(route("admin.services.bulk-action"), {
            action: bulkAction,
            service_ids: selectedServices,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedServices([]);
                setBulkAction("");
                toast.success(t("admin.services.bulkActionSuccess"));
            },
            onError: (errors) => {
                if (errors?.delete_error) {
                    toast.error(errors.delete_error);
                } else {
                    toast.error(t("admin.services.bulkActionError"));
                }
            },
        });
    };

    return (
        <AdminLayout>
            <Head title={t("admin.services.title")} />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        {t("admin.services.title")}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {t("admin.services.description")}
                    </p>
                </div>
                <Button asChild className="flex items-center gap-2">
                    <Link href={route("admin.services.create")}>
                        <Plus className="h-4 w-4" />
                        {t("admin.services.addNew")}
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t("admin.services.stats.totalServices")}
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                    {stats.total_services}
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
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t("admin.services.stats.activeServices")}
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                    {stats.active_services}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t("admin.services.stats.featuredServices")}
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                    {stats.featured_services}
                                </p>
                            </div>
                            <AwardIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t("admin.services.stats.totalOrders")}
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                    {stats.total_orders}
                                </p>
                            </div>
                            <BarChart2 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Bulk Actions */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder={t("admin.services.searchPlaceholder")}
                                    value={globalFilter ?? ""}
                                    onChange={(event) =>
                                        setGlobalFilter(event.target.value)
                                    }
                                    className="ps-10"
                                />
                            </div>
                            
                            <Select value={filters.status || "all"} onValueChange={(value) => {
                                router.get(route("admin.services.index"), { ...filters, status: value === "all" ? "" : value }, { preserveState: true });
                            }}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder={t("admin.services.filters.status")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t("admin.services.filters.allStatuses")}</SelectItem>
                                    <SelectItem value="active">{t("admin.services.filters.active")}</SelectItem>
                                    <SelectItem value="inactive">{t("admin.services.filters.inactive")}</SelectItem>
                                    <SelectItem value="featured">{t("admin.services.filters.featured")}</SelectItem>
                                    <SelectItem value="popular">{t("admin.services.filters.popular")}</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filters.category || "all"} onValueChange={(value) => {
                                router.get(route("admin.services.index"), { ...filters, category: value === "all" ? "" : value }, { preserveState: true });
                            }}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder={t("admin.services.filters.category")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t("admin.services.filters.allCategories")}</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Bulk Actions */}
                        {selectedServices.length > 0 && (
                            <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg shadow-sm">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="bg-primary/10 text-primary font-medium">
                                        {selectedServices.length} {t("admin.services.selected")}
                                    </Badge>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => setRowSelection({})}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        {t("admin.services.clearSelection")}
                                    </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select value={bulkAction} onValueChange={setBulkAction}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder={t("admin.services.bulkActions.select")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="activate">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                    {t("admin.services.bulkActions.activate")}
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="deactivate">
                                                <div className="flex items-center gap-2">
                                                    <EyeOff className="h-4 w-4 text-yellow-600" />
                                                    {t("admin.services.bulkActions.deactivate")}
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="feature">
                                                <div className="flex items-center gap-2">
                                                    <AwardIcon className="h-4 w-4 text-purple-600" />
                                                    {t("admin.services.bulkActions.feature")}
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="unfeature">
                                                <div className="flex items-center gap-2">
                                                    <XCircle className="h-4 w-4 text-gray-600" />
                                                    {t("admin.services.bulkActions.unfeature")}
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="popular">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUpIcon className="h-4 w-4 text-orange-600" />
                                                    {t("admin.services.bulkActions.popular")}
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="unpopular">
                                                <div className="flex items-center gap-2">
                                                    <TrendingDown className="h-4 w-4 text-gray-600" />
                                                    {t("admin.services.bulkActions.unpopular")}
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="delete">
                                                <div className="flex items-center gap-2">
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                    {t("admin.services.bulkActions.delete")}
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button 
                                        onClick={handleBulkAction} 
                                        size="sm" 
                                        className="bg-primary hover:bg-primary/90 text-white"
                                        disabled={!bulkAction}
                                    >
                                        {t("admin.services.bulkActions.apply")}
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
                                router.get(route("admin.services.index"));
                            }}
                        >
                            {t("admin.services.resetFilters")}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Data Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>{t("admin.services.servicesList")}</span>
                        <div className="flex items-center gap-4">
                            {selectedServices.length > 0 && (
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
                                        {t("admin.services.selectAll")}
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setRowSelection({})}
                                    >
                                        {t("admin.services.selectNone")}
                                    </Button>
                                </div>
                            )}
                            <div className="text-sm text-muted-foreground">
                                {table.getFilteredRowModel().rows.length}{" "}
                                {t("admin.services.of")} {servicesData.length}{" "}
                                {t("admin.services.services")}
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border p-1">
                        <Table >
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="">
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
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                                <span className="ml-2 text-muted-foreground">
                                                    {t("admin.services.loading", "Loading services...")}
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
                                                    row.getIsSelected() &&
                                                    "selected"
                                                }
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
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={
                                                columns.length
                                            }
                                            className="h-24 text-center"
                                        >
                                            {t("admin.services.noServicesFound")}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    
                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between space-x-2 py-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                            {t("admin.services.pagination.showing", "Showing")} {table.getFilteredRowModel().rows.length} {t("admin.services.pagination.of", "of")} {servicesData.length} {t("admin.services.pagination.results", "results")}
                        </div>
                        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-6 lg:space-x-reverse lg:space-x-8' : 'space-x-6 lg:space-x-8'}`}>
                            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                                <p className="text-sm font-medium">{t("admin.services.pagination.rowsPerPage", "Rows per page")}</p>
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
                                {t("admin.services.pagination.page", "Page")} {table.getState().pagination.pageIndex + 1} {t("admin.services.pagination.of", "of")} {table.getPageCount()}
                            </div>
                            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                                <Button
                                    variant="outline"
                                    className="hidden h-8 w-8 p-0 lg:flex"
                                    onClick={() => table.setPageIndex(0)}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <span className="sr-only">{t("admin.services.pagination.goToFirst", "Go to first page")}</span>
                                    <ChevronFirst className={`h-4 w-4  ${isRTL ? 'rotate-180' : ''}`} />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <span className="sr-only">{t("admin.services.pagination.goToPrevious", "Go to previous page")}</span>
                                    <ChevronLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <span className="sr-only">{t("admin.services.pagination.goToNext", "Go to next page")}</span>
                                    <ChevronRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="hidden h-8 w-8 p-0 lg:flex"
                                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <span className="sr-only">{t("admin.services.pagination.goToLast", "Go to last page")}</span>
                                    <ChevronLast className={`h-4 w-4  ${isRTL ? 'rotate-180' : ''}`} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title={t("admin.services.deleteConfirm")}
                description={t("admin.services.deleteWarning")}
                confirmText={t("common.delete")}
                cancelText={t("common.cancel")}
                isLoading={deleteModal.isLoading}
            />
        </AdminLayout>
    );
} 