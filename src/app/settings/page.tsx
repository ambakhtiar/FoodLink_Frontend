import { Metadata } from "next";
import ChangePasswordForm from "./ChangePasswordForm";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Settings, Shield } from "lucide-react";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { FULL_APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
    title: `Account Settings | ${FULL_APP_NAME}`,
    description: "Manage your account security and preferences.",
};

export default function SettingsPage() {
    return (
        <AuthGuard>
            <Navbar />
            <main className="min-h-screen bg-background pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Settings className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-foreground">Settings</h1>
                            <p className="text-muted-foreground font-medium">Manage your account and security preferences</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 px-2">
                                <Shield className="h-4 w-4 text-primary" />
                                <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Security</h2>
                            </div>
                            <ChangePasswordForm />
                        </section>

                        {/* Add more setting sections here later */}
                    </div>
                </div>
            </main>
        </AuthGuard>
    );
}
