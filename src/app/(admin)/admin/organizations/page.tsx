import { Metadata } from "next";
import { FULL_APP_NAME } from "@/lib/constants";
import { OrganizationsTable } from "@/components/admin/organizations/OrganizationsTable";
import { Building2 } from "lucide-react";

export const metadata: Metadata = {
    title: `Manage Organizations | ${FULL_APP_NAME} Admin`,
    description: "Manage organizations, review pending applications, and update account statuses.",
};

export default function AdminOrganizationsPage() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <Building2 className="h-4 w-4" />
                    <span>Organization Management</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight">Manage Organizations</h1>
                <p className="text-muted-foreground font-medium">
                    Review pending applications and manage all organization accounts.
                </p>
            </div>

            <div className="glass-panel rounded-2xl border border-border/60 overflow-hidden">
                <OrganizationsTable />
            </div>
        </div>
    );
}
