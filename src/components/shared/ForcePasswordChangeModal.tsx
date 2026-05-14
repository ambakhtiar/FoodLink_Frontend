"use client";

import { useAuthStore } from "@/store/authStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ChangePasswordForm from "@/components/settings/ChangePasswordForm";
import { ShieldAlert } from "lucide-react";

export function ForcePasswordChangeModal() {
    const user = useAuthStore((state) => state.user);
    const needsPasswordChange = user?.needsPasswordChange === true;

    // We do not provide an onOpenChange that can close the dialog.
    // It stays open as long as needsPasswordChange is true.
    return (
        <Dialog open={needsPasswordChange}>
            <DialogContent 
                className="sm:max-w-[600px] p-0 overflow-hidden bg-transparent border-none shadow-none [&>button]:hidden"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <div className="glass-panel p-8 rounded-[2rem] border-primary/20 space-y-6">
                    <DialogHeader className="space-y-4">
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                            <ShieldAlert className="h-8 w-8 text-primary" />
                        </div>
                        <DialogTitle className="text-2xl font-black text-center text-foreground">
                            Action Required
                        </DialogTitle>
                        <DialogDescription className="text-center font-medium text-muted-foreground">
                            Your account requires a password change before you can continue. This was likely enforced by an administrator for your security.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-6">
                        <ChangePasswordForm />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
