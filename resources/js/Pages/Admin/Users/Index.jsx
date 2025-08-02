import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AdminLayout from '@/Layouts/AdminLayout';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { Checkbox } from '@/Components/ui/checkbox';
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
  User,
  Shield,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Search,
  ChevronFirst,
  ChevronLeft,
  ChevronRight,
  ChevronLast,
  ArrowUpDown,
  Trash2,
  Plus,
  Lock,
  Unlock,
  ChevronDown,
} from 'lucide-react';

const columnHelper = createColumnHelper();

export default function AdminUsersIndex({ users = [], stats = {}, filters = {}, roles = [] }) {
  const { t } = useTranslation();
  const { isRTL } = useLanguageChange();

  // Defensive: always array
  const usersData = Array.isArray(users) ? users : (users?.data || []);
  const isLoading = !usersData || usersData.length === 0;

  // Table state
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState({});
  const [search, setSearch] = useState(filters.search || '');
  const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

  // Action handlers
  const handleMakeAdmin = (userId) => {
    router.patch(route('admin.users.makeAdmin', userId), {
      preserveScroll: true,
      onSuccess: () => toast.success(t('admin.users.makeAdminSuccess')),
    });
  };

  const handleRemoveAdmin = (userId) => {
    router.patch(route('admin.users.removeAdmin', userId), {
      preserveScroll: true,
      onSuccess: () => toast.success(t('admin.users.removeAdminSuccess')),
    });
  };

  const handleActivate = (userId) => {
    router.patch(route('admin.users.activate', userId), {
      preserveScroll: true,
      onSuccess: () => toast.success(t('admin.users.activateSuccess')),
    });
  };

  const handleDeactivate = (userId) => {
    router.patch(route('admin.users.deactivate', userId), {
      preserveScroll: true,
      onSuccess: () => toast.success(t('admin.users.deactivateSuccess')),
    });
  };

  const handleDelete = (userId) => {
    router.delete(route('admin.users.destroy', userId), {
      preserveScroll: true,
      onSuccess: () => toast.success(t('admin.users.deleteSuccess')),
    });
  };

  const handleBulkAction = (action) => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => filteredUsers[index].id
    );
    
    if (selectedIds.length === 0) {
      toast.error(t('admin.users.noUsersSelected'));
      return;
    }

    router.post(route('admin.users.bulkAction'), {
      action,
      ids: selectedIds,
      preserveScroll: true,
      onSuccess: () => {
        toast.success(t('admin.users.bulkActionSuccess'));
        setRowSelection({});
      },
    });
  };

  // Filtered data
  const filteredUsers = useMemo(() => {
    let filtered = usersData;
    if (search) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(search.toLowerCase()) ||
          user.email?.toLowerCase().includes(search.toLowerCase()) ||
          user.phone?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) =>
        Array.isArray(user.roles) && user.roles.some(r => r.role === roleFilter)
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((user) => (statusFilter === 'active' ? user.is_active : !user.is_active));
    }
    return filtered;
  }, [usersData, search, roleFilter, statusFilter]);

  // Columns
  const columns = useMemo(() => [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      size: 40,
    }),
    columnHelper.accessor('name', {
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="h-8 p-0 font-semibold">
          <User className="mr-2 h-4 w-4" />{t('admin.users.table.name')} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Link href={route('admin.users.show', row.original.id)} className="font-semibold hover:underline">
          {row.original.name}
        </Link>
      ),
    }),
    columnHelper.accessor('email', {
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="h-8 p-0 font-semibold">
          {t('admin.users.table.email')} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.email,
    }),
    columnHelper.accessor('phone', {
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="h-8 p-0 font-semibold">
          {t('admin.users.table.phone')} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.phone || '-',
    }),
    columnHelper.accessor('roles', {
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="h-8 p-0 font-semibold">
          <Shield className="mr-2 h-4 w-4" />{t('admin.users.table.roles')} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(row.original.roles) && row.original.roles.map((roleObj) => (
            <Badge key={roleObj.role} variant={roleObj.role === 'admin' ? 'default' : 'secondary'}>
              {t(`admin.users.roles.${roleObj.role}`)}
             
            </Badge>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor('is_active', {
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="h-8 p-0 font-semibold">
          <CheckCircle className="mr-2 h-4 w-4" />{t('admin.users.table.status')} <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        row.original.is_active ? (
          <Badge variant="success">{t('admin.users.status.active')}</Badge>
        ) : (
          <Badge variant="destructive">{t('admin.users.status.inactive')}</Badge>
        )
      ),
    })
  ], [t, isRTL]);

  // Table instance
  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      rowSelection,
      pagination,
    },
  });

  return (
    <AdminLayout>
      <Head title={t('admin.users.title')} />
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t('admin.users.title')}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {t('admin.users.description')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {Object.keys(rowSelection).length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    {Object.keys(rowSelection).length} {t('admin.users.selected')}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{t('admin.users.bulkActions')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                    {t('admin.users.actions.activate')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction('deactivate')}>
                    {t('admin.users.actions.deactivate')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction('delete')}
                    className="text-red-600 dark:text-red-400"
                  >
                    {t('common.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button asChild className="flex items-center gap-2">
              <Link href={route('admin.users.create')}>
                <Plus className="h-4 w-4" />
                {t('admin.users.addNew')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder={t('admin.users.searchPlaceholder')}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="ps-10"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={t('admin.users.filters.role')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('admin.users.filters.allRoles')}</SelectItem>
                    {(Array.isArray(roles) ? (roles.data || roles) : []).map((role) => (
                      <SelectItem key={role.role || role} value={role.role || role}>{t(`admin.users.roles.${role.role || role}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={t('admin.users.filters.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('admin.users.filters.allStatuses')}</SelectItem>
                    <SelectItem value="active">{t('admin.users.filters.active')}</SelectItem>
                    <SelectItem value="inactive">{t('admin.users.filters.inactive')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm" onClick={() => {
                setSearch('');
                setRoleFilter('all');
                setStatusFilter('all');
                setSorting([]);
                setRowSelection({});
              }}>{t('admin.users.resetFilters')}</Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('admin.users.totalUsers')}</p>
                  <h3 className="text-2xl font-bold">{stats.total || 0}</h3>
                </div>
                <div className="rounded-lg bg-primary/10 p-3">
                  <User className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('admin.users.activeUsers')}</p>
                  <h3 className="text-2xl font-bold">{stats.active || 0}</h3>
                </div>
                <div className="rounded-lg bg-green-100 dark:bg-green-900/50 p-3">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('admin.users.inactiveUsers')}</p>
                  <h3 className="text-2xl font-bold">{stats.inactive || 0}</h3>
                </div>
                <div className="rounded-lg bg-red-100 dark:bg-red-900/50 p-3">
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('admin.users.adminUsers')}</p>
                  <h3 className="text-2xl font-bold">{stats.admins || 0}</h3>
                </div>
                <div className="rounded-lg bg-purple-100 dark:bg-purple-900/50 p-3">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t('admin.users.usersList')}</span>
              <div className="text-sm text-muted-foreground">
                {table.getFilteredRowModel().rows.length} {t('admin.users.results')}
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
                          <span className="ml-2 text-muted-foreground">{t('admin.users.loading')}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
                        {t('admin.users.noUsersFound')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {t('admin.users.pagination.showing')} {table.getFilteredRowModel().rows.length} {t('admin.users.pagination.of')} {filteredUsers.length} {t('admin.users.pagination.results')}
              </div>
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-6 lg:space-x-reverse lg:space-x-8' : 'space-x-6 lg:space-x-8'}`}>
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                  <p className="text-sm font-medium">{t('admin.users.pagination.rowsPerPage')}</p>
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
                  {t('admin.users.pagination.page')} {table.getState().pagination.pageIndex + 1} {t('admin.users.pagination.of')} {table.getPageCount()}
                </div>
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">{t('admin.users.pagination.goToFirst')}</span>
                    <ChevronFirst className={`h-4 w-4  ${isRTL ? 'rotate-180' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">{t('admin.users.pagination.goToPrevious')}</span>
                    <ChevronLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">{t('admin.users.pagination.goToNext')}</span>
                    <ChevronRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">{t('admin.users.pagination.goToLast')}</span>
                    <ChevronLast className={`h-4 w-4  ${isRTL ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}