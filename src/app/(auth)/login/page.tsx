"use client";

import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { useLoginMutation, useGoogleLoginMutation } from "@/hooks/useAuthMutations";

const DEMO_CREDENTIALS: LoginInput = {
  email: "demo@foodlink.com",
  password: "demo123",
};

export default function LoginPage() {
  const loginMutation = useLoginMutation();
  const googleMutation = useGoogleLoginMutation();

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

  const handleGoogleLogin = () => {
    // Google OAuth flow - open popup to get token
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popup = window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
      "Google Login",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Listen for message from popup
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "GOOGLE_AUTH_SUCCESS") {
        googleMutation.mutate({ googleToken: event.data.token });
        popup?.close();
        window.removeEventListener("message", handleMessage);
      }
    };

    window.addEventListener("message", handleMessage);
  };

  return (
    <div className="glass-panel-strong relative overflow-hidden rounded-[2.5rem] p-10 border-white/10 shadow-2xl">
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      
      <div className="relative z-10 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            Welcome Back
          </h2>
          <p className="text-muted-foreground font-medium mt-2">
            Enter your credentials to access your portal
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
                  Email Identity
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="name@company.com"
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
                    Security Key
                  </Label>
                  <Link href="/forgot-password" size="sm" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
                    Forgot?
                  </Link>
                </div>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  placeholder="••••••••"
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
              "Authorize Access"
            )}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em]">
            <span className="bg-background px-4 text-muted-foreground/60">
              Third Party Auth
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
              Access Demo Environment
            </Button>
        </div>

        <div className="pt-6 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            New to the movement?{" "}
            <Link
              href="/register"
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

