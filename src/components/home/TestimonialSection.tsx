"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Farhana Rahman",
    role: "NGO Director",
    organization: "Food for All Foundation",
    content:
      "FoodLink has revolutionized how we collect surplus food. We now receive real-time alerts and have rescued over 5,000 meals this month alone.",
    rating: 5,
    avatar: "FR",
  },
  {
    name: "Ahmed Khan",
    role: "Restaurant Owner",
    organization: "Royal Kitchen",
    content:
      "Instead of throwing away excess food, we now donate it daily. The AI recognition makes posting incredibly fast, and we've built great relationships with local NGOs.",
    rating: 5,
    avatar: "AK",
  },
  {
    name: "Sadia Islam",
    role: "Volunteer Coordinator",
    organization: "Youth Against Hunger",
    content:
      "The trust score system gives us confidence in every donation. We've helped feed over 200 families through FoodLink's intelligent matching system.",
    rating: 5,
    avatar: "SI",
  },
];

export function TestimonialSection() {
  return (
    <section className="relative flex flex-col justify-center min-h-[60vh] md:min-h-[70vh] overflow-hidden bg-background py-8 md:py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-primary/5 blur-[120px] rounded-full -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-secondary/5 blur-[120px] rounded-full -ml-64 -mb-64" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 border border-primary/20">
            <span className="text-xs font-black uppercase tracking-widest text-primary">Success Stories</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl mb-4">
            Voices of <span className="text-gradient">Impact</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base font-medium text-muted-foreground">
            Join thousands of visionary donors and organizations creating a sustainable future without hunger.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              whileHover={{ y: -10 }}
              className="bg-card rounded-[2rem] p-6 md:p-8 relative shadow-md hover:shadow-xl transition-all duration-500 border border-border"
            >
              <Quote className="absolute right-6 top-6 h-10 w-10 text-primary/10 rotate-12" />
              
              <div className="flex items-center gap-2 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-secondary text-secondary"
                  />
                ))}
              </div>

              <p className="text-lg font-medium text-foreground mb-6 relative z-10 leading-relaxed italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20 bg-muted shrink-0 flex items-center justify-center font-black text-primary">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-base font-bold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="mt-1 text-[10px] font-black text-primary uppercase tracking-widest">
                    {testimonial.organization}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

