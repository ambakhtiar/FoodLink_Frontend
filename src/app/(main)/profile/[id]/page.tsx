import { Metadata } from "next";
import { Suspense } from "react";
import PublicProfileView from "@/components/profile/PublicProfileView";
import { ProfileSkeleton } from "@/components/shared/skeletons/ProfileSkeleton";
import { FULL_APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
    title: `User Profile | ${FULL_APP_NAME}`,
    description: `View user profile and activity on ${FULL_APP_NAME}.`,
};

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <main className="min-h-screen bg-background pt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Suspense fallback={<ProfileSkeleton />}>
                    <PublicProfileView userId={id} />
                </Suspense>
            </div>
        </main>
    );
}
