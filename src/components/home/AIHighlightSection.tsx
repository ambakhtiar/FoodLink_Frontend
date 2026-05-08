"use client";

import { motion } from "framer-motion";
import { Camera, Brain, Radar, Sparkles } from "lucide-react";
import Image from "next/image";

const aiFeatures = [
  {
    icon: Camera,
    title: "AI Vision Recognition",
    description: "Snap a photo and our AI identifies food items, estimates quantity, and checks freshness.",
  },
  {
    icon: Brain,
    title: "Smart Expiry Prediction",
    description: "Machine learning models predict optimal donation timing to maximize food utilization.",
  },
  {
    icon: Radar,
    title: "Geo-Radar Matching",
    description: "Real-time location-based matching finds the nearest suitable receivers instantly.",
  },
  {
    icon: Sparkles,
    title: "Trust Score Algorithm",
    description: "AI-powered reputation system ensures reliable donors and verified receivers.",
  },
];

export function AIHighlightSection() {
  return (
    <section className="relative flex flex-col justify-center min-h-[60vh] md:min-h-[70vh] overflow-hidden bg-muted/30 py-8 lg:py-12">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 backdrop-blur-md"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-black uppercase tracking-widest text-primary">Next-Gen Intelligence</span>
            </motion.div>

            <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Smart Technology for{" "}
              <span className="text-gradient">Zero Hunger</span>
            </h2>

            <p className="mb-10 text-base text-muted-foreground leading-relaxed max-w-xl">
              Our cutting-edge AI transforms food rescue operations with 
              intelligent automation and predictive analytics that scale with impact.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              {aiFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group rounded-xl bg-card p-4 border border-border shadow-sm transition-all hover:shadow-md hover:border-primary/20"
                >
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="mb-1 font-bold text-foreground text-base">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 transition-colors">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1 }}
            className="relative hidden lg:block perspective-1000"
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 p-[1px]">
              <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-card shadow-2xl shadow-primary/10">
                <Image
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
                  alt="AI Food Scanning Interface"
                  width={800}
                  height={600}
                  className="w-full opacity-80 transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

