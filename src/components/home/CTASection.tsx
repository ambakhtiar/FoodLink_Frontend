"use client";

import { motion } from "framer-motion";
import { FULL_APP_NAME } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, Heart } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative flex flex-col justify-center min-h-[50vh] md:min-h-[60vh] overflow-hidden py-8 lg:py-12 bg-muted/30">
      {/* Mesh on dark bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/15 opacity-80" />
      
      {/* Decorative Glows */}
      <div className="absolute -top-1/2 left-0 h-full w-full bg-primary/8 blur-[160px] rounded-full" />
      <div className="absolute -bottom-1/2 right-0 h-full w-full bg-secondary/8 blur-[160px] rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-20 lg:grid-cols-2 lg:items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2"
            >
              <Heart className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Join the Movement
              </span>
            </motion.div>

            <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Ready to Make a <span className="text-gradient">Difference?</span>
            </h2>

            <p className="mb-8 text-lg text-muted-foreground leading-relaxed max-w-xl">
              Whether you are a food business with surplus meals or an NGO
              feeding the hungry, {FULL_APP_NAME} connects you to create impact that lasts.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-xl bg-primary px-8 text-base font-bold text-primary-foreground hover:bg-primary/90 hover:shadow-[0_8px_24px_hsl(var(--primary)/0.35)] transition-all"
              >
                <Link href="/auth/register">
                  Register
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-xl border-white/20 bg-white/5 px-8 text-base font-bold text-white hover:bg-white/10 transition-all"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Content - Newsletter Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
          >
            <div className="absolute top-0 right-0 h-40 w-40 bg-primary/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 bg-secondary/15 blur-3xl" />
            
            <h3 className="relative z-10 mb-3 text-2xl font-bold text-white">
              Stay in the Loop
            </h3>
            <p className="relative z-10 mb-8 text-blue-100/70 leading-relaxed">
              Subscribe for impact stories, new features, and food rescue tips — no spam, ever.
            </p>

            <form
              className="relative z-10 space-y-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="h-14 border-white/15 bg-white/5 pl-12 text-white placeholder:text-white/40 rounded-xl focus-visible:ring-primary"
                />
              </div>
              <Button
                type="submit"
                className="h-14 w-full rounded-xl bg-primary text-primary-foreground text-base font-bold uppercase tracking-wider hover:bg-primary/90 hover:shadow-[0_8px_24px_hsl(var(--primary)/0.4)] transition-all"
              >
                Subscribe Now
              </Button>
            </form>

            <p className="relative z-10 mt-5 text-center text-xs text-white/40">
              No spam, ever. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
