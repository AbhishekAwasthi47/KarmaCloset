'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTABanner() {
  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-border">
      {/* Decorative blurs */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="bg-card border border-border rounded-2xl p-10 md:p-16 text-center relative overflow-hidden shadow-sm glow-card"
        >
          {/* Subtle background warm circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-secondary/40 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Tagline */}
            <div className="inline-flex items-center gap-1.5 karma-badge mb-6">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-[9px] tracking-[0.2em] uppercase font-bold">Give Clothes a Second Life</span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight">
              Have garments you <span className="font-serif-editorial italic font-normal text-gradient-gold">no longer wear?</span>
            </h2>

            {/* Description */}
            <p className="text-sm md:text-base text-foreground/60 mb-10 leading-relaxed font-medium">
              Pass them on to fellow collectors who will value them. Listing takes less than two minutes, and it is completely free for individual sellers.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sell" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-widest uppercase text-xs px-8 py-4 h-auto rounded-lg transition-all duration-300">
                  List Your Wardrobe
                </Button>
              </Link>
              <Link href="/marketplace" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-border text-foreground/80 hover:bg-secondary font-bold tracking-widest uppercase text-xs px-8 py-4 h-auto rounded-lg transition-all duration-300">
                  Browse Marketplace
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
