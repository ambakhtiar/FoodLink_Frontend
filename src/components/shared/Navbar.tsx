"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X, User, LayoutDashboard, Settings, LogOut, Sun, Moon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-9 w-9">
                <span className="sr-only">Toggle theme</span>
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}

const publicRoutes = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

const authenticatedRoutes = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/my-requests", label: "My Requests" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const { isAuthenticated, isHydrated, user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent hydration mismatch
    const showAuthenticatedUI = isHydrated && isAuthenticated;
    const routes = showAuthenticatedUI ? authenticatedRoutes : publicRoutes;

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full pt-2 px-4 sm:px-6 lg:px-8 transition-all duration-300">
            {/* Pill Container */}
            <div className={`mx-auto max-w-7xl rounded-full border border-white/10 dark:border-white/5 shadow-2xl backdrop-blur-xl transition-all duration-300 overflow-hidden ${
                scrolled 
                ? "bg-background/95 h-14 shadow-primary/5" 
                : "bg-background/80 h-16"
            }`}>
                <nav className="relative mx-auto flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="group flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                            <span className="text-lg font-black text-white">
                                {process.env.NEXT_PUBLIC_APP_NAME_FF?.charAt(0) || "F"}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tight text-foreground">
                                {process.env.NEXT_PUBLIC_APP_NAME_FF || "Food"}<span className="text-primary">{process.env.NEXT_PUBLIC_APP_NAME_SS || "Link"}</span>
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 leading-none">Zero Hunger</span>
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:gap-1 rounded-full bg-muted p-1 border border-border">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={`relative rounded-full px-5 py-2 text-sm font-bold transition-all ${
                                pathname === route.href
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                            }`}
                        >
                            {route.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex md:items-center md:gap-4">
                    <ThemeToggle />

                    {showAuthenticatedUI ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-11 w-11 rounded-full p-0 border border-border hover:bg-muted">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                            {user?.name?.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64 rounded-xl p-2 border-border bg-card shadow-xl" align="end">
                                <div className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-foreground/5">
                                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                                        <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                            {user?.name?.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col min-w-0">
                                        <p className="text-sm font-bold truncate text-foreground">{user?.name || "User"}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator className="bg-white/5" />
                                <DropdownMenuItem asChild className="rounded-lg focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                                    <Link href="/profile">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>My Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-lg focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                                    <Link href="/dashboard">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        <span>Control Center</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-lg focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                                    <Link href="/settings">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/5" />
                                <DropdownMenuItem onClick={handleLogout} className="rounded-lg focus:bg-destructive/10 focus:text-destructive text-destructive transition-colors cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Terminate Session</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" asChild className="font-bold text-muted-foreground hover:text-foreground">
                                <Link href="/login">Sign in</Link>
                            </Button>
                            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                                <Link href="/register">Get Started</Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="h-10 w-10 rounded-full hover:bg-foreground/5"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6 text-foreground" />
                        ) : (
                            <Menu className="h-6 w-6 text-foreground" />
                        )}
                    </Button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed inset-x-0 top-[header-height] glass-panel-strong border-t border-white/5 md:hidden z-50 shadow-2xl"
                >
                    <div className="space-y-1 p-6">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center rounded-xl px-4 py-3 text-lg font-bold transition-all ${
                                    pathname === route.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                                }`}
                            >
                                {route.label}
                            </Link>
                        ))}

                        <div className="mt-6 pt-6 border-t border-white/5">
                            {showAuthenticatedUI ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 px-4 py-2 bg-foreground/5 rounded-2xl">
                                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                                            <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                {user?.name?.charAt(0).toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="font-bold text-foreground truncate">{user?.name}</p>
                                            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/profile"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-foreground/5 p-4 hover:bg-foreground/10 transition-colors"
                                        >
                                            <User className="h-5 w-5 text-primary" />
                                            <span className="text-xs font-bold">Profile</span>
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-foreground/5 p-4 hover:bg-foreground/10 transition-colors"
                                        >
                                            <LayoutDashboard className="h-5 w-5 text-primary" />
                                            <span className="text-xs font-bold">Dashboard</span>
                                        </Link>
                                    </div>
                                    <Button
                                        onClick={handleLogout}
                                        variant="destructive"
                                        className="w-full h-12 rounded-2xl font-bold uppercase tracking-widest text-xs"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    <Button variant="outline" asChild className="w-full h-12 rounded-2xl border-white/10 font-bold">
                                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                            Sign in
                                        </Link>
                                    </Button>
                                    <Button asChild className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/10">
                                        <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                            Get Started
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
            </div>
        </header>
    );
}

