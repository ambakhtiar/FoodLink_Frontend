"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { useLoginMutation, useGoogleLoginMutation } from "@/hooks/useAuthMutations";
import { useAuthStore } from "@/store/authStore";

const DEMO_CREDENTIALS: LoginInput = {
    email: "demo@foodlink.com",
    password: "demo123",
};

import { useGoogleLogin } from "@react-oauth/google";

export function LoginForm() {
    const loginMutation = useLoginMutation();
    const googleMutation = useGoogleLoginMutation();
    const [showPassword, setShowPassword] = useState(false);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        } as LoginInput,
        validators: {
            onSubmit: loginSchema,
        },
        onSubmit: async ({ value }: { value: LoginInput }) => {
            loginMutation.mutate(value);
        },
    });

    const handleDemoLogin = () => {
        loginMutation.mutate(DEMO_CREDENTIALS);
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            // The hook gives access_token. 
            // We'll update the backend to verify it or use id_token.
            // For now, let's assume we send the token to the backend.
            googleMutation.mutate({ googleToken: tokenResponse.access_token });
        },
        onError: () => {
            toast.error("Google Login Failed");
        },
    });

    return (
        <div className="glass-panel-strong relative overflow-hidden rounded-[2.5rem] p-10 border-white/10 shadow-2xl">
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative z-10 space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black tracking-tight text-foreground">
                        Welcome Back
                    </h2>
                    <p className="text-muted-foreground font-medium mt-2">
                        Enter your email and password to log in
                    </p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="space-y-5"
                >
                    <form.Field
                        name="email"
                        children={(field: any) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    Email
                                </Label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="text"
                                    placeholder="name@company.com"
                                    autoComplete="email"
                                    className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all text-lg"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    disabled={loginMutation.isPending}
                                />
                                {field.state.meta.errors.length > 0 && (
                                    <p className="text-xs font-bold text-destructive mt-1 ml-1">
                                        {field.state.meta.errors.join(", ")}
                                    </p>
                                )}
                            </div>
                        )}
                    />

                    <form.Field
                        name="password"
                        children={(field: any) => (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <Label htmlFor={field.name} className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                        Password
                                    </Label>
                                    <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all text-lg pr-12"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        disabled={loginMutation.isPending}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loginMutation.isPending}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </Button>
                                </div>
                                {field.state.meta.errors.length > 0 && (
                                    <p className="text-xs font-bold text-destructive mt-1 ml-1">
                                        {field.state.meta.errors.join(", ")}
                                    </p>
                                )}
                            </div>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            "Log In"
                        )}
                    </Button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/5" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em]">
                        <span className="bg-background px-4 text-muted-foreground/60">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <Button
                        variant="outline"
                        type="button"
                        className="h-14 rounded-2xl border-white/10 bg-white/5 font-bold hover:bg-white/10 transition-all"
                        onClick={handleGoogleLogin}
                        disabled={googleMutation.isPending}
                    >
                        <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Login with Google
                    </Button>

                    <Button
                        variant="secondary"
                        type="button"
                        className="h-14 rounded-2xl bg-secondary/10 text-secondary font-bold hover:bg-secondary/20 transition-all"
                        onClick={handleDemoLogin}
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Try Demo Account
                    </Button>
                </div>

                <div className="pt-6 text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                        New to the movement?{" "}
                        <Link
                            href="/auth/register"
                            className="text-primary font-black hover:underline underline-offset-4"
                        >
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
