"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { Loader2, ArrowLeft, Mail, ShieldCheck, Lock, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    useForgotPasswordMutation, 
    useVerifyOtpMutation, 
    useResetPasswordMutation 
} from "@/hooks/useAuthMutations";

type Step = "REQUEST" | "VERIFY" | "RESET";

export default function ForgotPasswordForm() {
    const [step, setStep] = useState<Step>("REQUEST");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const forgotPasswordMutation = useForgotPasswordMutation();
    const verifyOtpMutation = useVerifyOtpMutation();
    const resetPasswordMutation = useResetPasswordMutation();

    // Step 1: Request OTP
    const requestForm = useForm({
        defaultValues: { email: "" },
        onSubmit: async ({ value }) => {
            await forgotPasswordMutation.mutateAsync(value.email);
            setEmail(value.email);
            setStep("VERIFY");
        },
    });

    // Step 2: Verify OTP
    const verifyForm = useForm({
        defaultValues: { otp: "" },
        onSubmit: async ({ value }) => {
            await verifyOtpMutation.mutateAsync({ email, otp: value.otp });
            setOtp(value.otp);
            setStep("RESET");
        },
    });

    // Step 3: Reset Password
    const resetForm = useForm({
        defaultValues: { password: "", confirmPassword: "" },
        onSubmit: async ({ value }) => {
            if (value.password !== value.confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }
            await resetPasswordMutation.mutateAsync({ 
                email, 
                otp, 
                newPassword: value.password 
            });
        },
    });

    return (
        <div className="glass-panel-strong relative overflow-hidden rounded-[2.5rem] p-10 border-white/10 shadow-2xl">
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative z-10 space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black tracking-tight text-foreground">
                        {step === "REQUEST" && "Recover Access"}
                        {step === "VERIFY" && "Identity Check"}
                        {step === "RESET" && "Set New Security"}
                    </h2>
                    <p className="text-muted-foreground font-medium mt-2">
                        {step === "REQUEST" && "Enter your email to receive a security code"}
                        {step === "VERIFY" && `We've sent a code to ${email}`}
                        {step === "RESET" && "Choose a strong password you haven't used before"}
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className={`h-2 w-12 rounded-full transition-all ${step === "REQUEST" ? "bg-primary" : "bg-primary/20"}`} />
                    <div className={`h-2 w-12 rounded-full transition-all ${step === "VERIFY" ? "bg-primary" : "bg-primary/20"}`} />
                    <div className={`h-2 w-12 rounded-full transition-all ${step === "RESET" ? "bg-primary" : "bg-primary/20"}`} />
                </div>

                {step === "REQUEST" && (
                    <form onSubmit={(e) => { e.preventDefault(); requestForm.handleSubmit(); }} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    placeholder="name@example.com" 
                                    className="h-14 pl-12 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-lg"
                                    value={requestForm.state.values.email}
                                    onChange={(e) => requestForm.setFieldValue("email", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button 
                            className="w-full h-14 rounded-2xl bg-primary font-black uppercase tracking-widest"
                            disabled={forgotPasswordMutation.isPending}
                        >
                            {forgotPasswordMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Send Security Code"}
                        </Button>
                    </form>
                )}

                {step === "VERIFY" && (
                    <form onSubmit={(e) => { e.preventDefault(); verifyForm.handleSubmit(); }} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">6-Digit Code</Label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    placeholder="000000" 
                                    className="h-14 pl-12 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-lg tracking-[0.5em] font-black"
                                    maxLength={6}
                                    value={verifyForm.state.values.otp}
                                    onChange={(e) => verifyForm.setFieldValue("otp", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button 
                            className="w-full h-14 rounded-2xl bg-primary font-black uppercase tracking-widest"
                            disabled={verifyOtpMutation.isPending}
                        >
                            {verifyOtpMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Verify Code"}
                        </Button>
                        <button 
                            type="button" 
                            onClick={() => setStep("REQUEST")}
                            className="w-full text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Change Email
                        </button>
                    </form>
                )}

                {step === "RESET" && (
                    <form onSubmit={(e) => { e.preventDefault(); resetForm.handleSubmit(); }} className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    type="password"
                                    placeholder="••••••••" 
                                    className="h-14 pl-12 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-lg"
                                    value={resetForm.state.values.password}
                                    onChange={(e) => resetForm.setFieldValue("password", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    type="password"
                                    placeholder="••••••••" 
                                    className="h-14 pl-12 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-lg"
                                    value={resetForm.state.values.confirmPassword}
                                    onChange={(e) => resetForm.setFieldValue("confirmPassword", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button 
                            className="w-full h-14 rounded-2xl bg-primary font-black uppercase tracking-widest"
                            disabled={resetPasswordMutation.isPending}
                        >
                            {resetPasswordMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Finalize Change"}
                        </Button>
                    </form>
                )}

                <div className="pt-6 text-center border-t border-white/5">
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Log In
                    </Link>
                </div>
            </div>
        </div>
    );
}
