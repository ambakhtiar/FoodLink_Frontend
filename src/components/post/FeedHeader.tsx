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
            className="mb-8"
        >
            <Card className="rounded-[2rem] border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl overflow-hidden">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        <Link href="/profile">
                            <Avatar className="h-12 w-12 border-2 border-primary/20 hover:scale-105 transition-transform">
                                <AvatarImage src={user?.profilePictureUrl || ""} alt={user?.name || "User"} />
                                <AvatarFallback className="bg-primary/10 text-primary font-black">
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                        <Link 
                            href="/post/create" 
                            className="flex-1 h-12 bg-muted/50 rounded-full px-6 flex items-center text-muted-foreground font-bold hover:bg-muted transition-colors"
                        >
                            What's on your mind, {user?.name?.split(" ")[0]}?
                        </Link>
                    </div>
                    
                    <div className="h-[1px] bg-border/50 mx-2" />
                    
                    <div className="flex items-center justify-between px-2">
                        <ActionButton icon={Video} label="Live Video" color="text-red-500" />
                        <ActionButton icon={ImageIcon} label="Photo/Video" color="text-green-500" />
                        <ActionButton icon={Smile} label="Feeling/Activity" color="text-orange-500" />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function ActionButton({ icon: Icon, label, color }: { icon: any, label: string, color: string }) {
    return (
        <Link href="/post/create" className="flex items-center gap-2.5 px-4 py-2 rounded-xl hover:bg-muted transition-colors group">
            <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition-transform`} />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">{label}</span>
        </Link>
    );
}
