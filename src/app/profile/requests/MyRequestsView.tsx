"use client";

import { useMyRequestsQuery } from "@/hooks/useTransactionQueries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, Clock, CheckCircle2, XCircle, ChevronRight, MapPin, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

export default function MyRequestsView() {
    const { data, isLoading, error } = useMyRequestsQuery();

    const requests = data?.data || [];
    const isEmpty = !isLoading && requests.length === 0;

    return (
        <div className="space-y-4">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">My Requests</h1>
                    <p className="text-muted-foreground font-bold mt-2 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-primary" />
                        Track your item requests and their status
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="glass-panel px-6 py-3 rounded-2xl border-white/10 flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total</span>
                        <span className="text-xl font-black text-primary">{requests.length}</span>
                    </div>
                    <div className="glass-panel px-6 py-3 rounded-2xl border-white/10 flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pending</span>
                        <span className="text-xl font-black text-amber-500">
                            {requests.filter(r => r.status === 'PENDING').length}
                        </span>
                    </div>
                </div>
            </header>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => <RequestSkeleton key={i} />)}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 glass-panel rounded-[2rem] border-white/10">
                        <p className="font-bold text-destructive">Failed to load requests. Please refresh.</p>
                    </div>
                ) : isEmpty ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-24 glass-panel rounded-[3rem] border-white/10 border-dashed"
                    >
                        <div className="p-8 bg-primary/10 rounded-full mb-6">
                            <ShoppingBag className="w-12 h-12 text-primary" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black">No requests found</h3>
                            <p className="text-muted-foreground font-bold max-w-sm">
                                You haven't requested any items yet. Browse the feed to find what you need!
                            </p>
                            <Link href="/feed" className="inline-block mt-6 px-8 py-3 bg-primary text-white font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                                Browse Feed
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid gap-4">
                        <AnimatePresence mode="popLayout">
                            {requests.map((request) => (
                                <RequestCard key={request.id} request={request} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}

function RequestCard({ request }: { request: any }) {
    const post = request.post;

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'APPROVED': return 'success';
            case 'REJECTED': return 'destructive';
            case 'COMPLETED': return 'info';
            default: return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <Clock className="w-3.5 h-3.5 mr-1.5" />;
            case 'APPROVED': return <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />;
            case 'REJECTED': return <XCircle className="w-3.5 h-3.5 mr-1.5" />;
            case 'COMPLETED': return <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />;
            default: return null;
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group"
        >
            <Card className="overflow-hidden border-white/10 glass-panel hover:border-primary/30 transition-all duration-300 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-primary/5">
                <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                        {/* Post Image */}
                        <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden">
                            <Image
                                src={post?.imageUrls?.[0] || 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1000'}
                                alt={post?.title || 'Request'}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden" />
                            <div className="absolute bottom-3 left-3 sm:hidden">
                                <Badge variant={getStatusVariant(request.status)} className="font-black uppercase tracking-widest text-[10px]">
                                    {getStatusIcon(request.status)}
                                    {request.status}
                                </Badge>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Request Details</span>
                                            <span className="h-px w-8 bg-primary/20" />
                                        </div>
                                        <Link href={`/feed/${post?.id}`}>
                                            <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors line-clamp-1 hover:underline decoration-primary decoration-2 underline-offset-4 cursor-pointer">
                                                {post?.title}
                                            </h3>
                                        </Link>
                                    </div>
                                    <div className="hidden sm:block">
                                        <Badge variant={getStatusVariant(request.status)} className="px-4 py-1.5 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-sm">
                                            {getStatusIcon(request.status)}
                                            {request.status}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground bg-foreground/5 p-3 rounded-xl border border-white/5">
                                        <Package className="w-4 h-4 text-primary" />
                                        <span>Quantity: <span className="text-foreground">{request.quantity}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground bg-foreground/5 p-3 rounded-xl border border-white/5">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <span>Date: <span className="text-foreground">{format(new Date(request.createdAt), 'MMM dd, yyyy')}</span></span>
                                    </div>
                                </div>

                                {request.message && (
                                    <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                                        <p className="text-xs font-bold text-primary/80 uppercase tracking-widest mb-1">Your Note</p>
                                        <p className="text-sm text-foreground/80 italic line-clamp-2">"{request.message}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                    <MapPin className="w-3.5 h-3.5" />
                                    Post Status:
                                    <span className={`uppercase tracking-widest font-black text-[10px] ml-1 ${post?.status === 'AVAILABLE' ? 'text-emerald-500' : 'text-primary'
                                        }`}>
                                        {post?.status}
                                    </span>
                                </div>
                                <Link
                                    href={`/feed/${post?.id}`}
                                    className="flex items-center gap-2 text-sm font-black text-primary hover:gap-3 transition-all uppercase tracking-widest"
                                >
                                    View Post
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function RequestSkeleton() {
    return (
        <div className="glass-panel border-white/10 rounded-[2rem] overflow-hidden flex flex-col sm:flex-row h-auto sm:h-64">
            <Skeleton className="w-full sm:w-48 h-48 sm:h-full shrink-0" />
            <div className="flex-1 p-8 space-y-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-48" />
                    </div>
                    <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-12 rounded-xl" />
                    <Skeleton className="h-12 rounded-xl" />
                </div>
                <div className="pt-6 border-t border-white/5">
                    <Skeleton className="h-6 w-3/4" />
                </div>
            </div>
        </div>
    );
}
