"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Heart, MessageSquare, Share2, MoreHorizontal,
    Image as ImageIcon, Send, Loader2, ArrowRight, ZoomIn
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { postService } from "@/services/postService";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export function FeedPostCard({ post: initialPost }: { post: any }) {
    const [likes, setLikes] = useState<number>(initialPost.likesCount ?? 0);
    const [isLiked, setIsLiked] = useState<boolean>(initialPost.isLikedByMe ?? false);
    const [isLiking, setIsLiking] = useState(false);
    const [commentCount, setCommentCount] = useState<number>(initialPost.commentsCount ?? 0);
    const [commentDialogOpen, setCommentDialogOpen] = useState(false);
    const { user } = useAuthStore();
    const images: string[] = initialPost.imageUrls ?? [];
    const { openAt, lightboxProps } = useLightbox(images);

    const authorName =
        initialPost.author.userProfile?.name ||
        initialPost.author.organizationProfile?.orgName ||
        "User";
    const impactScore =
        initialPost.author.userProfile?.impactScore ||
        initialPost.author.organizationProfile?.impactScore ||
        0;
    const timeAgo = formatDistanceToNow(new Date(initialPost.createdAt), { addSuffix: true });
    const isDonation = initialPost.type === "DONATION";

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) { toast.error("Please login to like posts"); return; }
        if (isLiking) return;

        const prevLikes = likes;
        const prevIsLiked = isLiked;
        setIsLiked(!isLiked);
        setLikes(isLiked ? likes - 1 : likes + 1);

        try {
            setIsLiking(true);
            const result = await postService.toggleLike(initialPost.id);
            setLikes(result.data.likesCount);
            setIsLiked(result.data.isLiked);
        } catch {
            setIsLiked(prevIsLiked);
            setLikes(prevLikes);
            toast.error("Failed to update like");
        } finally {
            setIsLiking(false);
        }
    };

    return (
        <>
            <motion.article
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
                {/* ── Header ─────────────────────────────────────── */}
                <div className="flex items-start justify-between px-4 pt-4 pb-3">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                            <AvatarImage src={initialPost.author.profilePictureUrl || ""} alt={authorName} />
                            <AvatarFallback className="bg-primary/10 text-primary font-black text-sm">
                                {authorName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-semibold text-sm">{authorName}</span>
                                {impactScore > 0 && (
                                    <span className="text-[10px] font-bold text-primary/70 bg-primary/8 px-1.5 py-0.5 rounded-full">
                                        ⭐ {impactScore}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs text-muted-foreground">{timeAgo}</span>
                                <span className="text-muted-foreground/30 text-xs">·</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                    isDonation
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                }`}>
                                    {isDonation ? "🍱 Donating" : "🙏 Requesting"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>

                {/* ── Content ────────────────────────────────────── */}
                <div className="px-4 pb-2 space-y-1.5">
                    {initialPost.title && (
                        <Link href={`/feed/${initialPost.id}`}>
                            <h2 className="font-bold text-sm leading-snug hover:text-primary transition-colors line-clamp-2">
                                {initialPost.title}
                            </h2>
                        </Link>
                    )}
                    {initialPost.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {initialPost.description}
                        </p>
                    )}
                    {initialPost.category && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary/70 bg-primary/6 px-2 py-0.5 rounded-full border border-primary/10">
                            {initialPost.category.replace(/_/g, " ")}
                        </span>
                    )}
                </div>

                {/* ── Image ──────────────────────────────────────── */}
                {images[0] && (
                    <button
                        type="button"
                        onClick={() => openAt(0)}
                        className="block relative aspect-video w-full overflow-hidden bg-muted mt-1 group cursor-zoom-in"
                    >
                        <Image
                            src={images[0]}
                            alt={initialPost.title || "Post image"}
                            fill
                            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 680px"
                        />
                        {images.length > 1 && (
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <ImageIcon className="w-2.5 h-2.5" />
                                +{images.length - 1}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <ZoomIn className="w-7 h-7 text-white opacity-0 group-hover:opacity-80 transition-opacity drop-shadow-lg" />
                        </div>
                    </button>
                )}

                {/* Lightbox */}
                {lightboxProps && <Lightbox {...lightboxProps} />}

                {/* ── Counts Row ─────────────────────────────────── */}
                {(likes > 0 || commentCount > 0) && (
                    <div className="flex items-center justify-between px-4 py-2 border-t border-border/40">
                        {likes > 0 ? (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <div className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-rose-500">
                                    <Heart className="w-2.5 h-2.5 text-white fill-current" />
                                </div>
                                <span className="font-medium">{likes}</span>
                            </div>
                        ) : <div />}
                        {commentCount > 0 && (
                            <Link
                                href={`/feed/${initialPost.id}#comments`}
                                className="text-xs text-muted-foreground hover:underline font-medium"
                            >
                                {commentCount} {commentCount === 1 ? "comment" : "comments"}
                            </Link>
                        )}
                    </div>
                )}

                {/* ── Action Bar ─────────────────────────────────── */}
                <div className={`grid border-t border-border/40 divide-x divide-border/40 ${isDonation ? "grid-cols-4" : "grid-cols-3"}`}>
                    {/* Like */}
                    <button
                        onClick={handleLike}
                        disabled={isLiking}
                        className={`flex items-center justify-center gap-2 py-2.5 hover:bg-muted/50 transition-colors text-sm font-semibold ${
                            isLiked ? "text-rose-500" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <motion.div animate={isLiked ? { scale: [1, 1.35, 1] } : {}} transition={{ duration: 0.25 }}>
                            <Heart className={`w-4 h-4 transition-all ${isLiked ? "fill-current" : ""}`} />
                        </motion.div>
                        <span className={`text-xs ${isLiked ? "font-bold" : ""}`}>Like</span>
                    </button>

                    {/* Comment — opens Dialog, card stays rigid */}
                    <button
                        onClick={() => {
                            if (!user) { toast.error("Please login to comment"); return; }
                            setCommentDialogOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 py-2.5 hover:bg-muted/50 transition-colors text-sm font-semibold text-muted-foreground hover:text-foreground"
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs">Comment</span>
                    </button>

                    {/* Share */}
                    <button className="flex items-center justify-center gap-2 py-2.5 hover:bg-muted/50 transition-colors text-sm font-semibold text-muted-foreground hover:text-foreground">
                        <Share2 className="w-4 h-4" />
                        <span className="text-xs">Share</span>
                    </button>

                    {/* Request CTA — only for donations */}
                    {isDonation && (
                        <Link
                            href={`/feed/${initialPost.id}`}
                            className="flex items-center justify-center gap-2 py-2.5 bg-primary/5 hover:bg-primary/10 transition-colors text-primary text-xs font-bold border-l border-border/40"
                        >
                            <span>Request</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    )}
                </div>
            </motion.article>

            {/* ── Comment Dialog (outside card — no layout shift) ── */}
            <CommentDialog
                postId={initialPost.id}
                postTitle={initialPost.title}
                open={commentDialogOpen}
                onOpenChange={setCommentDialogOpen}
                onCommentSuccess={() => setCommentCount((c) => c + 1)}
            />
        </>
    );
}

// ── Comment Dialog ────────────────────────────────────────────────────────────
interface CommentDialogProps {
    postId: string;
    postTitle?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCommentSuccess: () => void;
}

function CommentDialog({ postId, postTitle, open, onOpenChange, onCommentSuccess }: CommentDialogProps) {
    const [text, setText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuthStore();
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Focus textarea when dialog opens
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 80);
        } else {
            setText("");
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!text.trim()) return;
        setIsSubmitting(true);
        try {
            await postService.addComment(postId, text.trim());
            onCommentSuccess();
            toast.success("Comment posted!");
            onOpenChange(false);
        } catch {
            toast.error("Failed to post comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/40">
                    <DialogTitle className="text-base font-black">Add a comment</DialogTitle>
                    {postTitle && (
                        <DialogDescription className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            on &ldquo;{postTitle}&rdquo;
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="px-5 py-4 space-y-4">
                    {/* User avatar + textarea */}
                    <div className="flex gap-3">
                        <Avatar className="w-8 h-8 shrink-0 mt-0.5">
                            <AvatarImage src={user?.profilePictureUrl || ""} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                {user?.name?.charAt(0).toUpperCase() || "?"}
                            </AvatarFallback>
                        </Avatar>
                        <textarea
                            ref={inputRef}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                            placeholder="Write a comment… (Enter to send, Shift+Enter for new line)"
                            rows={3}
                            disabled={isSubmitting}
                            className="flex-1 bg-muted/50 rounded-xl px-3.5 py-2.5 text-sm outline-none border border-transparent focus:border-primary/40 transition-all resize-none disabled:opacity-50"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <Link
                            href={`/feed/${postId}#comments`}
                            className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
                            onClick={() => onOpenChange(false)}
                        >
                            View all comments →
                        </Link>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onOpenChange(false)}
                                className="text-xs text-muted-foreground hover:text-foreground font-semibold px-3 py-1.5 rounded-lg hover:bg-muted/60 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!text.trim() || isSubmitting}
                                className="flex items-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {isSubmitting
                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    : <Send className="w-3.5 h-3.5" />
                                }
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
