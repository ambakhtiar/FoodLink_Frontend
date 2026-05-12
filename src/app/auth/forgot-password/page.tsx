import { Metadata } from "next";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { FULL_APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
    title: `Recover Access | ${FULL_APP_NAME}`,
    description: `Reset your password and regain access to your ${FULL_APP_NAME} account.`,
};

export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]" />
            </div>

            <div className="w-full max-w-[500px]">
                <ForgotPasswordForm />
            </div>
        </div>
    );
}
