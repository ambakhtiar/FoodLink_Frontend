"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Camera, Trash2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { userService } from "@/services/userService";

import { ImageCropper } from "./ImageCropper";

export function ProfilePictureForm() {
    const { user, updateUser } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showOptions, setShowOptions] = useState(false);

    const uploadMutation = useMutation({
        mutationFn: (file: File | Blob) => userService.updateProfilePicture(file as File),
        onSuccess: (response) => {
            updateUser({ profilePictureUrl: response.data.profilePictureUrl });
            toast.success("Profile picture updated successfully");
            setSelectedImage(null);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to upload picture");
            setSelectedImage(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => userService.deleteProfilePicture(),
        onSuccess: () => {
            updateUser({ profilePictureUrl: undefined });
            toast.success("Profile picture removed");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to remove picture");
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }
            
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            e.target.value = ""; // Reset input
        }
    };

    const handleCropComplete = (croppedImage: Blob) => {
        uploadMutation.mutate(croppedImage);
    };

    const isPending = uploadMutation.isPending || deleteMutation.isPending;

    return (
        <div className="relative">
            {/* Avatar Circle */}
            <div className="relative group cursor-pointer" onClick={() => user?.profilePictureUrl ? setShowOptions(!showOptions) : fileInputRef.current?.click()}>
                <Avatar className="h-40 w-40 md:h-52 md:w-52 border-[8px] border-background shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-background overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
                    <AvatarImage 
                        src={user?.profilePictureUrl || ""} 
                        alt={user?.name || "User"} 
                        className="object-cover" 
                    />
                    <AvatarFallback className="text-6xl font-black bg-gradient-to-br from-primary to-secondary text-white">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>

                {/* Interaction Overlay (on hover or when options shown) */}
                <div className={`absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-sm z-20 ${
                    showOptions ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}>
                    
                    {!showOptions ? (
                        <>
                            <Camera className="h-8 w-8 text-white mb-1" />
                            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                {user?.profilePictureUrl ? "Manage" : "Upload"}
                            </span>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-3 w-full px-6" onClick={(e) => e.stopPropagation()}>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-2.5 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-colors shadow-xl"
                            >
                                Upload New
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    deleteMutation.mutate();
                                    setShowOptions(false);
                                }}
                                className="w-full py-2.5 rounded-xl bg-destructive text-white text-[10px] font-black uppercase tracking-widest hover:bg-destructive/90 transition-colors shadow-xl"
                            >
                                Remove Photo
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowOptions(false)}
                                className="mt-2 text-white/60 text-[9px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Skeleton / Loader Overlay */}
            {isPending && (
                <div className="absolute inset-0 rounded-full bg-background/60 backdrop-blur-md flex flex-col items-center justify-center z-40 border-[8px] border-transparent">
                    <div className="relative">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse rounded-full" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-3 animate-pulse">
                        Syncing...
                    </span>
                </div>
            )}

            {selectedImage && (
                <ImageCropper
                    image={selectedImage}
                    onCropComplete={handleCropComplete}
                    onCancel={() => setSelectedImage(null)}
                />
            )}

            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isPending}
            />
        </div>
    );
}
