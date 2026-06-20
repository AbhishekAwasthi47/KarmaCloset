'use client';

import { motion } from 'framer-motion';
import { Leaf, Recycle, Users, Sparkles } from 'lucide-react';

const stats = [
  {
    icon: Recycle,
    value: '12,400+',
    label: 'Closets Refreshed',
    sub: 'Pre-loved items swapped and sold, extending apparel lifecycles.',
    size: 'lg:col-span-2',
    accentColor: 'text-accent',
  },
  {
    icon: Leaf,
    value: '8.2 Tons',
    label: 'Carbon Offset',
    sub: 'CO₂ emissions saved—equivalent to 412 mature trees planted.',
    size: 'lg:col-span-1',
    accentColor: 'text-emerald-700/80',
  },
  {
    icon: Users,
    value: '3,800+',
    label: 'Eco Members',
    sub: 'Fashion conscious sellers across 42 Indian cities.',
    size: 'lg:col-span-1',
    accentColor: 'text-accent',
  },
  {
    icon: Sparkles,
    value: '< 2 Min',
    label: 'AI Listing Magic',
    sub: 'Snap, upload, and list instantly. Our AI handles descriptions.',
    size: 'lg:col-span-2',
    accentColor: 'text-amber-600/85',
  },
];

export default function StatsBar() {
  return (
    <section className="py-20 bg-background relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-warm-spot pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Section Header */}
        <div className="text-center md:text-left mb-12 max-w-xl">
          <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-accent mb-2">Our Impact in Numbers</p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground leading-tight">
            Curating conscious fashion, <span className="font-serif-editorial italic font-normal text-gradient-gold">one exchange</span> at a time.
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map(({ icon: Icon, value, label, sub, size, accentColor }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`glow-card bg-card border border-border p-8 rounded-xl flex flex-col justify-between card-lift min-h-[220px] ${size}`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${accentColor}`} />
                </div>
                <span className="text-[10px] font-bold text-foreground/25 uppercase tracking-widest">0{i + 1}</span>
              </div>

              <div>
                <p className="text-3xl md:text-4xl font-light text-foreground tracking-tight mb-1">
                  {value}
                </p>
                <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">
                  {label}
                </p>
                <p className="text-xs text-foreground/60 leading-relaxed font-medium">
                  {sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
