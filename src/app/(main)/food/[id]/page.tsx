"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { postService, IPost } from "@/services/postService";
import { PostImageCarousel } from "@/components/post/PostImageCarousel";
import { LikeButton } from "@/components/post/LikeButton";
import { CommentSection } from "@/components/post/CommentSection";
import { 
    MapPin, 
    Calendar, 
    Package, 
    User, 
    Clock, 
    ChevronRight,
    Loader2,
    ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PostDetailsPage() {
    const { id } = useParams() as { id: string };
    const [post, setPost] = useState<IPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const result = await postService.getPostById(id);
                setPost(result.data);
            } catch (error) {
                console.error("Failed to fetch post", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-black">Post Not Found</h1>
                <Button asChild>
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        );
    }

    const authorName = post.author.userProfile?.name || post.author.organizationProfile?.orgName || "Anonymous User";

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Left Column: Images and Interactions */}
                <div className="lg:col-span-2 space-y-8">
                    <PostImageCarousel images={post.imageUrls} />
                    
                    <div className="flex items-center justify-between p-6 bg-card rounded-3xl border border-border shadow-sm">
                        <div className="flex items-center gap-4">
                            <LikeButton 
                                postId={post.id} 
                                initialLikes={post.likesCount} 
                                initialIsLiked={post.isLikedByMe || false} 
                            />
                            <div className="h-8 w-[1px] bg-border" />
                            <div className="flex items-center gap-2 px-4 text-muted-foreground">
                                <MessageSquare className="w-5 h-5" />
                                <span className="font-black text-sm">{post.commentsCount}</span>
                            </div>
                        </div>
                        
                        <Button className="rounded-2xl h-12 px-8 font-black shadow-lg shadow-primary/20">
                            Request This Food
                        </Button>
                    </div>

                    <div className="p-8 bg-card rounded-3xl border border-border shadow-sm space-y-6">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-black tracking-tight">{post.title}</h1>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-widest">
                                    <Package className="w-3.5 h-3.5" />
                                    {post.category.replace("_", " ")}
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                                    post.type === 'DONATION' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                                }`}>
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    {post.type}
                                </div>
                            </div>
                        </div>
                        
                        <p className="text-lg font-medium text-muted-foreground leading-relaxed">
                            {post.description}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                            <DetailCard icon={MapPin} label="Location" value="Dhanmondi, Dhaka" />
                            <DetailCard icon={Clock} label="Quantity" value={post.quantity.toString()} />
                            <DetailCard 
                                icon={Calendar} 
                                label="Expires On" 
                                value={post.estimatedShelfLife ? format(new Date(post.estimatedShelfLife), "PPP") : "N/A"} 
                            />
                            <DetailCard icon={User} label="Posted By" value={authorName} />
                        </div>
                    </div>

                    <CommentSection postId={post.id} />
                </div>

                {/* Right Column: Author Info & Safety */}
                <div className="space-y-8">
                    <Card className="rounded-3xl border-none shadow-2xl bg-gradient-to-br from-primary to-primary/80 text-white overflow-hidden">
                        <CardContent className="p-8 space-y-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="p-4 bg-white/20 rounded-full backdrop-blur-md">
                                    <User className="w-12 h-12" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black">{authorName}</h3>
                                    <p className="text-white/70 font-medium">Verified Partner</p>
                                </div>
                            </div>
                            <div className="h-[1px] bg-white/20" />
                            <div className="space-y-4">
                                <Button variant="secondary" className="w-full h-12 rounded-2xl font-black text-primary">
                                    View Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-border shadow-sm">
                        <CardContent className="p-8 space-y-4">
                            <h4 className="font-black text-sm uppercase tracking-widest text-muted-foreground">Safety Tips</h4>
                            <ul className="space-y-3">
                                <SafetyTip text="Check the food for freshness before consuming." />
                                <SafetyTip text="Meet in a public, well-lit place for pickup." />
                                <SafetyTip text="HelpShare never asks for payment for donations." />
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function DetailCard({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
            <div className="p-2.5 bg-background rounded-xl shadow-sm">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{label}</p>
                <p className="text-sm font-black text-foreground">{value}</p>
            </div>
        </div>
    );
}

function SafetyTip({ text }: { text: string }) {
    return (
        <li className="flex gap-2 text-xs font-medium text-muted-foreground">
            <ChevronRight className="w-4 h-4 text-primary shrink-0" />
            {text}
        </li>
    );
}

import { MessageSquare } from "lucide-react";
