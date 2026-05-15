import { Metadata } from "next";
import { FULL_APP_NAME } from "@/lib/constants";
import {
    Users,
    FileText,
    Building2,
    TrendingUp,
    Activity,
    Clock,
} from "lucide-react";

export const metadata: Metadata = {
    title: `Dashboard | ${FULL_APP_NAME} Admin`,
    description: "Admin dashboard overview",
};

interface StatCard {
    label: string;
    value: string;
    change: string;
    positive: boolean;
    icon: React.ElementType;
    color: string;
}

const STAT_CARDS: StatCard[] = [
    {
        label: "Total Users",
        value: "—",
        change: "Live data coming in Phase 3",
        positive: true,
        icon: Users,
        color: "text-blue-500",
    },
    {
        label: "Total Posts",
        value: "—",
        change: "Live data coming in Phase 3",
        positive: true,
        icon: FileText,
        color: "text-emerald-500",
    },
    {
        label: "Pending Organizations",
        value: "—",
        change: "Requires your review",
        positive: false,
        icon: Building2,
        color: "text-amber-500",
    },
];

export default function AdminDashboardPage() {
    return (
        <div className="p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <Activity className="h-4 w-4" />
                    <span>Overview</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground font-medium">
                    Manage your platform from one place.
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {STAT_CARDS.map(({ label, value, change, positive, icon: Icon, color }) => (
                    <div
                        key={label}
                        className="glass-panel rounded-2xl p-6 border border-border/60 space-y-4 hover:border-primary/30 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                {label}
                            </span>
                            <div className={`p-2 rounded-xl bg-muted/60`}>
                                <Icon className={`h-5 w-5 ${color}`} />
                            </div>
                        </div>
                        <p className="text-4xl font-black tracking-tight">{value}</p>
                        <div className="flex items-center gap-1.5">
                            <TrendingUp
                                className={`h-3.5 w-3.5 ${positive ? "text-emerald-500" : "text-amber-500"}`}
                            />
                            <span className="text-xs text-muted-foreground font-medium">
                                {change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder content area */}
            <div className="glass-panel rounded-2xl border border-border/60 p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[300px]">
                <div className="p-4 rounded-2xl bg-primary/10">
                    <Clock className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-black">Phase 3 — Analytics Coming Soon</h2>
                    <p className="text-sm text-muted-foreground font-medium mt-1 max-w-sm">
                        Charts, real-time stats, and management tables will be implemented in the next phase.
                    </p>
                </div>
            </div>
        </div>
    );
}
