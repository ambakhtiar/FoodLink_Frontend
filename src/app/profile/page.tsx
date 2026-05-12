import { Metadata } from "next";
import { Suspense } from "react";
import ProfileView from "./ProfileView";
import { ProfileSkeleton } from "@/components/shared/skeletons/ProfileSkeleton";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { AuthGuard } from "@/components/shared/AuthGuard";

export const metadata: Metadata = {
    title: "My Profile | FoodLink",
    description: "Manage your FoodLink profile and activity.",
};

export default function ProfilePage() {
    return (
        <AuthGuard>
            <Navbar />
            <main className="min-h-screen bg-background pt-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Suspense fallback={<ProfileSkeleton />}>
                        <ProfileView />
                    </Suspense>
                </div>
            </main>
            <Footer />
        </AuthGuard>
    );
}
