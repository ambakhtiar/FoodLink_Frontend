"use client";

import Link from "next/link";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { APP_NAME_FF, APP_NAME_SS, FULL_APP_NAME, APP_MOTTO } from "@/lib/constants";

const footerLinks = {
  product: [
    { href: "/explore", label: "Explore" },
    { href: "/how-it-works", label: "How it Works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/faq", label: "FAQ" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/careers", label: "Careers" },
    { href: "/blog", label: "Blog" },
    { href: "/press", label: "Press" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
    { href: "/licenses", label: "Licenses" },
  ],
  support: [
    { href: "/contact", label: "Contact Us" },
    { href: "/help", label: "Help Center" },
    { href: "/feedback", label: "Feedback" },
    { href: "/status", label: "System Status" },
  ],
};

const socialLinks = [
  { href: "https://facebook.com/helpshare", label: "Facebook", icon: Facebook },
  { href: "https://twitter.com/helpshare", label: "Twitter", icon: Twitter },
  { href: "https://instagram.com/helpshare", label: "Instagram", icon: Instagram },
  { href: "https://linkedin.com/company/helpshare", label: "LinkedIn", icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-6">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md shadow-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/30">
                <span className="text-lg font-black text-primary-foreground">
                    {APP_NAME_FF.charAt(0)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-foreground leading-none">
                  {APP_NAME_FF}<span className="text-primary">{APP_NAME_SS}</span>
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground leading-none mt-0.5">{APP_MOTTO}</span>
              </div>
            </Link>

            <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-w-[260px]">
              Connecting donors with organizations in need. Together, we&apos;re reducing waste and fighting hunger.
            </p>

            {/* Social Links */}
            <div className="mt-8 flex items-center gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {[
            { title: "Product", links: footerLinks.product },
            { title: "Company", links: footerLinks.company },
            { title: "Legal", links: footerLinks.legal },
          ].map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground mb-5">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors duration-150 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground mb-5">Contact</h3>
            <div className="space-y-3.5">
              <a href="mailto:contact@helpshare.org" className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-primary">
                <Mail className="h-4 w-4 shrink-0 text-primary/60" />
                contact@helpshare.org
              </a>
              <a href="tel:+8801234567890" className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-primary">
                <Phone className="h-4 w-4 shrink-0 text-primary/60" />
                +880 1234-567890
              </a>
              <p className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary/60" />
                Dhaka, Bangladesh
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} <span className="font-medium text-foreground">{FULL_APP_NAME}</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            Made with
            <Heart className="h-3.5 w-3.5 text-primary fill-primary" />
            in <span className="font-medium text-foreground">Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
