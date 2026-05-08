"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Utensils, Building2, Heart, TrendingUp } from "lucide-react";

interface StatItemProps {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  delay: number;
}

function StatItem({ icon: Icon, value, suffix, label, delay }: StatItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const duration = 2500;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      className="relative flex flex-col items-center text-center group"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="text-3xl font-black tracking-tight sm:text-4xl text-foreground">
        {count.toLocaleString()}
        {suffix}
      </div>
      <p className="mt-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
    </motion.div>
  );
}

const stats = [
  { icon: Utensils, value: 50000, suffix: "+", label: "Meals Rescued" },
  { icon: Building2, value: 2500, suffix: "+", label: "Active NGOs" },
  { icon: Heart, value: 10000, suffix: "+", label: "Food Donors" },
  { icon: TrendingUp, value: 95, suffix: "%", label: "Match Success Rate" },
];

export function StatsSection() {
  return (
    <section className="relative flex flex-col justify-center min-h-[60vh] md:min-h-[70vh] overflow-hidden bg-muted/30 py-8 md:py-12">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-1/3 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4 block"
          >
            Real Impact
          </motion.span>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Our Impact in <span className="italic font-serif">Numbers</span>
          </h2>
          <div className="mt-6 mx-auto h-1.5 w-24 rounded-full bg-gradient-to-r from-primary to-secondary" />
          <p className="mt-8 mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Every number represents a life touched, a meal saved, and a step 
            closer to our vision of <span className="font-bold text-foreground">Zero Hunger</span>.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

