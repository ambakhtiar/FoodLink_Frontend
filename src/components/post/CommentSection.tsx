"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Reply, Loader2, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { postService, IComment } from "@/services/postService";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface CommentSectionProps {
    postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
    const [comments, setComments] = useState<IComment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuthStore();

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const result = await postService.getComments(postId);
            setComments(result.data);
        } catch (error) {
            toast.error("Failed to load comments");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to comment");
            return;
        }
        if (!newComment.trim()) return;

        try {
            setIsSubmitting(true);
            await postService.addComment(postId, newComment, replyTo || undefined);
            setNewComment("");
            setReplyTo(null);
            fetchComments();
            toast.success(replyTo ? "Reply added" : "Comment added");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-xl">
                    <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-black">Comments</h3>
            </div>

            {/* Comment Input */}
            <form onSubmit={handleSubmit} className="relative group">
                <Avatar className="absolute left-3 top-3 w-8 h-8 border-2 border-primary/20">
                    <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                </Avatar>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={replyTo ? "Write a reply..." : "Share your thoughts..."}
                    className="w-full bg-muted/50 rounded-2xl p-4 pl-14 pr-16 min-h-[100px] border-2 border-transparent focus:border-primary outline-none transition-all font-medium text-sm resize-none"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    {replyTo && (
                        <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setReplyTo(null)}
                            className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                        >
                            Cancel
                        </Button>
                    )}
                    <Button 
                        disabled={isSubmitting || !newComment.trim()} 
                        size="icon" 
                        className="rounded-xl h-10 w-10 shadow-lg shadow-primary/20"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground font-medium">
                        No comments yet. Be the first to start the conversation!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="space-y-4">
                            <CommentItem 
                                comment={comment} 
                                onReply={() => {
                                    setReplyTo(comment.id);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }} 
                            />
                            
                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="ml-12 space-y-4 border-l-2 border-muted pl-6">
                                    {comment.replies.map((reply) => (
                                        <CommentItem key={reply.id} comment={reply} isReply />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function CommentItem({ comment, onReply, isReply = false }: { comment: IComment, onReply?: () => void, isReply?: boolean }) {
    const name = comment.user.userProfile?.name || comment.user.organizationProfile?.orgName || "User";
    
    return (
        <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex gap-4 ${isReply ? 'scale-95 origin-left' : ''}`}
        >
            <Avatar className="w-10 h-10 border-2 border-primary/10 shadow-sm">
                <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-foreground">{name}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {formatDistanceToNow(new Date(comment.createdAt))} ago
                    </span>
                </div>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    {comment.content}
                </p>
                {!isReply && (
                    <button 
                        onClick={onReply}
                        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors pt-1"
                    >
                        <Reply className="w-3 h-3" /> Reply
                    </button>
                )}
            </div>
        </motion.div>
    );
}
