"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    Users,
    Building2,
    FileText,
    ShieldCheck,
    Home,
    Menu,
    X,
    ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { APP_NAME_FF, APP_NAME_SS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
    { href: "/admin",               label: "Dashboard",           icon: LayoutDashboard },
    { href: "/admin/users",         label: "Manage Users",        icon: Users           },
    { href: "/admin/organizations", label: "Manage Orgs",         icon: Building2       },
    { href: "/admin/posts",         label: "Manage Posts",        icon: FileText        },
    { href: "/admin/manage-admins", label: "Manage Admins",       icon: ShieldCheck     },
];

// ─── Sidebar content (shared between desktop & mobile drawer) ────────────────
function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);

    return (
        <div className="flex flex-col h-full">
            {/* App brand — links back to home */}
            <Link
                href="/"
                className="flex items-center gap-2 px-4 py-5 mb-2 hover:opacity-80 transition-opacity"
                onClick={onNavigate}
            >
                <span className="text-xl font-black tracking-tight leading-none">
                    <span className="text-primary">{APP_NAME_FF}</span>
                    <span className="text-foreground">{APP_NAME_SS}</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary rounded-full px-2 py-0.5 ml-1">
                    {user?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                </span>
            </Link>

            {/* Home / Feed shortcut */}
            <Link
                href="/"
                onClick={onNavigate}
                className="flex items-center gap-3 mx-2 mb-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
            >
                <Home className="h-4 w-4 flex-shrink-0" />
                <span>Back to Site</span>
                <ChevronRight className="h-3 w-3 ml-auto opacity-50" />
            </Link>

            <div className="mx-3 mb-3 h-px bg-border" />

            {/* Main nav */}
            <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    // Exact match for dashboard root, startsWith for sub-routes
                    const isActive =
                        href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(href);

                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onNavigate}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            )}
                        >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            <span>{label}</span>
                            {isActive && <ChevronRight className="h-3 w-3 ml-auto" />}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function AdminSidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* ── Desktop sidebar (fixed) ── */}
            <aside className="hidden md:flex flex-col w-60 flex-shrink-0 h-screen sticky top-0 border-r border-border bg-card/60 backdrop-blur-sm">
                <SidebarContent />
            </aside>

            {/* ── Mobile hamburger button ── */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-card border border-border shadow-lg"
                onClick={() => setMobileOpen(true)}
                aria-label="Open sidebar"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* ── Mobile drawer overlay ── */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ── Mobile drawer panel ── */}
            <aside
                className={cn(
                    "md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-card border-r border-border shadow-2xl transition-transform duration-300 ease-in-out",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <button
                    className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent transition-colors"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close sidebar"
                >
                    <X className="h-4 w-4" />
                </button>
                <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </aside>
        </>
    );
}
