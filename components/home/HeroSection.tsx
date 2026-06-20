'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, MapPin, TrendingUp, Sparkles, Repeat2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories = [
  'Sarees',
  'Sneakers',
  'Kurtas',
  'Jackets',
  'Vintage Denim',
  'Accessories',
];

const trendingSearches = [
  'Vintage Levi\'s',
  'Organza Saree',
  'Nike Jordan Retro',
  'Banarasi Silk',
  'Upcycled Tote Bag',
];

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-background min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden border-b border-border"
      style={{ perspective: 1200 }}
    >
      {/* Parallax Background Blobs */}
      <motion.div 
        animate={{ 
          x: -mousePos.x * 50, 
          y: -mousePos.y * 50 
        }}
        transition={{ type: 'spring', stiffness: 70, damping: 20 }}
        className="absolute inset-0 bg-warm-spot pointer-events-none opacity-50" 
      />
      <motion.div 
        animate={{ 
          x: -mousePos.x * 100, 
          y: -mousePos.y * 100 
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 22 }}
        className="absolute top-1/4 left-1/3 w-[550px] h-[550px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" 
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column — Elegant Typography & Search */}
          <motion.div 
            animate={{ 
              x: mousePos.x * 12,
              y: mousePos.y * 12,
              rotateY: mousePos.x * 2.5,
              rotateX: -mousePos.y * 2.5,
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="lg:col-span-7 flex flex-col justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Tagline */}
            <div className="inline-flex items-center gap-1.5 karma-badge mb-6 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-accent">Every Wardrobe Deserves Good Karma</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-foreground leading-[1.05] tracking-tight mb-6">
              Your Closet,
              <span className="block text-gradient-gold font-serif-editorial italic font-normal my-2">
                Good Karma
              </span>
              <span className="block">&amp; a Greener Planet</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-foreground/60 mb-8 max-w-lg leading-relaxed font-medium">
              Buy, sell, or swap pre-loved apparel. Clear out your wardrobe, discover unique archival garments, and extend the lifecycle of fashion.
            </p>

            {/* Search Bar */}
            <div className="relative w-full max-w-lg mb-6 z-20">
              <div className={cn(
                'relative bg-card rounded-xl border transition-all duration-300 shadow-sm',
                focused ? 'border-accent ring-2 ring-accent/15' : 'border-border'
              )}>
                <div className="flex items-center">
                  <div className="pl-4 pr-2">
                    <Search className="w-4 h-4 text-foreground/45" />
                  </div>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Search designers, sarees, sneakers..."
                    className="flex-1 py-4 text-xs text-foreground bg-transparent outline-none placeholder:text-foreground/35"
                  />
                  <div className="pr-2">
                    <Button size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg px-5 py-2 text-[10px] font-bold uppercase tracking-wider">
                      Search
                    </Button>
                  </div>
                </div>

                {/* Suggestions dropdown */}
                <AnimatePresence>
                  {focused && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-xl border border-border p-4 z-30"
                    >
                      <p className="text-[9px] text-foreground/45 mb-2.5 flex items-center gap-1.5 uppercase tracking-widest font-bold">
                        <TrendingUp className="w-3.5 h-3.5 text-accent" /> Popular Searches
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {trendingSearches.map((s) => (
                          <button
                            key={s}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setQuery(s);
                              setFocused(false);
                            }}
                            className="text-[10px] px-2.5 py-1.5 rounded-lg bg-secondary text-foreground/85 hover:bg-accent/10 hover:text-accent font-semibold transition-all duration-200"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Category tags */}
            <div className="flex flex-wrap gap-1.5 mb-8 max-w-xl">
              {categories.map((label) => (
                <Link key={label} href={`/marketplace?category=${label.toLowerCase()}`}>
                  <button className="px-3.5 py-1.5 rounded-lg bg-card border border-border text-[10px] font-bold uppercase tracking-wider text-foreground/60 hover:border-accent hover:text-accent hover:bg-secondary/40 transition-all duration-200">
                    {label}
                  </button>
                </Link>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/marketplace">
                <Button className="bg-primary hover:bg-primary/95 text-primary-foreground px-7 py-3.5 h-auto rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all duration-300">
                  Shop Marketplace
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/sell">
                <Button variant="outline" className="border-border text-foreground/80 hover:bg-secondary px-7 py-3.5 h-auto rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all duration-300">
                  Clean &amp; Sell
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Column — 3D Holographic Card Deck */}
          <motion.div 
            animate={{ 
              x: mousePos.x * 25,
              y: mousePos.y * 25,
              rotateY: mousePos.x * 6,
              rotateX: -mousePos.y * 6,
            }}
            transition={{ type: 'spring', stiffness: 90, damping: 20 }}
            className="lg:col-span-5 relative h-[480px] flex items-center justify-center mt-12 lg:mt-0"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <HolographicDeck />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

const cardsData = [
  {
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=500',
    title: 'Silk Organza Saree',
    price: '₹2,500',
    tag: 'Selling',
    rotate: -4,
    x: -16,
    y: 8,
    z: 0,
    fanRotate: -15,
    fanX: -110,
    fanY: 15,
    fanZ: 10,
  },
  {
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=500',
    title: 'Upcycled Denim Jacket',
    price: '₹850',
    tag: 'Upcycled',
    rotate: 0,
    x: 0,
    y: 0,
    z: 15,
    fanRotate: 0,
    fanX: 0,
    fanY: -20,
    fanZ: 25,
  },
  {
    image: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=500',
    title: 'Vintage Levi\'s 501',
    price: 'Swap preferred',
    tag: 'Swap',
    rotate: 4,
    x: 16,
    y: 8,
    z: 0,
    fanRotate: 15,
    fanX: 110,
    fanY: 15,
    fanZ: 10,
  },
];

function HolographicDeck() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative w-full max-w-[280px] h-[380px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Ambient background light rays */}
      <div 
        className="absolute inset-0 bg-accent/5 rounded-2xl blur-3xl scale-95 pointer-events-none transition-opacity duration-500" 
        style={{ opacity: isHovered ? 0.6 : 0.2 }} 
      />

      {[0, 2, 1].map((idx) => (
        <HolographicCard key={idx} card={cardsData[idx]} isParentHovered={isHovered} index={idx} />
      ))}
    </motion.div>
  );
}

interface HolographicCardProps {
  card: typeof cardsData[number];
  isParentHovered: boolean;
  index: number;
}

function HolographicCard({ card, isParentHovered, index }: HolographicCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shimmer, setShimmer] = useState({ x: '50%', y: '50%' });
  const [isSelfHovered, setIsSelfHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    // Max 12 degrees local tilt
    const rotateX = ((yc - y) / yc) * 12;
    const rotateY = ((x - xc) / xc) * 12;
    
    setTilt({ x: rotateX, y: rotateY });
    setShimmer({ x: `${(x / rect.width) * 100}%`, y: `${(y / rect.height) * 100}%` });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setShimmer({ x: '50%', y: '50%' });
    setIsSelfHovered(false);
  };

  const currentX = isParentHovered ? card.fanX : card.x;
  const currentY = isParentHovered ? card.fanY : card.y;
  const currentZ = isParentHovered ? card.fanZ : card.z;
  const currentRotate = isParentHovered ? card.fanRotate : card.rotate;

  return (
    <motion.div
      animate={{
        x: currentX,
        y: currentY,
        z: currentZ,
        rotate: currentRotate,
        rotateX: isSelfHovered ? tilt.x : 0,
        rotateY: isSelfHovered ? tilt.y : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 140,
        damping: 18,
      }}
      whileHover={{
        scale: 1.05,
        y: currentY - 20,
        z: currentZ + 40,
        zIndex: 50,
        transition: { duration: 0.2 }
      }}
      onMouseEnter={() => setIsSelfHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
        zIndex: index === 1 ? 30 : 20,
      }}
      className="absolute inset-0 w-full h-full bg-card p-3 pb-4 rounded-xl shadow-lg border border-border select-none origin-bottom glow-card cursor-pointer group"
    >
      {/* 3D Holographic sheen overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300 mix-blend-color-dodge rounded-xl z-20"
        style={{
          background: `radial-gradient(circle at ${shimmer.x} ${shimmer.y}, rgba(255,255,255,0.7) 0%, rgba(196,164,124,0.35) 50%, transparent 80%)`,
        }}
      />

      <div className="relative overflow-hidden rounded-lg bg-secondary h-[240px]">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover brightness-95 contrast-105 transition-transform duration-500 hover:scale-105"
          draggable={false}
        />
      </div>
      
      <div className="px-1 flex justify-between items-start gap-1 mt-3" style={{ transform: 'translateZ(20px)' }}>
        <div>
          <p className="text-xs font-semibold text-foreground font-serif-editorial italic leading-tight mb-1">{card.title}</p>
          <span className="text-[10px] text-foreground/50 font-semibold">{card.price}</span>
        </div>
        <span className={cn(
          'text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border',
          card.tag === 'Upcycled' ? 'bg-accent/10 text-accent border-accent/20' :
          card.tag === 'Swap' ? 'bg-secondary text-foreground/80 border-border' :
          'bg-primary text-primary-foreground border-primary'
        )}>
          {card.tag}
        </span>
      </div>
    </motion.div>
  );
}
