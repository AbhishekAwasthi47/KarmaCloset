'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight, Repeat2, MapPin, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const filters = ['All', 'Buy', 'Swap', 'Upcycled', 'Ethnic Wear', 'Sneakers'];

const listings = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=500',
    title: 'Banarasi Silk Saree — Worn Once',
    price: 3250,
    originalPrice: 12000,
    condition: 'Almost New',
    isSwap: false,
    category: 'Ethnic Wear',
    seller: 'Priya S.',
    city: 'Varanasi',
    height: 'tall',
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=500',
    title: 'Vintage Levi\'s 501 (Waist 30)',
    price: 1400,
    originalPrice: null,
    condition: 'Gently Used',
    isSwap: true,
    category: 'Swap',
    seller: 'Arjun M.',
    city: 'Bangalore',
    height: 'normal',
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=500',
    title: 'Kantha Stitch Jacket (Handmade)',
    price: 950,
    originalPrice: null,
    condition: 'Upcycled',
    isSwap: true,
    category: 'Upcycled',
    seller: 'Meera K.',
    city: 'Kolkata',
    height: 'normal',
  },
  {
    id: 4,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500',
    title: 'Cotton Kurta & Pant Set',
    price: 750,
    originalPrice: 2800,
    condition: 'Almost New',
    isSwap: false,
    category: 'Ethnic Wear',
    seller: 'Anjali R.',
    city: 'Jaipur',
    height: 'tall',
  },
  {
    id: 5,
    image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=500',
    title: 'Nike Air Max 270s (UK 9)',
    price: 4150,
    originalPrice: 9999,
    condition: 'Gently Used',
    isSwap: true,
    category: 'Sneakers',
    seller: 'Rohit P.',
    city: 'Mumbai',
    height: 'normal',
  },
  {
    id: 6,
    image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=500',
    title: 'Phulkari Embroidered Dupatta',
    price: 450,
    originalPrice: null,
    condition: 'Vintage',
    isSwap: false,
    category: 'Accessories',
    seller: 'Gurpreet K.',
    city: 'Amritsar',
    height: 'tall',
  },
];

export default function FeaturedListings() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredListings = listings.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Buy') return !item.isSwap;
    if (activeFilter === 'Swap') return item.isSwap;
    if (activeFilter === 'Upcycled') return item.condition === 'Upcycled';
    return item.category === activeFilter;
  });

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-border">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-accent mb-2">Curated Collection</p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground">
            Recent <span className="font-serif-editorial italic font-normal text-gradient-gold">Additions</span>
          </h2>
          <p className="text-xs text-foreground/50 mt-1.5 font-medium">Freshly listed garments from premium closets across the country</p>
        </div>
        <Link href="/marketplace" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent hover:text-accent/80 transition-colors group">
          View All Archive
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-10 border-b border-border/60">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              'whitespace-nowrap px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all duration-200',
              activeFilter === f
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card text-foreground/70 border-border hover:bg-secondary hover:text-foreground'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Masonry Grid with Animations */}
      <motion.div
        layout
        className="masonry-grid"
      >
        <AnimatePresence mode="popLayout">
          {filteredListings.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="masonry-item"
            >
              <ProductCard
                item={item}
                liked={likedItems.has(item.id)}
                onLike={() => toggleLike(item.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

interface ProductCardProps {
  item: typeof listings[number];
  liked: boolean;
  onLike: () => void;
}

function ProductCard({ item, liked, onLike }: ProductCardProps) {
  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col glow-card">
      
      {/* Image Container */}
      <div className="relative overflow-hidden bg-secondary select-none">
        <img
          src={item.image}
          alt={item.title}
          className="w-full object-cover transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
          style={{ height: item.height === 'tall' ? '300px' : '220px' }}
          draggable={false}
        />

        {/* Action Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-1 bg-card/95 text-foreground rounded border border-border shadow-sm">
            {item.condition}
          </span>
          {item.isSwap && (
            <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-1 bg-accent/95 text-accent-foreground rounded border border-accent/20 shadow-sm flex items-center gap-1">
              <Repeat2 className="w-3 h-3" /> Swap
            </span>
          )}
        </div>

        {/* Favorite Icon */}
        <button
          onClick={(e) => { e.preventDefault(); onLike(); }}
          className="absolute top-3 right-3 p-2 rounded-full bg-card/85 hover:bg-card flex items-center justify-center transition-all duration-200 border border-border/40 hover:scale-105 active:scale-95 z-10"
        >
          <Heart
            className={cn('w-3.5 h-3.5 transition-colors duration-300', liked ? 'fill-red-500 text-red-500' : 'text-foreground/45')}
          />
        </button>
      </div>

      {/* Info Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground leading-snug mb-2 font-serif-editorial italic group-hover:text-accent transition-colors duration-300">
            {item.title}
          </h3>
          
          {/* Price details */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-sm font-bold text-foreground inr">₹{item.price.toLocaleString('en-IN')}</span>
            {item.originalPrice && (
              <span className="text-xs text-foreground/35 line-through font-semibold inr">₹{item.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
        </div>

        {/* Seller / City Row */}
        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <div className="flex items-center gap-1 text-foreground/45 font-medium">
            <MapPin className="w-3 h-3 text-accent" />
            <span className="text-[10px] uppercase tracking-wider">{item.city}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/45">By {item.seller}</span>
        </div>
      </div>

    </div>
  );
}
