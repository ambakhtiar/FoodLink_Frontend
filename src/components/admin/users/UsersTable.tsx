"use client";

import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { ShieldAlert, ShieldCheck, UserCog, User, Building2, Loader2, RefreshCw } from "lucide-react";
import { useAdminUsers } from "@/hooks/useAdminQueries";
import { useUpdateUserStatus } from "@/hooks/useAdminMutations";
import { useAuthStore } from "@/store/authStore";

import {
    DataTableSearch,
    DataTableFilter,
    DataTableSort,
    DataTablePagination,
    FilterOption,
    SortOption,
} from "@/components/admin/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const ROLE_OPTIONS: FilterOption[] = [
    { label: "Admin", value: "ADMIN" },
    { label: "Super Admin", value: "SUPER_ADMIN" },
    { label: "User", value: "USER" },
    { label: "Organization", value: "ORGANIZATION" },
];

const STATUS_OPTIONS: FilterOption[] = [
    { label: "Active", value: "ACTIVE" },
    { label: "Banned", value: "BANNED" },
    { label: "Pending", value: "PENDING" },
    { label: "Incomplete", value: "INCOMPLETE_PROFILE" },
];

const SORT_OPTIONS: SortOption[] = [
    { label: "Newest First", sortBy: "createdAt", sortOrder: "desc" },
    { label: "Oldest First", sortBy: "createdAt", sortOrder: "asc" },
    { label: "Email A-Z", sortBy: "email", sortOrder: "asc" },
    { label: "Email Z-A", sortBy: "email", sortOrder: "desc" },
];

export function UsersTable() {
    const searchParams = useSearchParams();
    const currentUser = useAuthStore((state) => state.user);

    const page = Number(searchParams.get("page")) || 1;
    const limit = 10;
    const searchTerm = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const role = searchParams.get("role") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const { data, isLoading, isError, refetch } = useAdminUsers({
        page,
        limit,
        searchTerm,
        status,
        role,
        sortBy,
        sortOrder,
    });

    const { mutate: updateStatus, isPending: isUpdating } = useUpdateUserStatus();

    const handleBanToggle = (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === "BANNED" ? "ACTIVE" : "BANNED";
        updateStatus({ userId, status: newStatus });
    };

    const getRoleBadge = (roleStr: string) => {
        switch (roleStr) {
            case "SUPER_ADMIN":
                return <Badge className="bg-primary text-primary-foreground border-transparent">Super Admin</Badge>;
            case "ADMIN":
                return <Badge variant="secondary" className="border-transparent">Admin</Badge>;
            case "ORGANIZATION":
                return <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/10">Org</Badge>;
            default:
                return <Badge variant="outline" className="text-muted-foreground">User</Badge>;
        }
    };

    const getStatusBadge = (statusStr: string) => {
        switch (statusStr) {
            case "ACTIVE":
                return <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/10">Active</Badge>;
            case "BANNED":
                return <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10">Banned</Badge>;
            case "PENDING":
                return <Badge variant="outline" className="text-amber-500 border-amber-500/30 bg-amber-500/10">Pending</Badge>;
            default:
                return <Badge variant="outline" className="text-muted-foreground">{statusStr}</Badge>;
        }
    };

    const getName = (user: any) => {
        if (user.userProfile?.name) return user.userProfile.name;
        if (user.organizationProfile?.orgName) return user.organizationProfile.orgName;
        return "Unknown";
    };

    return (
        <div className="space-y-4 p-4 md:p-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-between">
                <div className="w-full sm:w-72">
                    <DataTableSearch placeholder="Search name or email..." paramKey="search" />
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <DataTableFilter options={ROLE_OPTIONS} paramKey="role" placeholder="All Roles" />
                    <DataTableFilter options={STATUS_OPTIONS} paramKey="status" placeholder="All Status" />
                    <DataTableSort options={SORT_OPTIONS} placeholder="Sort by" />
                    <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isLoading} className="rounded-xl h-10 w-10">
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold">User</TableHead>
                            <TableHead className="font-bold hidden sm:table-cell">Role</TableHead>
                            <TableHead className="font-bold hidden md:table-cell">Joined</TableHead>
                            <TableHead className="font-bold">Status</TableHead>
                            <TableHead className="text-right font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                                        <p>Loading users...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-destructive">
                                    Error loading users. Please try again.
                                </TableCell>
                            </TableRow>
                        ) : data?.data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center">
                                        <UserCog className="h-10 w-10 mb-2 opacity-20" />
                                        <p>No users found matching your criteria.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.data?.map((u) => (
                                <TableRow key={u.id} className="group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                {u.role === "ORGANIZATION" ? (
                                                    <Building2 className="h-5 w-5 text-primary" />
                                                ) : (
                                                    <User className="h-5 w-5 text-primary" />
                                                )}
                                            </div>
                                            <div className="flex flex-col max-w-[150px] sm:max-w-[300px]">
                                                <span className="font-bold truncate">{getName(u)}</span>
                                                <span className="text-xs text-muted-foreground truncate">{u.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        {getRoleBadge(u.role)}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                                        {format(new Date(u.createdAt), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(u.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {u.id !== currentUser?.id ? (
                                            <Button
                                                variant={u.status === "BANNED" ? "outline" : "destructive"}
                                                size="sm"
                                                className="rounded-lg font-bold"
                                                onClick={() => handleBanToggle(u.id, u.status)}
                                                disabled={isUpdating}
                                            >
                                                {u.status === "BANNED" ? (
                                                    <>
                                                        <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                                                        Activate
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShieldAlert className="h-3.5 w-3.5 mr-1.5" />
                                                        Ban
                                                    </>
                                                )}
                                            </Button>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic px-2">It's you</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {data?.meta && data.meta.totalPages > 1 && (
                <div className="pt-4">
                    <DataTablePagination totalPages={data.meta.totalPages} />
                </div>
            )}
        </div>
    );
}
