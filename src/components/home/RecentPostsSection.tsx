"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ArrowRight } from "lucide-react";

const recentPosts = [
    {
        id: 1,
        title: "Fresh Vegetables & Rice",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
        location: "Dhanmondi, Dhaka",
        expiry: "Expires in 6 hours",
        quantity: "20 kg",
        donor: "Green Restaurant",
        type: "Vegetables",
    },
    {
        id: 2,
        title: "Cooked Meals - Biryani",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
        location: "Gulshan, Dhaka",
        expiry: "Expires in 4 hours",
        quantity: "50 meals",
        donor: "Royal Caterers",
        type: "Cooked Food",
    },
    {
        id: 3,
        title: "Bread & Bakery Items",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
        location: "Mirpur, Dhaka",
        expiry: "Expires in 12 hours",
        quantity: "30 packs",
        donor: "Daily Bakery",
        type: "Bakery",
    },
    {
        id: 4,
        title: "Fruits - Apples & Oranges",
        image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop",
        location: "Uttara, Dhaka",
        expiry: "Expires in 3 days",
        quantity: "15 kg",
        donor: "Fresh Mart",
        type: "Fruits",
    },
];

export function RecentPostsSection() {
    return (
        <section className="relative flex flex-col justify-center min-h-[60vh] md:min-h-[70vh] overflow-hidden bg-muted/30 py-8 md:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
                >
                    <div className="max-w-2xl">
                        <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 border border-primary/20">
                            <span className="text-xs font-black uppercase tracking-widest text-primary">Live Updates</span>
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                            Available <span className="text-gradient">Now</span>
                        </h2>
                        <p className="mt-2 text-base font-medium text-muted-foreground">
                            Real-time surplus food inventory rescued from local partners.
                        </p>
                    </div>
                    <Button asChild variant="outline" className="group rounded-2xl h-12 px-6 border-white/10 hover:bg-white/5 font-bold transition-all">
                        <Link href="/explore" className="flex items-center">
                            Explore Archive
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {recentPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                            whileHover={{ y: -10 }}
                            className="bg-card group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 rounded-2xl border border-border"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                <div className="absolute left-4 top-4 rounded-xl bg-primary/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                                    {post.type}
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-1">
                                        <Clock className="h-3.5 w-3.5 text-primary" />
                                        {post.expiry}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                    {post.title}
                                </h3>
                                <div className="mt-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <MapPin className="h-4 w-4 text-primary/60" />
                                    {post.location}
                                </div>
                                
                                <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Volume</span>
                                        <span className="text-base font-black text-primary">
                                            {post.quantity}
                                        </span>
                                    </div>
                                    <Button asChild size="sm" variant="ghost" className="h-10 rounded-xl px-4 font-bold text-xs hover:bg-primary/10 hover:text-primary">
                                        <Link href={`/feed/${post.id}`}>Inspect</Link>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

