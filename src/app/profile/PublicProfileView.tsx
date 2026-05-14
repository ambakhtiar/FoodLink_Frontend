"use client";

import { 
    Star, 
    Activity, 
    ShieldCheck, 
    Calendar,
    MapPin,
    Package
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePublicProfileQuery } from "@/hooks/useUserQueries";
import { FULL_APP_NAME } from "@/lib/constants";
import { ProfileFeed } from "./ProfileFeed";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileSkeleton } from "@/components/shared/skeletons/ProfileSkeleton";
import { useMemo } from "react";

export default function PublicProfileView({ userId }: { userId: string }) {
    const { data: response, isLoading, isError } = usePublicProfileQuery(userId);
    const user = response?.data;

    // Computed profile data for easier access
    const profile = useMemo(() => {
        if (!user) return null;
        return user.userProfile || user.organizationProfile || user.adminProfile;
    }, [user]);

    if (isLoading) return <ProfileSkeleton />;
    if (isError || !user || !profile) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="p-4 bg-rose-500/10 rounded-full">
                    <Activity className="h-10 w-10 text-rose-500" />
                </div>
                <h3 className="text-xl font-black">User Not Found</h3>
                <p className="text-muted-foreground text-sm">The profile you're looking for doesn't exist or is private.</p>
            </div>
        );
    }

    const impactScore = (profile as any).impactScore || 0;
    const authorName = (profile as any).name || (profile as any).orgName || "User";

    return (
        <div className="space-y-8 pb-20">
            {/* Header Banner Section */}
            <div className="relative mb-24">
                <div className="relative h-64 md:h-80 rounded-[3rem] overflow-hidden shadow-2xl z-10">
                    <div className="absolute inset-0 bg-[#0A0A0B]">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/30 via-secondary/10 to-transparent" />
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(var(--primary),0.15),transparent)]" />
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    </div>

                    <div className="absolute top-8 right-8 flex gap-3">
                        {user.isVerified && (
                            <div className="px-4 py-2 rounded-full glass-panel-strong text-[10px] font-black uppercase tracking-widest text-white/80 border-white/5 shadow-xl">
                                {FULL_APP_NAME} Verified
                            </div>
                        )}
                    </div>
                </div>

                {/* Avatar */}
                <div className="absolute -bottom-16 left-8 md:left-16 z-20">
                    <div className="relative group">
                        <Avatar className="h-32 w-32 md:h-40 md:w-40 border-[6px] border-background shadow-2xl ring-1 ring-white/10">
                            <AvatarImage src={user.profilePictureUrl || ""} alt={authorName} className="object-cover" />
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary text-4xl font-black">
                                {authorName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -right-2 -bottom-2 bg-background p-2 rounded-2xl shadow-xl border border-white/10">
                            <div className="bg-primary/10 p-2 rounded-xl">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-20 px-4 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-panel p-8 rounded-[2rem] border-white/10 space-y-8">
                        <div>
                            <h3 className="text-2xl font-black text-foreground">{authorName}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">{user.role}</span>
                                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                <span className="text-xs font-bold text-muted-foreground capitalize">
                                    {user.status?.toLowerCase().replace('_', ' ')}
                                </span>
                            </div>
                        </div>

                        {/* Impact Score Card */}
                        <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-[1.5rem] text-white shadow-lg shadow-primary/20 relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                                <Star className="h-24 w-24 fill-current" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Impact Score</p>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black">{impactScore}</span>
                                <span className="text-sm font-bold opacity-80 mb-1">XP</span>
                            </div>
                            <div className="mt-4 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-white transition-all duration-1000" 
                                    style={{ width: `${Math.min((impactScore % 100), 100)}%` }} 
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-4 pt-4">
                            {(profile as any).establishedYear && (
                                <div className="flex items-center gap-3 text-sm font-bold text-foreground/70">
                                    <div className="p-2 bg-foreground/5 rounded-lg">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <span>Established {(profile as any).establishedYear}</span>
                                </div>
                            )}
                            {((profile as any).latitude && (profile as any).longitude) && (
                                <div className="flex items-center gap-3 text-sm font-bold text-foreground/70">
                                    <div className="p-2 bg-foreground/5 rounded-lg">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <span>Location Shared</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center gap-4 mb-2 px-2">
                        <Activity className="h-5 w-5 text-primary" />
                        <h4 className="text-lg font-black uppercase tracking-widest">Public Activity</h4>
                    </div>
                    
                    <ProfileFeed userId={userId} />
                </div>
            </div>
        </div>
    );
}
