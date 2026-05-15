import { Metadata } from "next";
import { FULL_APP_NAME } from "@/lib/constants";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { Users } from "lucide-react";

export const metadata: Metadata = {
    title: `Manage Users | ${FULL_APP_NAME} Admin`,
    description: "Manage users, view details, and handle account statuses.",
};

export default function AdminUsersPage() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <Users className="h-4 w-4" />
                    <span>User Management</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight">Manage Users</h1>
                <p className="text-muted-foreground font-medium">
                    View and manage all user accounts across the platform.
                </p>
            </div>

            <div className="glass-panel rounded-2xl border border-border/60 overflow-hidden">
                <UsersTable />
            </div>
        </div>
    );
}
