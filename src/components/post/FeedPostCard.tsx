"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Share2, MoreHorizontal, Image as ImageIcon, Send, Loader2, ArrowRight, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { postService, IComment } from "@/services/postService";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";

export function FeedPostCard({ post: initialPost }: { post: any }) {
    const [likes, setLikes] = useState<number>(initialPost.likesCount ?? 0);
    const [isLiked, setIsLiked] = useState<boolean>(initialPost.isLikedByMe ?? false);
    const [isLiking, setIsLiking] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const { user } = useAuthStore();
    const images: string[] = initialPost.imageUrls ?? [];
    const { openAt, lightboxProps } = useLightbox(images);

    const authorName = initialPost.author.userProfile?.name || initialPost.author.organizationProfile?.orgName || "User";
    const impactScore = initialPost.author.userProfile?.impactScore || initialPost.author.organizationProfile?.impactScore || 0;
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
        <motion.article
            layout
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
            {(likes > 0 || (initialPost.commentsCount ?? 0) > 0) && (
                <div className="flex items-center justify-between px-4 py-2 border-t border-border/40">
                    {likes > 0 ? (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <div className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-rose-500 w-[18px] h-[18px]">
                                <Heart className="w-2.5 h-2.5 text-white fill-current" />
                            </div>
                            <span className="font-medium">{likes}</span>
                        </div>
                    ) : <div />}
                    {(initialPost.commentsCount ?? 0) > 0 && (
                        <button
                            onClick={() => setShowComments(true)}
                            className="text-xs text-muted-foreground hover:underline font-medium"
                        >
                            {initialPost.commentsCount} {initialPost.commentsCount === 1 ? "comment" : "comments"}
                        </button>
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

                {/* Comment — opens inline panel */}
                <button
                    onClick={() => setShowComments((v) => !v)}
                    className={`flex items-center justify-center gap-2 py-2.5 hover:bg-muted/50 transition-colors text-sm font-semibold ${
                        showComments ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs">Comment</span>
                </button>

                {/* Share */}
                <button className="flex items-center justify-center gap-2 py-2.5 hover:bg-muted/50 transition-colors text-sm font-semibold text-muted-foreground hover:text-foreground">
                    <Share2 className="w-4 h-4" />
                    <span className="text-xs">Share</span>
                </button>

                {/* Request / Donate CTA — only for donations */}
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

            {/* ── Inline Comment Panel ────────────────────────── */}
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-border/40"
                    >
                        <InlineCommentPanel postId={initialPost.id} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.article>
    );
}

// ── Inline Comment Panel ──────────────────────────────────────────────────────
function InlineCommentPanel({ postId }: { postId: string }) {
    const [comments, setComments] = useState<IComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [text, setText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
    const { user } = useAuthStore();

    // Fetch comments once when panel opens
    useEffect(() => {
        postService.getComments(postId)
            .then((r) => setComments(r.data || []))
            .catch(() => {})
            .finally(() => setIsLoading(false));
    }, [postId]);

    const handleSubmit = async () => {
        if (!user) { toast.error("Please login to comment"); return; }
        if (!text.trim()) return;
        setIsSubmitting(true);
        try {
            const result = await postService.addComment(postId, text, replyTo?.id);
            const newComment: IComment = result.data;
            if (replyTo) {
                // Append reply under its parent
                setComments((prev) =>
                    prev.map((c) =>
                        c.id === replyTo.id
                            ? { ...c, replies: [...(c.replies || []), newComment] }
                            : c
                    )
                );
            } else {
                setComments((prev) => [...prev, newComment]);
            }
            setText("");
            setReplyTo(null);
        } catch {
            toast.error("Failed to post comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="px-4 py-3 space-y-3 bg-muted/20">
            {/* Comment list */}
            {isLoading ? (
                <div className="flex items-center gap-2 py-2 text-muted-foreground text-xs">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Loading comments...</span>
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {comments.map((comment) => (
                        <InlineComment
                            key={comment.id}
                            comment={comment}
                            onReply={(id, name) => setReplyTo({ id, name })}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-xs text-muted-foreground py-1">No comments yet. Be first!</p>
            )}

            {/* Reply indicator */}
            {replyTo && (
                <div className="flex items-center gap-2 text-xs text-primary bg-primary/8 px-3 py-1.5 rounded-lg">
                    <span>Replying to <strong>{replyTo.name}</strong></span>
                    <button onClick={() => setReplyTo(null)} className="ml-auto font-bold hover:text-primary/70">✕</button>
                </div>
            )}

            {/* Comment input */}
            <div className="flex items-center gap-2">
                <Avatar className="w-7 h-7 shrink-0">
                    <AvatarImage src={user?.profilePictureUrl || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {user?.name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex items-center gap-2 bg-background rounded-full px-3 py-1.5 border border-border/60">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                        placeholder={replyTo ? `Reply to ${replyTo.name}...` : "Write a comment..."}
                        disabled={!user || isSubmitting}
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 disabled:cursor-not-allowed"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!text.trim() || isSubmitting || !user}
                        className="text-primary disabled:text-muted-foreground/30 hover:text-primary/70 transition-colors"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* See all link */}
            <Link
                href={`/feed/${postId}#comments`}
                className="text-xs text-primary font-semibold hover:underline inline-block"
            >
                See all comments →
            </Link>
        </div>
    );
}

// ── Inline Comment Item ───────────────────────────────────────────────────────
function InlineComment({ comment, onReply }: { comment: IComment; onReply: (id: string, name: string) => void }) {
    const name = comment.user.userProfile?.name || comment.user.organizationProfile?.orgName || "User";

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <Avatar className="w-7 h-7 shrink-0 mt-0.5">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                        {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="bg-background rounded-2xl px-3 py-2 shadow-sm">
                        <p className="text-xs font-bold">{name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 px-1">
                        <span className="text-[10px] text-muted-foreground/60">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                        <button
                            onClick={() => onReply(comment.id, name)}
                            className="text-[10px] font-bold text-primary/60 hover:text-primary transition-colors uppercase tracking-wide"
                        >
                            Reply
                        </button>
                    </div>
                </div>
            </div>

            {/* Replies (1 level only) */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-9 space-y-2">
                    {comment.replies.map((reply) => {
                        const rName = reply.user.userProfile?.name || reply.user.organizationProfile?.orgName || "User";
                        return (
                            <div key={reply.id} className="flex gap-2">
                                <Avatar className="w-6 h-6 shrink-0 mt-0.5">
                                    <AvatarFallback className="bg-secondary/10 text-secondary text-[9px] font-bold">
                                        {rName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="bg-background rounded-2xl px-3 py-1.5 shadow-sm flex-1 min-w-0">
                                    <p className="text-[11px] font-bold">{rName}</p>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">{reply.content}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
