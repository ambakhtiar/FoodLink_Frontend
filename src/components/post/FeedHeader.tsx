"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { User, Image as ImageIcon, Video, Smile } from "lucide-react";
import { motion } from "framer-motion";

export function FeedHeader() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
        >
            <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <Link href="/profile">
                            <div className="relative group">
                                <Avatar className="h-12 w-12 border-2 border-primary/20 group-hover:border-primary/40 transition-all shadow-lg shadow-primary/5">
                                    <AvatarImage src={user?.profilePictureUrl || ""} alt={user?.name || "User"} className="object-cover" />
                                    <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-primary font-black">
                                        {user?.name?.charAt(0).toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full shadow-sm" />
                            </div>
                        </Link>
                        <Link 
                            href="/post/create" 
                            className="flex-1 h-12 bg-white/5 rounded-full px-6 flex items-center text-muted-foreground/60 font-bold hover:bg-white/[0.08] hover:text-foreground transition-all border border-white/5 shadow-inner"
                        >
                            What's on your mind, {user?.name?.split(" ")[0]}?
                        </Link>
                    </div>
                    
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent mx-4" />
                    
                    <div className="flex items-center justify-around px-2">
                        <ActionButton icon={Video} label="Live Video" color="text-rose-500" />
                        <ActionButton icon={ImageIcon} label="Photo/Video" color="text-emerald-500" />
                        <ActionButton icon={Smile} label="Activity" color="text-amber-500" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function ActionButton({ icon: Icon, label, color }: { icon: any, label: string, color: string }) {
    return (
        <Link href="/post/create" className="flex items-center gap-2.5 px-6 py-2.5 rounded-2xl hover:bg-white/5 transition-all group">
            <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition-transform`} />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
        </Link>
    );
}
