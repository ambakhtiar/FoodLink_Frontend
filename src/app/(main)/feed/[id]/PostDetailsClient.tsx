"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { postService } from "@/services/postService";
import { IPost, ITransactionRequest } from "@/types/post";
import { IComment } from "@/services/postService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Heart, MessageSquare, Share2, MapPin, Calendar,
    Package, Clock, MoreHorizontal, Loader2, Send, Reply, ZoomIn,
    ShieldCheck, CheckCircle2, Star, ChevronDown, ChevronUp, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { Lightbox, useLightbox } from "@/components/ui/Lightbox";
import { transactionService } from "@/services/transactionService";
import { ReviewDialog } from "@/components/post/ReviewDialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function PostDetailsClient() {
    const { id } = useParams() as { id: string };
    const [post, setPost] = useState<IPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [comments, setComments] = useState<IComment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const { user } = useAuthStore();
    const commentInputRef = useRef<HTMLTextAreaElement>(null);
    const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);
    const [requestNote, setRequestNote] = useState("");
    const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
    const [isResponding, setIsResponding] = useState<string | null>(null);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

    // Fetch post
    useEffect(() => {
        postService.getPostById(id)
            .then((r) => {
                setPost(r.data);
                setLikes(r.data.likesCount ?? 0);
                setIsLiked(r.data.isLikedByMe ?? false);
            })
            .catch(() => toast.error("Failed to load post"))
            .finally(() => setIsLoading(false));
    }, [id]);

    // Fetch comments
    useEffect(() => {
        postService.getComments(id)
            .then((r) => setComments(r.data || []))
            .catch(() => { })
            .finally(() => setCommentsLoading(false));
    }, [id]);

    // Auto-focus on #comments hash
    useEffect(() => {
        if (typeof window !== "undefined" && window.location.hash === "#comments") {
            setTimeout(() => commentInputRef.current?.focus(), 600);
        }
    }, [isLoading]);

    const handleLike = async () => {
        if (!user) { toast.error("Please login to like posts"); return; }
        if (isLiking) return;
        const prev = { likes, isLiked };
        setIsLiked(!isLiked);
        setLikes(isLiked ? likes - 1 : likes + 1);
        try {
            setIsLiking(true);
            const r = await postService.toggleLike(id);
            setLikes(r.data.likesCount);
            setIsLiked(r.data.isLiked);
        } catch {
            setIsLiked(prev.isLiked);
            setLikes(prev.likes);
            toast.error("Failed to update like");
        } finally {
            setIsLiking(false);
        }
    };

    const handleSubmitComment = async () => {
        if (!user) { toast.error("Please login to comment"); return; }
        if (!commentText.trim()) return;
        setIsSubmitting(true);
        try {
            const result = await postService.addComment(id, commentText, replyTo?.id);
            const newComment: IComment = result.data;
            if (replyTo) {
                // Optimistically append reply under parent
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
            setCommentText("");
            setReplyTo(null);
        } catch {
            toast.error("Failed to post comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await postService.deleteComment(commentId);
            toast.success("Comment deleted");
            setComments(prev => {
                const isRoot = prev.some(c => c.id === commentId);
                if (isRoot) return prev.filter(c => c.id !== commentId);
                return prev.map(c => ({
                    ...c,
                    replies: c.replies?.filter(r => r.id !== commentId)
                }));
            });
        } catch (err) {
            toast.error("Failed to delete comment");
        }
    };

    const handleRequestItem = async () => {
        if (!user) {
            toast.error("Please login to request items");
            return;
        }
        try {
            setIsRequesting(true);
            await transactionService.requestItem({
                postId: id,
                quantity: post?.quantity.toString() || "1",
                deliveryNote: requestNote
            });
            toast.success("Request sent successfully!");
            setIsRequestDialogOpen(false);
            const r = await postService.getPostById(id);
            setPost(r.data);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to request item");
        } finally {
            setIsRequesting(false);
        }
    };

    const handleRespondRequest = async (transactionId: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            setIsResponding(transactionId);
            await transactionService.respondToRequest({ transactionId, status });
            toast.success(`Request ${status.toLowerCase()} successfully`);
            const r = await postService.getPostById(id);
            setPost(r.data);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || `Failed to ${status.toLowerCase()} request`);
        } finally {
            setIsResponding(null);
        }
    };

    const handleCompleteTransaction = async (transactionId: string) => {
        try {
            setIsCompleting(true);
            await transactionService.completeTransaction(transactionId);
            toast.success("Transaction marked as completed!");
            const r = await postService.getPostById(id);
            setPost(r.data);
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to complete transaction";
            toast.error(message);
        } finally {
            setIsCompleting(false);
        }
    };

    // Lightbox for post images
    const imageUrls: string[] = post?.imageUrls ?? [];
    const { openAt, lightboxProps } = useLightbox(imageUrls);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-black">Post not found</h1>
                    <p className="text-muted-foreground text-sm">This post may have been removed.</p>
                </div>
                <Button asChild><Link href="/feed">Back to Feed</Link></Button>
            </div>
        );
    }

    const authorName = post.author.userProfile?.name || post.author.organizationProfile?.orgName || "Anonymous";
    const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
    const isDonation = post.type === "DONATION";

    return (
        <div className="min-h-screen bg-muted/20">
            <div className="max-w-6xl mx-auto px-4 py-6 lg:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

                    {/* ── LEFT COLUMN ──────────────────────────────── */}
                    <div className="space-y-4">

                        {/* Post Card */}
                        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm">
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 pt-5 pb-3">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-11 w-11 ring-2 ring-primary/10">
                                        <AvatarImage src={post.author.profilePictureUrl || ""} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-black">
                                            {authorName.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm">{authorName}</span>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isDonation
                                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                }`}>
                                                {isDonation ? "🍱 Donating" : "🙏 Requesting"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
                                    </div>
                                </div>
                                <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Content */}
                            {(post.title || post.description) && (
                                <div className="px-5 pb-3 space-y-1.5">
                                    {post.title && <h1 className="text-xl font-black tracking-tight">{post.title}</h1>}
                                    {post.description && (
                                        <p className="text-sm text-muted-foreground leading-relaxed">{post.description}</p>
                                    )}
                                </div>
                            )}

                            {/* Images — click to open lightbox */}
                            {imageUrls.length > 0 && (
                                <div className={`grid gap-0.5 mt-1 ${imageUrls.length === 1 ? "" : "grid-cols-2"}`}>
                                    {imageUrls.slice(0, 4).map((url, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => openAt(i)}
                                            className={`relative bg-muted overflow-hidden group cursor-zoom-in ${imageUrls.length === 1 ? "aspect-video w-full" : "aspect-square"
                                                }`}
                                        >
                                            <Image
                                                src={url}
                                                alt={`Image ${i + 1}`}
                                                fill
                                                className="object-cover group-hover:brightness-95 transition-all"
                                                sizes="(max-width: 768px) 100vw, 600px"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                                                <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-80 transition-opacity drop-shadow" />
                                            </div>
                                            {i === 3 && imageUrls.length > 4 && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <span className="text-white text-xl font-black">+{imageUrls.length - 4}</span>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Lightbox */}
                            {lightboxProps && <Lightbox {...lightboxProps} />}

                            {/* Stats */}
                            {(likes > 0 || (post.commentsCount ?? 0) > 0) && (
                                <div className="flex items-center justify-between px-5 py-2.5 border-t border-border/40">
                                    {likes > 0 ? (
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <div className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-rose-500">
                                                <Heart className="w-2.5 h-2.5 text-white fill-current" />
                                            </div>
                                            <span className="font-medium">{likes}</span>
                                        </div>
                                    ) : <div />}
                                    {(post.commentsCount ?? 0) > 0 && (
                                        <span className="text-xs text-muted-foreground font-medium">
                                            {post.commentsCount} {post.commentsCount === 1 ? "comment" : "comments"}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Action Bar */}
                            <div className="grid grid-cols-3 border-t border-border/40 divide-x divide-border/40">
                                <button
                                    onClick={handleLike}
                                    disabled={isLiking}
                                    className={`flex items-center justify-center gap-2 py-3 hover:bg-muted/50 transition-colors text-sm font-semibold ${isLiked ? "text-rose-500" : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    <motion.div animate={isLiked ? { scale: [1, 1.35, 1] } : {}} transition={{ duration: 0.25 }}>
                                        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                                    </motion.div>
                                    <span className={isLiked ? "font-bold text-xs" : "text-xs"}>Like</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setReplyTo(null);
                                        setTimeout(() => commentInputRef.current?.focus(), 100);
                                    }}
                                    className="flex items-center justify-center gap-2 py-3 hover:bg-muted/50 transition-colors text-xs font-semibold text-muted-foreground hover:text-foreground"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    <span>Comment</span>
                                </button>
                                <button className="flex items-center justify-center gap-2 py-3 hover:bg-muted/50 transition-colors text-xs font-semibold text-muted-foreground hover:text-foreground">
                                    <Share2 className="w-4 h-4" />
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>

                        {/* Details Card */}
                        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
                            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Post Details</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <DetailItem icon={Package} label="Category" value={post.category.replace(/_/g, " ")} />
                                <DetailItem icon={Clock} label="Quantity" value={`${post.quantity} items`} />
                                <DetailItem
                                    icon={Calendar}
                                    label="Expires"
                                    value={post.estimatedShelfLife ? format(new Date(post.estimatedShelfLife), "PP") : "N/A"}
                                />
                                <DetailItem icon={MapPin} label="Location" value="View on map" />
                            </div>
                            {(() => {
                                const approvedReq = post.transactionRequests?.find(
                                    (r: ITransactionRequest) => r.status === "APPROVED" || r.status === "COMPLETED"
                                );
                                const isAuthor = user?.id === post.authorId;
                                const isApprovedActor = approvedReq?.actorId === user?.id;
                                const isInvolved = isAuthor || isApprovedActor;
                                const authorName = post.author.userProfile?.name || post.author.organizationProfile?.orgName || "the author";
                                const actorName = approvedReq?.actor?.userProfile?.name || approvedReq?.actor?.organizationProfile?.orgName || "the requester";
                                const revieweeName = isAuthor ? actorName : authorName;
                                const revieweeId = isAuthor ? (approvedReq?.actorId ?? "") : post.authorId;
                                const alreadyReviewed = approvedReq?.reviews?.some(
                                    (rv) => rv.reviewerId === user?.id
                                ) ?? false;

                                return (
                                    <>
                                        {/* ── Owner View: Requests list ── */}
                                        {isAuthor && (
                                            <div className="mt-6 pt-6 border-t border-border/40">
                                                <h3 className="text-sm font-black mb-4">Requests ({post.transactionRequests?.length || 0})</h3>
                                                {post.transactionRequests && post.transactionRequests.length > 0 ? (
                                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                                        {post.transactionRequests.map((req: ITransactionRequest) => {
                                                            const reqUser = req.actor?.userProfile || req.actor?.organizationProfile;
                                                            const reqName = (reqUser as { name?: string; orgName?: string })?.name || (reqUser as { orgName?: string })?.orgName || "User";
                                                            const isPending = req.status === "PENDING";

                                                            return (
                                                                <div key={req.id} className="p-3 rounded-xl bg-muted/40 border border-border/40 text-sm">
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <div className="font-bold flex items-center gap-2">
                                                                            {reqName}
                                                                            <span className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-background">{req.status}</span>
                                                                        </div>
                                                                    </div>
                                                                    {req.message && (
                                                                        <p className="text-xs text-muted-foreground mb-3 italic">&ldquo;{req.message}&rdquo;</p>
                                                                    )}
                                                                    {isPending && (
                                                                        <div className="flex gap-2">
                                                                            <Button
                                                                                size="sm"
                                                                                onClick={() => handleRespondRequest(req.id, "APPROVED")}
                                                                                disabled={isResponding === req.id || post.status !== "AVAILABLE"}
                                                                                className="h-8 flex-1 text-xs"
                                                                            >
                                                                                Accept
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => handleRespondRequest(req.id, "REJECTED")}
                                                                                disabled={isResponding === req.id}
                                                                                className="h-8 flex-1 text-xs"
                                                                            >
                                                                                Reject
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground italic">No requests yet.</p>
                                                )}
                                            </div>
                                        )}

                                        {/* ── Receiver View: Request button ── */}
                                        {!isAuthor && post.status === "AVAILABLE" && (
                                            <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button className="w-full mt-5 h-11 rounded-xl font-bold text-sm gap-2 shadow-md shadow-primary/20">
                                                        <ShieldCheck className="w-4 h-4" />
                                                        Request This Item
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Request Item</DialogTitle>
                                                        <DialogDescription>
                                                            Please provide a delivery note or address for the author.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <textarea
                                                        value={requestNote}
                                                        onChange={(e) => setRequestNote(e.target.value)}
                                                        placeholder="E.g., I can pick this up tomorrow at 10 AM..."
                                                        rows={4}
                                                        className="w-full bg-muted/50 rounded-xl p-3 text-sm outline-none border border-transparent focus:border-primary/40 transition-all resize-none"
                                                    />
                                                    <DialogFooter>
                                                        <Button variant="ghost" onClick={() => setIsRequestDialogOpen(false)}>Cancel</Button>
                                                        <Button onClick={handleRequestItem} disabled={isRequesting}>
                                                            {isRequesting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                                            Send Request
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        )}

                                        {/* ── Mark as Completed (PENDING_HANDOVER) ── */}
                                        {post.status === "PENDING_HANDOVER" && isInvolved && approvedReq && (
                                            <Button
                                                className="w-full mt-5 h-11 rounded-xl font-bold text-sm gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                                                onClick={() => handleCompleteTransaction(approvedReq.id)}
                                                disabled={isCompleting}
                                            >
                                                {isCompleting
                                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                                    : <CheckCircle2 className="w-4 h-4" />}
                                                Mark as Handed Over
                                            </Button>
                                        )}

                                        {/* ── Leave a Review (COMPLETED) ── */}
                                        {post.status === "COMPLETED" && isInvolved && !alreadyReviewed && approvedReq && (
                                            <>
                                                <Button
                                                    className="w-full mt-5 h-11 rounded-xl font-bold text-sm gap-2 bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-500/20"
                                                    onClick={() => setIsReviewDialogOpen(true)}
                                                >
                                                    <Star className="w-4 h-4" />
                                                    Leave a Review for {revieweeName}
                                                </Button>
                                                <ReviewDialog
                                                    transactionId={approvedReq.id}
                                                    revieweeId={revieweeId}
                                                    revieweeName={revieweeName}
                                                    open={isReviewDialogOpen}
                                                    onOpenChange={setIsReviewDialogOpen}
                                                    onSuccess={async () => {
                                                        const r = await postService.getPostById(id);
                                                        setPost(r.data);
                                                    }}
                                                />
                                            </>
                                        )}

                                        {post.status === "COMPLETED" && isInvolved && alreadyReviewed && (
                                            <p className="mt-5 text-xs text-center text-emerald-600 font-semibold flex items-center justify-center gap-1.5">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> You have already reviewed this transaction.
                                            </p>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN (Comments) ──────────────────── */}
                    <div
                        id="comments"
                        className="bg-card border border-border/60 rounded-2xl shadow-sm lg:sticky lg:top-[76px] overflow-hidden flex flex-col"
                        style={{ maxHeight: "calc(100vh - 90px)" }}
                    >
                        {/* Header */}
                        <div className="px-4 py-3.5 border-b border-border/40 flex items-center gap-2 shrink-0">
                            <MessageSquare className="w-4 h-4 text-primary" />
                            <h3 className="font-black text-sm">Comments</h3>
                            <span className="ml-auto text-xs text-muted-foreground font-medium">
                                {comments.length}
                            </span>
                        </div>

                        {/* Scrollable comment list */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                            {commentsLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                                    <MessageSquare className="w-7 h-7 text-muted-foreground/25" />
                                    <p className="text-sm text-muted-foreground">No comments yet.</p>
                                    <p className="text-xs text-muted-foreground/50">Be the first to share your thoughts!</p>
                                </div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {comments.map((comment) => (
                                        <CommentThread
                                            key={comment.id}
                                            comment={comment}
                                            onReply={(cId, name) => {
                                                setReplyTo({ id: cId, name });
                                                commentInputRef.current?.focus();
                                            }}
                                            onDelete={handleDeleteComment}
                                        />
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Sticky comment input */}
                        <div className="border-t border-border/40 p-4 space-y-2.5 shrink-0">
                            {/* Reply indicator */}
                            <AnimatePresence>
                                {replyTo && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center gap-2 text-xs text-primary bg-primary/8 px-3 py-1.5 rounded-lg"
                                    >
                                        <Reply className="w-3 h-3" />
                                        <span>Replying to <strong>{replyTo.name}</strong></span>
                                        <button
                                            onClick={() => setReplyTo(null)}
                                            className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-end gap-2.5">
                                <Avatar className="w-8 h-8 shrink-0">
                                    <AvatarImage src={user?.profilePictureUrl || ""} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                        {user?.name?.charAt(0).toUpperCase() || "?"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 relative">
                                    <textarea
                                        ref={commentInputRef}
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSubmitComment();
                                            }
                                        }}
                                        placeholder={
                                            !user
                                                ? "Login to comment..."
                                                : replyTo
                                                    ? `Reply to ${replyTo.name}...`
                                                    : "Write a comment... (Enter to send)"
                                        }
                                        disabled={!user || isSubmitting}
                                        rows={1}
                                        className="w-full bg-muted/50 rounded-2xl pl-3.5 pr-10 py-2.5 text-sm outline-none border border-transparent focus:border-primary/40 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ lineHeight: "1.5" }}
                                    />
                                    <button
                                        onClick={handleSubmitComment}
                                        disabled={!commentText.trim() || isSubmitting || !user}
                                        className="absolute right-2 bottom-2 p-1.5 bg-primary text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90 transition-all"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                            <Send className="w-3 h-3" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── CommentThread (1-level deep) ────────────────────────────────────────────── */
function CommentThread({
    comment,
    onReply,
    onDelete
}: {
    comment: IComment;
    onReply: (id: string, name: string) => void;
    onDelete: (id: string) => void;
}) {
    const { user } = useAuthStore();
    const name = comment.user.userProfile?.name || comment.user.organizationProfile?.orgName || "User";
    const [showReplies, setShowReplies] = useState(true);
    const isOwner = user?.id === comment.userId;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="group/thread space-y-2"
        >
            {/* Parent comment */}
            <div className="flex gap-2.5">
                <Avatar className="w-8 h-8 shrink-0 mt-0.5">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="bg-muted/50 rounded-2xl px-3.5 py-2.5 relative group">
                        <p className="text-xs font-bold">{name}</p>
                        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{comment.content}</p>
                        {isOwner && (
                            <button
                                onClick={() => onDelete(comment.id)}
                                className="absolute top-2 right-2 p-1.5 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                title="Delete comment"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-3 px-1 mt-1">
                        <span className="text-[10px] text-muted-foreground/60">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                        <button
                            onClick={() => onReply(comment.id, name)}
                            className="text-[10px] font-bold text-primary/60 hover:text-primary transition-colors uppercase tracking-wide flex items-center gap-1"
                        >
                            <Reply className="w-2.5 h-2.5" /> Reply
                        </button>
                        {comment.replies && comment.replies.length > 0 && (
                            <button
                                onClick={() => setShowReplies((v) => !v)}
                                className="text-[10px] font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors flex items-center gap-1 ml-auto"
                            >
                                {showReplies ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                                {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Replies (1 level, collapsible) */}
            <AnimatePresence>
                {showReplies && comment.replies && comment.replies.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-10 space-y-2 border-l-2 border-muted pl-3 overflow-hidden"
                    >
                        {comment.replies.map((reply) => {
                            const rName = reply.user.userProfile?.name || reply.user.organizationProfile?.orgName || "User";
                            const isReplyOwner = user?.id === reply.userId;

                            return (
                                <motion.div
                                    key={reply.id}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex gap-2 group"
                                >
                                    <Avatar className="w-7 h-7 shrink-0 mt-0.5">
                                        <AvatarFallback className="bg-secondary/10 text-secondary text-[9px] font-bold">
                                            {rName.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="bg-muted/40 rounded-2xl px-3 py-2 relative">
                                            <p className="text-[11px] font-bold">{rName}</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{reply.content}</p>
                                            {isReplyOwner && (
                                                <button
                                                    onClick={() => onDelete(reply.id)}
                                                    className="absolute top-1.5 right-1.5 p-1 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                                    title="Delete reply"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground/50 px-1 mt-0.5">
                                            {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ── DetailItem ──────────────────────────────────────────────────────────────── */
function DetailItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
            <div className="p-2 bg-background rounded-lg shadow-sm shrink-0">
                <Icon className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 truncate">{label}</p>
                <p className="text-sm font-bold truncate">{value}</p>
            </div>
        </div>
    );
}
