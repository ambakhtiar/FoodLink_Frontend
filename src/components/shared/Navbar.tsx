"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
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
        router.push("/auth/login");
        setMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full pt-2 px-4 sm:px-6 lg:px-8 transition-all duration-300">
            {/* Pill Container */}
            <div className={`mx-auto max-w-7xl rounded-[2rem] border border-white/10 dark:border-white/5 shadow-2xl backdrop-blur-xl transition-all duration-300 relative ${scrolled
                ? "bg-background/95 h-14 shadow-primary/5"
                : "bg-background/80 h-16"
                } ${mobileMenuOpen ? "rounded-[2rem]" : "rounded-full"}`}>
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
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 leading-none">
                                    {process.env.NEXT_PUBLIC_APP_MOTTO || "Zero Hunger"}
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex lg:items-center lg:gap-1 rounded-full bg-muted p-1 border border-border">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={`relative rounded-full px-5 py-2 text-sm font-bold transition-all ${pathname === route.href
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                                    }`}
                            >
                                {route.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex lg:items-center lg:gap-4">
                        <ThemeToggle />

                        {showAuthenticatedUI ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-11 w-11 rounded-full p-0 border border-border hover:bg-muted">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={user?.profilePictureUrl || ""} alt={user?.name || "User"} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                {user?.name?.charAt(0).toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 rounded-xl p-2 border-border bg-card shadow-xl" align="end">
                                    <div className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-foreground/5">
                                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                                            <AvatarImage src={user?.profilePictureUrl || ""} alt={user?.name || "User"} />
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
                                        <span>Log Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" asChild className="font-bold text-muted-foreground hover:text-foreground">
                                    <Link href="/auth/login">Sign in</Link>
                                </Button>
                                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                                    <Link href="/auth/register">Register</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile/Tablet Menu Button */}
                    <div className="flex items-center gap-2 lg:hidden">
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

                {/* Mobile Menu Side Drawer */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setMobileMenuOpen(false)}
                                className="fixed inset-0 bg-background/60 backdrop-blur-md lg:hidden z-[60]"
                            />
                            
                            {/* Drawer Content */}
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed right-0 top-0 h-[100dvh] w-[85%] max-w-sm bg-background lg:hidden z-[70] shadow-2xl flex flex-col border-l border-border"
                            >
                                <div className="flex items-center justify-between p-6 border-b border-border bg-background">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                            <span className="text-white font-black">F</span>
                                        </div>
                                        <span className="font-black text-foreground">Menu</span>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="rounded-full">
                                        <X className="h-6 w-6" />
                                    </Button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-2">
                                    {routes.map((route) => (
                                        <Link
                                            key={route.href}
                                            href={route.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center rounded-2xl px-5 py-4 text-xl font-bold transition-all ${pathname === route.href
                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                                                }`}
                                        >
                                            {route.label}
                                        </Link>
                                    ))}
                                    
                                    <div className="mt-8 pt-8 border-t border-white/5">
                                        {showAuthenticatedUI ? (
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-4 p-4 bg-foreground/5 rounded-[1.5rem]">
                                                    <Avatar className="h-14 w-14 border-2 border-primary/20">
                                                        <AvatarImage src={user?.profilePictureUrl || ""} alt={user?.name || "User"} />
                                                        <AvatarFallback className="bg-primary/10 text-primary font-black">
                                                            {user?.name?.charAt(0).toUpperCase() || "U"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <p className="font-black text-foreground truncate">{user?.name}</p>
                                                        <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Link
                                                        href="/profile"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="flex flex-col items-center justify-center gap-3 rounded-[1.5rem] bg-foreground/5 p-6 hover:bg-foreground/10 transition-colors group"
                                                    >
                                                        <User className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
                                                    </Link>
                                                    <Link
                                                        href="/dashboard"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="flex flex-col items-center justify-center gap-3 rounded-[1.5rem] bg-foreground/5 p-6 hover:bg-foreground/10 transition-colors group"
                                                    >
                                                        <LayoutDashboard className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Dash</span>
                                                    </Link>
                                                </div>
                                                <Button
                                                    onClick={handleLogout}
                                                    className="w-full h-14 rounded-2xl bg-destructive hover:bg-destructive/90 font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-destructive/20"
                                                >
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    Logout
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="grid gap-4">
                                                <Button variant="outline" asChild className="w-full h-14 rounded-2xl border-white/10 font-bold">
                                                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                                                        Sign in
                                                    </Link>
                                                </Button>
                                                <Button asChild className="bg-primary hover:bg-primary/90 font-black shadow-lg shadow-primary/20 w-full h-14 rounded-2xl">
                                                    <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                                                        Register Now
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 border-t border-white/5 flex justify-center gap-4">
                                    <ThemeToggle />
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 flex items-center">
                                        FoodLink v1.0
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}

