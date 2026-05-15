"use client";

import { useAdminAdmins } from "@/hooks/useAdminQueries";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DataTableSearch, DataTablePagination } from "@/components/admin/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, User, Building, Calendar } from "lucide-react";

export function AdminsTable() {
    const searchParams = useSearchParams();
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const searchTerm = searchParams.get("search") ?? "";

    const { data, isLoading } = useAdminAdmins({
        page,
        limit: 10,
        searchTerm,
    });

    const admins = data?.data ?? [];
    const meta = data?.meta;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE": return "bg-green-500/10 text-green-600 border-green-200/50";
            case "BANNED": return "bg-destructive/10 text-destructive border-destructive/20";
            default:       return "bg-gray-500/10 text-gray-500 border-gray-200/50";
        }
    };

    return (
        <div className="space-y-0">
            {/* Toolbar */}
            <div className="p-4 border-b border-border/50 flex items-center gap-4 bg-muted/30">
                <div className="w-full max-w-xs">
                    <DataTableSearch placeholder="Search name, email, department..." />
                </div>
            </div>

            {/* Table */}
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="min-w-[200px]">Admin</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell colSpan={5} className="h-14 animate-pulse bg-muted/20" />
                            </TableRow>
                        ))
                    ) : admins.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-40 text-center">
                                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                    <div className="p-3 rounded-2xl bg-muted/50">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <p className="font-medium text-sm">No admins found.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        admins.map((admin) => (
                            <TableRow key={admin.id} className="hover:bg-muted/30 transition-colors">
                                {/* Name + avatar */}
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <User className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-foreground">
                                                {admin.adminProfile?.name ?? "—"}
                                            </span>
                                            <span className="text-[11px] text-muted-foreground font-medium">
                                                {admin.phone ?? "No phone"}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Email */}
                                <TableCell className="text-sm font-medium text-muted-foreground">
                                    {admin.email}
                                </TableCell>

                                {/* Department */}
                                <TableCell>
                                    {admin.adminProfile?.department ? (
                                        <div className="flex items-center gap-1.5 text-sm font-medium">
                                            <Building className="h-3.5 w-3.5 text-muted-foreground" />
                                            {admin.adminProfile.department}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground/60 italic">Not set</span>
                                    )}
                                </TableCell>

                                {/* Status */}
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={`${getStatusColor(admin.status)} font-bold text-[10px] tracking-wider`}
                                    >
                                        {admin.status}
                                    </Badge>
                                </TableCell>

                                {/* Joined date */}
                                <TableCell>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {format(new Date(admin.createdAt), "MMM d, yyyy")}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <div className="p-4 border-t border-border/50 bg-muted/10">
                    <DataTablePagination totalPages={meta.totalPages} />
                </div>
            )}
        </div>
    );
}
