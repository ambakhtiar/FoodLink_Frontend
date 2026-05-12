"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Loader2, Camera, Save, ShieldCheck, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { useUpdateProfileMutation } from "@/hooks/useAuthMutations";
import { toast } from "sonner";

export default function ProfileView() {
    const user = useAuthStore((state) => state.user);
    const updateProfileMutation = useUpdateProfileMutation();
    const [isEditing, setIsEditing] = useState(false);

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
                            FoodLink Verified
                        </div>
                    </div>
                </div>

                {/* Avatar - Positioned outside overflow-hidden wrapper */}
                <div className="absolute -bottom-16 left-8 md:left-16 z-20">
                    <div className="relative">
                        {/* Avatar Circle */}
                        <div className="relative group">
                            <Avatar className="h-40 w-40 md:h-52 md:w-52 border-[8px] border-background shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-background">
                                <AvatarImage src={user.profilePictureUrl || ""} alt={user.name} className="object-cover" />
                                <AvatarFallback className="text-6xl font-black bg-gradient-to-br from-primary to-secondary text-white">
                                    {user.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            {/* Upload overlay on hover */}
                            <button
                                type="button"
                                onClick={() => document.getElementById('avatar-upload')?.click()}
                                className="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
                            >
                                <Camera className="h-8 w-8 text-white" />
                                <span className="text-white text-[10px] font-bold mt-1">Change</span>
                            </button>
                        </div>

                        {/* Remove photo button */}
                        {user.profilePictureUrl && (
                            <button
                                type="button"
                                onClick={async () => {
                                    try {
                                        await updateProfileMutation.mutateAsync({ profilePictureUrl: "" });
                                        toast.success("Profile picture removed");
                                    } catch {
                                        toast.error("Failed to remove picture");
                                    }
                                }}
                                className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg hover:bg-destructive/90 transition-colors"
                                title="Remove photo"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        )}

                        {/* Upload in progress indicator */}
                        {updateProfileMutation.isPending && (
                            <div className="absolute inset-0 rounded-full bg-background/70 flex items-center justify-center">
                                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            </div>
                        )}

                        <input
                            id="avatar-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.size > 5 * 1024 * 1024) {
                                    toast.error("Image must be under 5MB");
                                    return;
                                }
                                const formData = new FormData();
                                formData.append('profilePicture', file);
                                toast.promise(
                                    updateProfileMutation.mutateAsync(formData),
                                    {
                                        loading: 'Uploading photo...',
                                        success: 'Profile photo updated!',
                                        error: 'Upload failed. Try again.',
                                    }
                                );
                                e.target.value = "";
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="pt-20 px-4 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-panel p-8 rounded-[2rem] border-white/10 space-y-6">
                        <div>
                            <h3 className="text-xl font-black text-foreground">{user.name}</h3>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">{user.role}</p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm font-medium">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                                <span>Verified Member</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium">
                                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-[10px] font-black">
                                    {user.status?.charAt(0)}
                                </div>
                                <span className="capitalize">{user.status?.toLowerCase().replace('_', ' ')}</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 space-y-4">
                            <div>
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</Label>
                                <p className="text-sm font-bold mt-1 opacity-60">{user.email}</p>
                            </div>
                            <div>
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                                <p className="text-sm font-bold mt-1 opacity-60">{user.phone || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-8 rounded-[2rem] border-white/10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-foreground">Profile Details</h3>
                            <Button 
                                variant={isEditing ? "ghost" : "outline"} 
                                onClick={() => setIsEditing(!isEditing)}
                                className="rounded-full px-6 font-bold"
                            >
                                {isEditing ? "Cancel" : "Edit Profile"}
                            </Button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {user.role === 'USER' ? (
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                                        <form.Field
                                            name="name"
                                            children={(field) => (
                                                <Input 
                                                    readOnly={!isEditing}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-lg font-bold"
                                                />
                                            )}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Organization Name</Label>
                                        <form.Field
                                            name="orgName"
                                            children={(field) => (
                                                <Input 
                                                    readOnly={!isEditing}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-lg font-bold"
                                                />
                                            )}
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Location (Lat/Long)</Label>
                                    <div className="grid grid-cols-2 gap-3">
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
                                                    className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 font-mono"
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
                                                    className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 font-mono"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                {user.role === 'ORGANIZATION' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Established Year</Label>
                                            <form.Field
                                                name="establishedYear"
                                                children={(field) => (
                                                    <Input 
                                                        type="number"
                                                        readOnly={!isEditing}
                                                        value={field.state.value || ""}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(parseInt(e.target.value))}
                                                        className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-lg font-bold"
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Registration ID</Label>
                                            <form.Field
                                                name="registrationNumber"
                                                children={(field) => (
                                                    <Input 
                                                        readOnly={!isEditing}
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-lg font-bold"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            {isEditing && (
                                <div className="flex justify-end pt-6">
                                    <Button 
                                        type="submit" 
                                        className="rounded-xl px-8 font-black uppercase tracking-widest gap-2 h-12"
                                        disabled={updateProfileMutation.isPending}
                                    >
                                        {updateProfileMutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
