"use client";

import { motion } from "framer-motion";
import { FULL_APP_NAME } from "@/lib/constants";
import { Camera, MapPin, Shield, Zap, Clock, Bell } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "AI Food Vision",
    description:
      "Upload a photo of surplus food and our AI automatically identifies items, estimates quantity, and suggests expiry dates.",
    color: "primary",
  },
  {
    icon: MapPin,
    title: "Radar Matching",
    description:
      "Our smart radar finds nearby NGOs and receivers in real-time based on location, needs, and pickup capacity.",
    color: "secondary",
  },
  {
    icon: Shield,
    title: "Trust Score System",
    description:
      "Verified donors and receivers with reputation scores ensure safe, reliable food sharing within the community.",
    color: "emerald",
  },
  {
    icon: Zap,
    title: "Instant Alerts",
    description:
      "Get real-time notifications when matching food is available nearby or when your donation is claimed.",
    color: "accent",
  },
  {
    icon: Clock,
    title: "Expiry Tracking",
    description:
      "Smart alerts for food approaching expiration ensure nothing goes to waste and donations are timely.",
    color: "orange",
  },
  {
    icon: Bell,
    title: "Impact Reports",
    description:
      "Track your contribution to zero hunger with detailed monthly reports showing meals saved and CO2 reduced.",
    color: "indigo",
  },
];

const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
  primary: { bg: "bg-primary/10", icon: "text-primary", border: "group-hover:border-primary/50" },
  secondary: { bg: "bg-secondary/10", icon: "text-secondary", border: "group-hover:border-secondary/50" },
  emerald: { bg: "bg-emerald-500/10", icon: "text-emerald-500", border: "group-hover:border-emerald-500/50" },
  accent: { bg: "bg-accent/10", icon: "text-accent", border: "group-hover:border-accent/50" },
  orange: { bg: "bg-orange-500/10", icon: "text-orange-500", border: "group-hover:border-orange-500/50" },
  indigo: { bg: "bg-indigo-500/10", icon: "text-indigo-500", border: "group-hover:border-indigo-500/50" },
};

export function FeaturesSection() {
  return (
    <section className="relative flex flex-col justify-center min-h-[40vh] md:min-h-[50vh] overflow-hidden bg-primary text-primary-foreground py-6 md:py-8">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 -right-20 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-1/4 -left-20 h-[500px] w-[500px] rounded-full bg-secondary/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white mb-6"
          >
            Intelligent Platform
          </motion.span>
          <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl lg:text-3xl">
            How {FULL_APP_NAME} <span className="text-blue-200">Empowers</span> You
          </h2>
          <p className="mt-2 max-w-2xl mx-auto text-sm text-blue-100/90 leading-relaxed">
            Experience the future of food rescue with our cutting-edge AI-driven 
            ecosystem designed for speed and impact.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
              whileHover={{ y: -8 }}
              className={`bg-card group relative flex flex-col items-start rounded-2xl p-4 lg:p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 ${colorClasses[feature.color].border}`}
            >
              {/* Inner Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              
              <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${colorClasses[feature.color].bg} transition-colors`}>
                <feature.icon className={`h-4 w-4 ${colorClasses[feature.color].icon}`} />
              </div>
              <h3 className="mb-1 text-base font-bold text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {feature.description}
              </p>
              
              <motion.div 
                className="mt-4 relative z-10 flex items-center gap-1 text-[10px] font-bold text-primary opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0"
              >
                Learn more 
                <span className="text-sm">→</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

