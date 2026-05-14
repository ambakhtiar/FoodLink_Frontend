"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { 
    Loader2, 
    Camera, 
    Save, 
    ShieldCheck, 
    Trash2, 
    Star, 
    Activity, 
    User as UserIcon,
    ShoppingBag
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { useUpdateProfileMutation } from "@/hooks/useAuthMutations";
import { toast } from "sonner";
import { FULL_APP_NAME } from "@/lib/constants";
import Link from "next/link";

import { ProfilePictureForm } from "@/components/profile/ProfilePictureForm";

import { ProfileFeed } from "./ProfileFeed";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileView() {
    const user = useAuthStore((state) => state.user);
    const updateProfileMutation = useUpdateProfileMutation();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<"profile" | "activity">("activity");

    const form = useForm({
        defaultValues: {
            name: user?.name || "",
            orgName: user?.profile?.orgName || "",
            latitude: user?.latitude || 0,
            longitude: user?.longitude || 0,
            establishedYear: user?.profile?.establishedYear || undefined,
            registrationNumber: user?.profile?.registrationNumber || "",
        },
        onSubmit: async ({ value }) => {
            await updateProfileMutation.mutateAsync(value);
            setIsEditing(false);
        },
    });

    if (!user) return null;

    const impactScore = user.profile?.impactScore || 0;

    return (
        <div className="space-y-8 pb-20">
            {/* Header Banner Section */}
            <div className="relative mb-24">
                <div className="relative h-64 md:h-80 rounded-[3rem] overflow-hidden shadow-2xl z-10">
                    {/* Professional Abstract Background */}
                    <div className="absolute inset-0 bg-[#0A0A0B]">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/30 via-secondary/10 to-transparent" />
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    </div>

                    {/* Cover Decorations */}
                    <div className="absolute top-8 right-8 flex gap-3">
                        <div className="px-4 py-2 rounded-full glass-panel-strong text-[10px] font-black uppercase tracking-widest text-white/80 border-white/5 shadow-xl">
                            {FULL_APP_NAME} Verified
                        </div>
                    </div>
                </div>

                {/* Avatar - Positioned outside overflow-hidden wrapper */}
                <div className="absolute -bottom-16 left-8 md:left-16 z-20">
                    <ProfilePictureForm />
                </div>
            </div>

            <div className="pt-20 px-4 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-panel p-8 rounded-[2rem] border-white/10 space-y-8">
                        <div>
                            <h3 className="text-2xl font-black text-foreground">{user.name}</h3>
                            <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mt-2">{user.role}</p>
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
                            <p className="text-[9px] font-bold mt-2 opacity-70 italic">Keep sharing to increase your impact!</p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                </div>
                                <span>Verified Member</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                                <div className="p-2 bg-foreground/5 rounded-lg">
                                    <div className="h-4 w-4 flex items-center justify-center text-[10px] font-black text-primary">
                                        {user.status?.charAt(0)}
                                    </div>
                                </div>
                                <span className="capitalize">{user.status?.toLowerCase().replace('_', ' ')}</span>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 space-y-6">
                            <div>
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</Label>
                                <p className="text-sm font-bold mt-1 text-foreground/70">{user.email}</p>
                            </div>
                            <div>
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                                <p className="text-sm font-bold mt-1 text-foreground/70">{user.phone || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Section with Tabs */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Custom Premium Tabs */}
                    <div className="flex p-1.5 bg-foreground/5 rounded-2xl w-fit">
                        <button
                            onClick={() => setActiveTab("activity")}
                            className={`flex items-center gap-2.5 px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                                activeTab === "activity"
                                    ? "bg-background text-primary shadow-lg shadow-black/5"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <Activity className="h-4 w-4" />
                            Feed
                        </button>
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`flex items-center gap-2.5 px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                                activeTab === "profile"
                                    ? "bg-background text-primary shadow-lg shadow-black/5"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <UserIcon className="h-4 w-4" />
                            Details
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === "activity" && (
                            <motion.div
                                key="activity"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ProfileFeed />
                            </motion.div>
                        )}

                        {activeTab === "profile" && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="glass-panel p-8 rounded-[2.5rem] border-white/10"
                            >
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-2xl font-black text-foreground">Profile Settings</h3>
                                    <Button 
                                        variant={isEditing ? "ghost" : "outline"} 
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="rounded-full px-8 font-black uppercase tracking-widest text-xs h-10"
                                    >
                                        {isEditing ? "Cancel" : "Edit Details"}
                                    </Button>
                                </div>

                                <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {user.role === 'USER' ? (
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</Label>
                                                <form.Field
                                                    name="name"
                                                    children={(field) => (
                                                        <Input 
                                                            readOnly={!isEditing}
                                                            value={field.state.value}
                                                            onBlur={field.handleBlur}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-lg font-bold px-6"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Organization Name</Label>
                                                <form.Field
                                                    name="orgName"
                                                    children={(field) => (
                                                        <Input 
                                                            readOnly={!isEditing}
                                                            value={field.state.value}
                                                            onBlur={field.handleBlur}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-lg font-bold px-6"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Location (Lat/Long)</Label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <form.Field
                                                    name="latitude"
                                                    children={(field) => (
                                                        <Input 
                                                            type="number"
                                                            step="any"
                                                            readOnly={!isEditing}
                                                            value={field.state.value}
                                                            onBlur={field.handleBlur}
                                                            onChange={(e) => field.handleChange(parseFloat(e.target.value))}
                                                            className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 font-mono px-6"
                                                        />
                                                    )}
                                                />
                                                <form.Field
                                                    name="longitude"
                                                    children={(field) => (
                                                        <Input 
                                                            type="number"
                                                            step="any"
                                                            readOnly={!isEditing}
                                                            value={field.state.value}
                                                            onBlur={field.handleBlur}
                                                            onChange={(e) => field.handleChange(parseFloat(e.target.value))}
                                                            className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 font-mono px-6"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {user.role === 'ORGANIZATION' && (
                                            <>
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Established Year</Label>
                                                    <form.Field
                                                        name="establishedYear"
                                                        children={(field) => (
                                                            <Input 
                                                                type="number"
                                                                readOnly={!isEditing}
                                                                value={field.state.value || ""}
                                                                onBlur={field.handleBlur}
                                                                onChange={(e) => field.handleChange(parseInt(e.target.value))}
                                                                className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-lg font-bold px-6"
                                                            />
                                                        )}
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Registration ID</Label>
                                                    <form.Field
                                                        name="registrationNumber"
                                                        children={(field) => (
                                                            <Input 
                                                                readOnly={!isEditing}
                                                                value={field.state.value}
                                                                onBlur={field.handleBlur}
                                                                onChange={(e) => field.handleChange(e.target.value)}
                                                                className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-lg font-bold px-6"
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {isEditing && (
                                        <div className="flex justify-end pt-8">
                                            <Button 
                                                type="submit" 
                                                className="rounded-2xl px-10 font-black uppercase tracking-widest gap-3 h-14 shadow-lg shadow-primary/20"
                                                disabled={updateProfileMutation.isPending}
                                            >
                                                {updateProfileMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                                                Apply Changes
                                            </Button>
                                        </div>
                                    )}
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
