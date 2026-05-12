import { Metadata } from "next";
import CompleteProfileForm from "./CompleteProfileForm";
import { FULL_APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
    title: `Complete Profile | ${FULL_APP_NAME}`,
    description: "Please provide your phone and location to complete your registration.",
};

export default function CompleteProfilePage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]" />
            </div>

            <div className="w-full max-w-[500px]">
                <CompleteProfileForm />
            </div>
        </div>
    );
}
