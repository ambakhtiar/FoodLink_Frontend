import { Metadata } from "next";
import { FULL_APP_NAME } from "@/lib/constants";
import { AdminsTable } from "@/components/admin/admins/AdminsTable";
import { CreateAdminDialog } from "@/components/admin/admins/CreateAdminDialog";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
    title: `Manage Admins | ${FULL_APP_NAME} Admin`,
    description: "Create and manage admin accounts for the FoodLink platform.",
};

export default function ManageAdminsPage() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Admin Management</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Manage Admins</h1>
                    <p className="text-muted-foreground font-medium">
                        Create new admin accounts and manage existing ones.
                    </p>
                </div>

                {/* Create button lives here — next to the heading */}
                <CreateAdminDialog />
            </div>

            {/* Admins Table */}
            <div className="glass-panel rounded-2xl border border-border/60 overflow-hidden">
                <AdminsTable />
            </div>
        </div>
    );
}
