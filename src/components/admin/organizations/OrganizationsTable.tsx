"use client";

import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
    CheckCircle2,
    XCircle,
    ShieldAlert,
    ShieldCheck,
    Building2,
    Loader2,
    RefreshCw,
    Store
} from "lucide-react";
import { useAdminOrganizations } from "@/hooks/useAdminQueries";
import { useUpdateOrgStatus } from "@/hooks/useAdminMutations";

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

const STATUS_OPTIONS: FilterOption[] = [
    { label: "Pending Review", value: "PENDING" },
    { label: "Active", value: "ACTIVE" },
    { label: "Banned", value: "BANNED" },
    { label: "Incomplete", value: "INCOMPLETE_PROFILE" },
];

const SORT_OPTIONS: SortOption[] = [
    { label: "Newest First", sortBy: "createdAt", sortOrder: "desc" },
    { label: "Oldest First", sortBy: "createdAt", sortOrder: "asc" },
    { label: "Name A-Z", sortBy: "orgName", sortOrder: "asc" },
    { label: "Name Z-A", sortBy: "orgName", sortOrder: "desc" },
];

export function OrganizationsTable() {
    const searchParams = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const limit = 10;
    const searchTerm = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const { data, isLoading, isError, refetch } = useAdminOrganizations({
        page,
        limit,
        searchTerm,
        status,
        sortBy,
        sortOrder,
    });

    const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrgStatus();

    const handleStatusChange = (orgId: string, newStatus: string) => {
        updateStatus({ orgId, status: newStatus });
    };

    const getStatusBadge = (statusStr: string) => {
        switch (statusStr) {
            case "ACTIVE":
                return <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/10">Active</Badge>;
            case "BANNED":
                return <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10">Banned</Badge>;
            case "PENDING":
                return <Badge variant="outline" className="text-amber-500 border-amber-500/30 bg-amber-500/10">Pending Review</Badge>;
            default:
                return <Badge variant="outline" className="text-muted-foreground">{statusStr}</Badge>;
        }
    };

    return (
        <div className="space-y-4 p-4 md:p-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-between">
                <div className="w-full sm:w-72">
                    <DataTableSearch placeholder="Search org name or email..." paramKey="search" />
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
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
                            <TableHead className="font-bold">Organization</TableHead>
                            <TableHead className="font-bold hidden md:table-cell">Reg. Details</TableHead>
                            <TableHead className="font-bold hidden lg:table-cell">Joined</TableHead>
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
                                        <p>Loading organizations...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-destructive">
                                    Error loading organizations. Please try again.
                                </TableCell>
                            </TableRow>
                        ) : data?.data?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center">
                                        <Building2 className="h-10 w-10 mb-2 opacity-20" />
                                        <p>No organizations found matching your criteria.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.data?.map((org) => {
                                const profile = org.organizationProfile;
                                return (
                                    <TableRow key={org.id} className="group">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <Store className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="flex flex-col max-w-[150px] sm:max-w-[250px]">
                                                    <span className="font-bold truncate">{profile?.orgName || "Unknown Org"}</span>
                                                    <span className="text-xs text-muted-foreground truncate">{org.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">Reg: {profile?.registrationNumber || "N/A"}</span>
                                                <span className="text-xs text-muted-foreground">Est. {profile?.establishedYear || "N/A"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                                            {format(new Date(org.createdAt), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(org.status)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {org.status === "PENDING" ? (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="rounded-lg text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/30"
                                                            onClick={() => handleStatusChange(org.id, "ACTIVE")}
                                                            disabled={isUpdating}
                                                        >
                                                            <CheckCircle2 className="h-4 w-4 mr-1.5" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                                                            onClick={() => handleStatusChange(org.id, "BANNED")}
                                                            disabled={isUpdating}
                                                        >
                                                            <XCircle className="h-4 w-4 mr-1.5" />
                                                            Reject
                                                        </Button>
                                                    </>
                                                ) : org.status === "ACTIVE" ? (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="rounded-lg font-bold"
                                                        onClick={() => handleStatusChange(org.id, "BANNED")}
                                                        disabled={isUpdating}
                                                    >
                                                        <ShieldAlert className="h-3.5 w-3.5 mr-1.5" />
                                                        Ban
                                                    </Button>
                                                ) : org.status === "BANNED" ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="rounded-lg font-bold"
                                                        onClick={() => handleStatusChange(org.id, "ACTIVE")}
                                                        disabled={isUpdating}
                                                    >
                                                        <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                                                        Activate
                                                    </Button>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic px-2">N/A</span>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
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
