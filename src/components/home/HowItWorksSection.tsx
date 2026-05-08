"use client";

import { motion } from "framer-motion";
import { Upload, Users, Heart, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Surplus Food",
    description:
      "Take a photo of your surplus food. Our AI identifies items and estimates quantity automatically.",
    step: "01",
  },
  {
    icon: Users,
    title: "Get Matched Instantly",
    description:
      "Our radar finds nearby NGOs and receivers who need your food. Real-time matching within minutes.",
    step: "02",
  },
  {
    icon: Heart,
    title: "Make an Impact",
    description:
      "Coordinate pickup or delivery. Track your contribution to zero hunger and see lives touched.",
    step: "03",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative flex flex-col justify-center min-h-[60vh] md:min-h-[70vh] overflow-hidden bg-background py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center"
        >
          <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 border border-primary/20">
            <span className="text-xs font-black uppercase tracking-widest text-primary">Process Flow</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl mb-4">
            Simple <span className="text-gradient">Journey</span> to Impact
          </h2>
          <p className="mx-auto max-w-2xl text-base font-medium text-muted-foreground">
            From surplus to meaningful contribution in three seamless technological phases.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="absolute left-32 right-32 top-32 hidden h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 lg:block" />

          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="relative group"
              >
                <div className="bg-card relative rounded-[2rem] p-6 text-center shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-border">
                  {/* Step Number Badge */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-sm font-black text-white shadow-lg group-hover:scale-110 transition-transform">
                    {step.step}
                  </div>
                  <div className="relative z-10 flex flex-col items-center pt-4">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold tracking-tight text-card-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                </div>

                {/* Mobile Connector */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center py-6 lg:hidden">
                    <div className="h-12 w-0.5 bg-gradient-to-b from-primary/40 to-transparent" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

