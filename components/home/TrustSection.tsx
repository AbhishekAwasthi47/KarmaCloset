'use client';

import { motion } from 'framer-motion';
import { Shield, CreditCard, Truck, BadgeCheck } from 'lucide-react';

const trustFeatures = [
  {
    icon: BadgeCheck,
    title: 'Verified Community',
    description: 'We authenticate users and perform basic profile verification so you trade with confidence.',
  },
  {
    icon: Shield,
    title: 'Secure Escrow',
    description: 'Funds are held securely by KarmaCloset and only released once you confirm delivery matches the description.',
  },
  {
    icon: CreditCard,
    title: 'Simple UPI checkout',
    description: 'Pay instantly via UPI, NetBanking, or card using our secure transaction gateway.',
  },
  {
    icon: Truck,
    title: 'Door-to-Door Courier',
    description: 'No meeting up with strangers. Our courier partners handle pickup from the seller and delivery to you.',
  },
];

const testimonials = [
  {
    name: 'Ananya S.',
    city: 'Delhi',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&fit=crop',
    review: 'Honestly didn\'t expect peer-swapping to be this seamless. Cleaned out my wardrobe and shipped three vintage jackets in a week. Highly recommended!',
  },
  {
    name: 'Vikram N.',
    city: 'Bangalore',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&fit=crop',
    review: 'Found some archive sneakers for half retail price. The negotiation feature is super friendly and low-pressure. Will definitely buy again.',
  },
  {
    name: 'Priya M.',
    city: 'Chennai',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&fit=crop',
    review: 'I love seeing my old clothes go to someone who actually values them. Keeping things out of landfills makes the closet cleanout feel great.',
  },
  {
    name: 'Rohan D.',
    city: 'Mumbai',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&fit=crop',
    review: 'The AI listing tool is a game changer. Took a quick photo of my hand-me-down denim jacket, and the post was live and detailed under a minute!',
  },
];

// Duplicate list to ensure seamless marquee wrapping
const marqueeList = [...testimonials, ...testimonials, ...testimonials];

export default function TrustSection() {
  return (
    <section className="py-24 bg-background border-b border-border overflow-hidden relative">
      <div className="absolute inset-0 bg-warm-spot pointer-events-none opacity-40" />

      {/* Trust Badges Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 relative z-10">
        <div className="text-center mb-16 max-w-xl mx-auto">
          <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-accent mb-3">Safe &amp; Secure</p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground">
            A trusted environment to <span className="font-serif-editorial italic font-normal text-gradient-gold">swap &amp; shop</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustFeatures.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-5 text-accent">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-2">
                {title}
              </h3>
              <p className="text-xs text-foreground/60 leading-relaxed font-medium">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials Marquee Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center md:text-left">
          <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-accent mb-2">Community Voices</p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground">
            Loved by <span className="font-serif-editorial italic font-normal text-gradient-gold">conscious collectors</span>
          </h2>
        </div>

        {/* Marquee Track Container */}
        <div className="w-full overflow-hidden py-4 select-none relative mask-gradient-x">
          {/* Subtle overlay gradients for fade edges */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

          <div className="animate-marquee-scroll hover:[animation-play-state:paused] flex gap-6">
            {marqueeList.map((t, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.2 }}
                className="w-[380px] flex-shrink-0 bg-card border border-border rounded-xl p-6 shadow-sm cursor-grab active:cursor-grabbing hover:border-accent/40 hover:shadow-md transition-shadow"
              >
                <p className="text-sm text-foreground/75 leading-relaxed italic mb-6 font-medium">
                  "{t.review}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-border"
                    draggable={false}
                  />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-foreground">{t.name}</p>
                    <p className="text-[10px] font-semibold text-accent">{t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
