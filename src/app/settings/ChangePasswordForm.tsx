"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2, Lock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { useChangePasswordMutation } from "@/hooks/useAuthMutations";
import { toast } from "sonner";

export default function ChangePasswordForm() {
    const user = useAuthStore((state) => state.user);
    const changePasswordMutation = useChangePasswordMutation();

    const form = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        onSubmit: async ({ value }) => {
            if (value.newPassword !== value.confirmPassword) {
                toast.error("New passwords do not match");
                return;
            }
            await changePasswordMutation.mutateAsync({
                currentPassword: value.currentPassword,
                newPassword: value.newPassword,
            });
            form.reset();
        },
    });

    if (user?.authProvider === "google") {
        return (
            <div className="glass-panel p-8 rounded-[2rem] border-primary/20 bg-primary/5 flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldAlert className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-foreground">OAuth Account</h3>
                    <p className="text-muted-foreground font-medium mt-2 max-w-sm">
                        You are logged in via Google. Your password is managed by Google and cannot be changed here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel p-8 rounded-[2rem] border-white/10 space-y-8">
            <div>
                <h3 className="text-xl font-black text-foreground">Security Settings</h3>
                <p className="text-sm font-medium text-muted-foreground mt-1">Update your password to keep your account secure</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Current Password</Label>
                    <form.Field
                        name="currentPassword"
                        children={(field) => (
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    type="password"
                                    placeholder="••••••••" 
                                    className="h-12 pl-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">New Password</Label>
                        <form.Field
                            name="newPassword"
                            children={(field) => (
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input 
                                        type="password"
                                        placeholder="••••••••" 
                                        className="h-12 pl-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm New Password</Label>
                        <form.Field
                            name="confirmPassword"
                            children={(field) => (
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input 
                                        type="password"
                                        placeholder="••••••••" 
                                        className="h-12 pl-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button 
                        type="submit" 
                        className="rounded-xl px-10 font-black uppercase tracking-widest h-12"
                        disabled={changePasswordMutation.isPending}
                    >
                        {changePasswordMutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Update Password"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
