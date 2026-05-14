import { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { FULL_APP_NAME } from "@/lib/constants";
import MyRequestsView from "./MyRequestsView";

export const metadata: Metadata = {
    title: `My Requests | ${FULL_APP_NAME}`,
    description: `Track your item requests and their status on ${FULL_APP_NAME}.`,
};

export default function MyRequestsPage() {
    return (
        <AuthGuard>
            <Navbar />
            <main className="min-h-screen bg-muted/20 pt-10 pb-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <MyRequestsView />
                </div>
            </main>
        </AuthGuard>
    );
}
