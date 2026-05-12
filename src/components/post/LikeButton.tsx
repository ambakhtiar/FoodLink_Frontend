"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { postService } from "@/services/postService";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

interface LikeButtonProps {
    postId: string;
    initialLikes: number;
    initialIsLiked: boolean;
}

export function LikeButton({ postId, initialLikes, initialIsLiked }: LikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthStore();

    const handleLike = async () => {
        if (!user) {
            toast.error("Please login to like posts");
            return;
        }

        try {
            setIsLoading(true);
            const result = await postService.toggleLike(postId);
            setLikes(result.data.likesCount);
            setIsLiked(result.data.isLiked);
        } catch (error) {
            toast.error("Failed to update like");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            disabled={isLoading}
            onClick={handleLike}
            className={`group rounded-2xl h-12 px-6 gap-2 transition-all duration-300 ${
                isLiked ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "hover:bg-primary/10"
            }`}
        >
            <motion.div
                whileTap={{ scale: 0.8 }}
                animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
            >
                <Heart
                    className={`w-5 h-5 transition-colors ${
                        isLiked ? "fill-current" : "group-hover:text-red-500"
                    }`}
                />
            </motion.div>
            <span className="font-black text-sm">{likes}</span>
        </Button>
    );
}
