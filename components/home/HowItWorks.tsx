'use client';

import { motion } from 'framer-motion';
import { Camera, Sparkles, MessageCircle, Truck } from 'lucide-react';

const steps = [
  {
    icon: Camera,
    step: '01',
    title: 'Snap a Photo',
    description: 'Capture your item simply on your phone. No studio lighting needed—our community loves authenticity.',
  },
  {
    icon: Sparkles,
    step: '02',
    title: 'Instant AI Listing',
    description: 'Upload the photo. Our AI scans the details and writes the description and details in seconds.',
  },
  {
    icon: MessageCircle,
    step: '03',
    title: 'Bhav-Tav & Swap',
    description: 'Chat securely with buyers. Accept cash offers or trade for something in their closet.',
  },
  {
    icon: Truck,
    step: '04',
    title: 'Doorstep Courier',
    description: 'Our shipping partners pick up the packed item from your door and deliver it straight to the buyer.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-background relative overflow-hidden border-b border-border">
      {/* Decorative spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-accent mb-3">Simple &amp; Sustainable</p>
          <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">
            How <span className="font-serif-editorial italic font-normal text-gradient-gold">KarmaCloset</span> Works
          </h2>
          <p className="text-sm md:text-base text-foreground/60 leading-relaxed font-medium">
            Exchanging clothes should be as simple as buying new. We handle the listing support, secure payments, and shipping.
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="relative">
          
          {/* Connecting Line Vector - Desktop */}
          <div className="absolute top-16 left-[10%] right-[10%] h-0.5 hidden lg:block pointer-events-none">
            <svg className="w-full h-8 overflow-visible" fill="none">
              <motion.path
                d="M 0 0 C 200 40, 400 -40, 600 0 C 800 40, 1000 -40, 1200 0"
                stroke="rgba(196, 164, 124, 0.25)"
                strokeWidth="2"
                strokeDasharray="6 6"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map(({ icon: Icon, step, title, description }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="flex flex-col items-center text-center group relative"
              >
                {/* Step Circle Card */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center shadow-sm relative z-10 transition-all duration-300 group-hover:border-accent group-hover:shadow-md">
                    <Icon className="w-8 h-8 text-accent transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  
                  {/* Step number badge */}
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center border-2 border-background z-20">
                    {step}
                  </span>
                </div>

                {/* Details */}
                <div className="px-4">
                  <h3 className="font-serif-editorial italic text-xl font-medium text-foreground mb-3 transition-colors duration-300 group-hover:text-accent">
                    {title}
                  </h3>
                  <p className="text-xs text-foreground/60 leading-relaxed max-w-[240px] mx-auto font-medium">
                    {description}
                  </p>
                </div>

              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
