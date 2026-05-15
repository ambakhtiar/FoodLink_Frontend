"use client";

import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Bell,
    LogOut,
    ChevronDown,
    Shield,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminHeader({ title }: { title?: string }) {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "AD";

    const roleBadge = user?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin";

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 bg-background/80 backdrop-blur-sm border-b border-border">
            {/* Left — page title (optional) */}
            <div className="text-sm font-bold text-muted-foreground tracking-wide">
                {title ?? "Admin Panel"}
            </div>

            {/* Right — actions */}
            <div className="flex items-center gap-2">
                {/* Notification bell (placeholder — Phase 4) */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
                    aria-label="Notifications"
                >
                    <Bell className="h-4.5 w-4.5" />
                    {/* Unread indicator dot */}
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                </Button>

                {/* User dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2.5 h-9 pl-2 pr-3 rounded-xl hover:bg-accent"
                        >
                            <Avatar className="h-7 w-7 ring-2 ring-primary/20">
                                <AvatarImage src={user?.profilePictureUrl ?? undefined} alt={user?.name} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:flex flex-col items-start leading-none">
                                <span className="text-xs font-bold truncate max-w-[120px]">{user?.name ?? "Admin"}</span>
                                <span className="text-[10px] text-muted-foreground font-medium">{roleBadge}</span>
                            </div>
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-bold">{user?.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-muted-foreground" disabled>
                            <Shield className="h-3.5 w-3.5" />
                            {roleBadge}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                            onClick={logout}
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
