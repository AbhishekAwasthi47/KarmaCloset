'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Leaf, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

const footerLinks = {
  Marketplace: [
    { label: 'All Garments', href: '/marketplace' },
    { label: 'Bhav-Tav Swaps', href: '/swap' },
    { label: 'Sell from Closet', href: '/sell' },
    { label: 'How It Works', href: '/how-it-works' },
  ],
  Support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Buyer Protection', href: '/buyer-protection' },
    { label: 'Shipping & Couriers', href: '/shipping' },
    { label: 'Report an Issue', href: '/report' },
  ],
  Company: [
    { label: 'Our Story', href: '/about' },
    { label: 'Sustainability Impact', href: '/sustainability' },
    { label: 'Editorial Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Grievance Redressal', href: '/grievance' },
  ],
};

const ecoStats = [
  { value: '12.4K+', label: 'Items Rehomed' },
  { value: '8.2 Tons', label: 'CO₂ Emissions Saved' },
  { value: '3.8K+', label: 'Eco Swappers' },
  { value: '42 Cities', label: 'Coverage Across India' },
];

export default function Footer() {
  return (
    <footer className="bg-card text-foreground/85 border-t border-border mt-auto relative z-10 pb-24 md:pb-12">
      
      {/* Sustainability Stats Banner */}
      <div className="bg-secondary/40 border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center border border-border">
                <Leaf className="w-5 h-5 text-accent animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-foreground">Every Wardrobe Deserves Good Karma</p>
                <p className="text-xs text-foreground/50 mt-0.5 font-medium">Bypassing manufacturing footprints, one swap at a time.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 w-full lg:w-auto">
              {ecoStats.map(({ value, label }) => (
                <div key={label} className="text-left sm:text-center">
                  <p className="text-base md:text-lg font-light text-foreground font-serif-editorial italic">{value}</p>
                  <p className="text-[9px] uppercase tracking-wider font-bold text-foreground/45 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          
          {/* Brand Info (takes 2 columns) */}
          <div className="col-span-2 flex flex-col justify-between">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Leaf className="w-4.5 h-4.5 text-primary-foreground" strokeWidth={2.2} />
                </div>
                <span className="font-bold text-lg text-foreground tracking-tight select-none">
                  Karma<span className="text-gradient-gold font-serif-editorial italic font-normal ml-0.5">Closet</span>
                </span>
              </Link>
              <p className="text-xs text-foreground/60 leading-relaxed mb-6 max-w-sm font-medium">
                India’s premier AI-enabled sustainable fashion marketplace. List, trade, and purchase pre-loved or upcycled clothing directly from curated wardrobes.
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-foreground/50 font-medium">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-accent" />
                <span>hello@karmacloset.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-accent" />
                <span>1800-202-3904 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span>Bengaluru, KA, India</span>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-6">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent/15 flex items-center justify-center text-foreground/60 hover:text-accent border border-border transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Links Categories (4 columns) */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-accent mb-5">{category}</h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-xs text-foreground/65 hover:text-accent transition-colors font-medium"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom copyright bar */}
        <div className="mt-16 pt-8 border-t border-border/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] tracking-wider text-foreground/40 font-medium">
            © 2026 KARMACLOSET TECHNOLOGIES PVT. LTD. ALL RIGHTS RESERVED. | CIN: U18101KA2026PTC284920
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[10px] text-foreground/45 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              Secure payments via <span className="text-foreground/75">Razorpay</span>
            </span>
            <span className="text-border/80 hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              Deliveries by <span className="text-foreground/75">Delhivery</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
