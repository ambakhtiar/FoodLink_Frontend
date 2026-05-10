"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users, Leaf } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[60vh] md:min-h-[70vh] pt-4 pb-8 lg:pt-6 lg:pb-12 items-center overflow-hidden bg-background">
      {/* Premium Background Mesh */}
      <div className="bg-mesh absolute inset-0" />
      
      {/* Decorative Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] h-[40%] w-[40%] rounded-full bg-secondary/10 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-0 pb-8 sm:px-6 lg:px-8">
        <div className="grid items-center gap-6 lg:gap-10 lg:grid-cols-2">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 backdrop-blur-md"
            >
              <Leaf className="h-4 w-4 text-primary animate-bounce" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Join the Zero Hunger Movement
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              Connecting Food{" "}
              <span className="text-gradient">
                Donors
              </span>{" "}
              with Those in Need
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-4 max-w-lg text-sm md:text-base leading-relaxed text-muted-foreground"
            >
              Reduce food waste and fight hunger. Connect surplus food donors
              with NGOs and individuals who need it most. Together, we can make
              a difference that lasts.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-10 flex flex-wrap justify-center gap-5 lg:justify-start"
            >
              <Button
                asChild
                size="lg"
                className="group relative h-14 overflow-hidden rounded-full bg-primary px-8 text-lg font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_8px_24px_hsl(var(--primary)/0.35)]"
              >
                <Link href="/donate">
                  <span className="relative z-10 flex items-center">
                    Donate Now
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 rounded-full border-foreground/10 bg-background/50 px-8 text-lg font-bold backdrop-blur-md transition-all hover:bg-foreground/5 hover:border-foreground/20"
              >
                <Link href="/request">Request Help</Link>
              </Button>
            </motion.div>

            {/* Stats mini */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="mt-8 flex items-center gap-6 text-xs font-medium text-muted-foreground"
            >
              <div className="flex items-center gap-2.5 group cursor-default">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span>10,000+ Donors</span>
              </div>
              <div className="flex items-center gap-2.5 group cursor-default">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <Heart className="h-4 w-4 text-accent" />
                </div>
                <span>50,000+ Meals Saved</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Premium Glass Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Decorative rings */}
              <div className="absolute -inset-10 rounded-full border border-primary/5 animate-[spin_20s_linear_infinite]" />
              <div className="absolute -inset-20 rounded-full border border-secondary/5 animate-[spin_30s_linear_infinite_reverse]" />
              
              <div className="glass-panel-strong relative z-10 overflow-hidden rounded-[2rem] p-6">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
                <div className="absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-secondary/20 blur-2xl" />
                
                <div className="flex items-center justify-between mb-6">
                  <div className="rounded-2xl bg-primary px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20">
                    AI POWERED SYSTEM
                  </div>
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted overflow-hidden shadow-sm">
                        <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" width={40} height={40} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: Leaf, color: "text-primary", bg: "bg-primary/10", title: "Smart Food Detection", desc: "AI identifies food items & expiration dates", value: "99.8% Accuracy" },
                    { icon: Users, color: "text-secondary", bg: "bg-secondary/10", title: "Real-time Matching", desc: "Instantly connect with nearby local receivers", value: "2s Avg. Match" },
                    { icon: Heart, color: "text-accent", bg: "bg-accent/10", title: "Impact Dashboard", desc: "Track carbon footprint & meals provided", value: "Verified data" }
                  ].map((item, idx) => (
                    <motion.div 
                      key={idx}
                      className="group flex items-center gap-4 rounded-xl bg-muted/60 p-3 border border-border transition-all hover:bg-muted hover:border-primary/20"
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bg} transition-transform group-hover:scale-110`}>
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-foreground text-sm">{item.title}</p>
                          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest bg-muted/30 px-1.5 py-0.5 rounded">{item.value}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Live Activity Feed tag */}
                <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                     <span className="text-xs font-bold text-foreground/70 uppercase">Live Network Activity</span>
                   </div>
                   <div className="text-[10px] text-muted-foreground">Updated just now</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

