"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Home, ArrowLeft, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-8 max-w-lg"
            >
                {/* 404 Illustration */}
                <div className="relative inline-block">
                    <motion.div
                        animate={{ 
                            y: [0, -20, 0],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                            duration: 4, 
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Ghost className="w-32 h-32 text-primary/40 mx-auto" />
                    </motion.div>
                    <h1 className="text-9xl font-black text-foreground opacity-10 absolute inset-0 -z-10 select-none">404</h1>
                </div>

                <div className="space-y-4">
                    <h2 className="text-4xl font-black tracking-tight text-foreground">Lost in the Community?</h2>
                    <p className="text-lg font-medium text-muted-foreground leading-relaxed">
                        The page you are looking for doesn't exist. It might have been moved, deleted, or donated to someone else!
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg" className="rounded-2xl h-14 px-8 font-black shadow-xl shadow-primary/20 gap-2">
                        <Link href="/">
                            <Home className="w-5 h-5" />
                            Back to Home
                        </Link>
                    </Button>
                    <Button variant="outline" onClick={() => window.history.back()} size="lg" className="rounded-2xl h-14 px-8 font-black border-2 gap-2">
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </Button>
                </div>

                {/* Helpful Links */}
                <div className="pt-8 grid grid-cols-2 gap-4">
                    <Link href="/feed" className="p-4 bg-muted/50 rounded-2xl hover:bg-primary/10 transition-colors group">
                        <Search className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest block">Explore Feed</span>
                    </Link>
                    <Link href="/about" className="p-4 bg-muted/50 rounded-2xl hover:bg-primary/10 transition-colors group">
                        <Ghost className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest block">Learn More</span>
                    </Link>
                </div>
            </motion.div>

            {/* Footer Brand */}
            <div className="absolute bottom-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                HelpShare • Zero Hunger Initiative
            </div>
        </div>
    );
}
