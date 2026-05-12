"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Loader2, Eye, EyeOff, Zap, User, Building2, ShieldCheck, UtensilsCrossed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { useLoginMutation, useGoogleLoginMutation } from "@/hooks/useAuthMutations";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { FULL_APP_NAME } from "@/lib/constants";
import { useGoogleLogin } from "@react-oauth/google";

const DEMO_ACCOUNTS = [
    {
        label: "User",
        icon: User,
        email: "user@demo.com",
        password: "112233",
        colorClass: "text-blue-400",
        ringClass: "ring-blue-500/30 hover:ring-blue-500/60",
        bgClass: "bg-blue-500/10",
    },
    {
        label: "Org",
        icon: Building2,
        email: "org@demo.com",
        password: "112233",
        colorClass: "text-cyan-400",
        ringClass: "ring-cyan-500/30 hover:ring-cyan-500/60",
        bgClass: "bg-cyan-500/10",
    },
    {
        label: "Admin",
        icon: ShieldCheck,
        email: "admin@demo.com",
        password: "112233",
        colorClass: "text-amber-400",
        ringClass: "ring-amber-500/30 hover:ring-amber-500/60",
        bgClass: "bg-amber-500/10",
    },
];

export function LoginForm() {
    const loginMutation = useLoginMutation();
    const googleMutation = useGoogleLoginMutation();
    const [showPassword, setShowPassword] = useState(false);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) router.push("/");
    }, [isAuthenticated, router]);

    const form = useForm({
        defaultValues: { email: "", password: "" } as LoginInput,
        validators: { onSubmit: loginSchema },
        onSubmit: async ({ value }: { value: LoginInput }) => {
            loginMutation.mutate(value);
        },
    });

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            googleMutation.mutate({ googleToken: tokenResponse.access_token });
        },
        onError: () => {
            toast.error("Google Login Failed");
        },
    });

    const isLoading = loginMutation.isPending || googleMutation.isPending;

    return (
        <>

            {/* ─── Main Card ─── */}
            <div className="glass-panel-strong overflow-hidden rounded-[2rem] border border-white/10 dark:border-white/5">

                {/* Top gradient accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]" />

                <div className="p-8 space-y-6">
                    {/* Header */}
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black tracking-tight text-foreground">
                            Welcome back
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Sign in to continue to {FULL_APP_NAME}
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
                        className="space-y-4"
                    >
                        <form.Field
                            name="email"
                            children={(field: any) => (
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="text"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        className="h-12 rounded-xl bg-muted/40 dark:bg-white/5 border-border dark:border-white/10 focus-visible:border-primary/60 focus-visible:ring-primary/20 text-base"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-xs font-medium text-destructive">{field.state.meta.errors.join(", ")}</p>
                                    )}
                                </div>
                            )}
                        />

                        <form.Field
                            name="password"
                            children={(field: any) => (
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                            Password
                                        </Label>
                                        <Link
                                            href="/auth/forgot-password"
                                            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                            className="h-12 rounded-xl bg-muted/40 dark:bg-white/5 border-border dark:border-white/10 focus-visible:border-primary/60 focus-visible:ring-primary/20 text-base pr-12"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {field.state.meta.errors.length > 0 && (
                                        <p className="text-xs font-medium text-destructive">{field.state.meta.errors.join(", ")}</p>
                                    )}
                                </div>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/20"
                            disabled={isLoading}
                        >
                            {loginMutation.isPending
                                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>
                                : "Sign In"
                            }
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center gap-3">
                        <div className="flex-1 border-t border-border dark:border-white/10" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">or</span>
                        <div className="flex-1 border-t border-border dark:border-white/10" />
                    </div>

                    {/* Google Login */}
                    <button
                        type="button"
                        onClick={() => handleGoogleLogin()}
                        disabled={isLoading}
                        className="w-full h-12 rounded-xl border border-border dark:border-white/10 bg-white dark:bg-white/5 hover:bg-muted/50 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-3 font-semibold text-sm text-foreground disabled:opacity-50"
                    >
                        {googleMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : (
                            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        )}
                        {googleMutation.isPending ? "Connecting..." : "Continue with Google"}
                    </button>

                    {/* Register link */}
                    <p className="text-center text-sm text-muted-foreground">
                        New here?{" "}
                        <Link href="/auth/register" className="text-primary font-bold hover:text-primary/80 transition-colors">
                            Create account
                        </Link>
                    </p>
                </div>

                {/* ─── Demo Accounts ─── */}
                <div className="border-t border-border dark:border-white/5 bg-muted/20 dark:bg-white/[0.02] px-8 py-6">
                    {/* Section label with line */}
                    <div className="relative flex items-center gap-3 mb-5">
                        <div className="flex-1 border-t border-dashed border-border dark:border-white/10" />
                        <div className="flex items-center gap-1.5 px-2">
                            <Zap className="h-3 w-3 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground whitespace-nowrap">
                                Demo Accounts
                            </span>
                        </div>
                        <div className="flex-1 border-t border-dashed border-border dark:border-white/10" />
                    </div>

                    {/* Demo cards */}
                    <div className="grid grid-cols-3 gap-2.5">
                        {DEMO_ACCOUNTS.map((account) => {
                            const Icon = account.icon;
                            return (
                                <button
                                    key={account.label}
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() => loginMutation.mutate({ email: account.email, password: account.password })}
                                    className={`group flex flex-col items-center gap-2 p-3.5 rounded-2xl ring-1 transition-all duration-200 disabled:opacity-40 ${account.ringClass} ${account.bgClass}`}
                                >
                                    <div className={`h-8 w-8 rounded-full bg-background/60 dark:bg-black/30 flex items-center justify-center ${account.colorClass}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="text-center">
                                        <p className={`text-[11px] font-black uppercase tracking-wider ${account.colorClass}`}>
                                            {account.label}
                                        </p>
                                        <p className="text-[9px] text-muted-foreground font-medium mt-0.5 truncate max-w-full">
                                            {account.email}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-center text-[10px] text-muted-foreground mt-4">
                        Password for all demo accounts:{" "}
                        <code className="font-black text-foreground bg-muted dark:bg-white/10 px-1.5 py-0.5 rounded-md">112233</code>
                    </p>
                </div>
            </div>
        </>
    );
}
