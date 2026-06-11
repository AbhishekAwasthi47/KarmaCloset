'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, Repeat2, ShoppingBag, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const filters = ['All', 'Buy', 'Swap', 'Upcycled', 'Ethnic Wear', 'Sneakers'];

const listings = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=500',
    title: 'Banarasi Saree - Worn Once for a Wedding',
    price: 3250,
    originalPrice: 12000,
    condition: 'Gently Used',
    isSwap: false,
    category: 'Ethnic Wear',
    seller: 'Priya S.',
    city: 'Varanasi',
    height: 'tall',
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=500',
    title: 'Old Levi\'s (waist 30) - Need a size up',
    price: 1400,
    originalPrice: null,
    condition: 'Used',
    isSwap: true,
    category: 'Denim',
    seller: 'Arjun M.',
    city: 'Bangalore',
    height: 'normal',
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=500',
    title: 'Kantha Jacket I made from an old blanket',
    price: 950,
    originalPrice: null,
    condition: 'Upcycled',
    isSwap: true,
    category: 'Jackets',
    seller: 'Meera K.',
    city: 'Kolkata',
    height: 'normal',
  },
  {
    id: 4,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500',
    title: 'Cotton Kurta set - slightly too big for me',
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
    title: 'Air Max 270s (UK 9) - decent condition',
    price: 4150,
    originalPrice: null,
    condition: 'Used',
    isSwap: true,
    category: 'Sneakers',
    seller: 'Rohit P.',
    city: 'Mumbai',
    height: 'normal',
  },
  {
    id: 6,
    image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=500',
    title: 'Phulkari Dupatta handmade by my grandma',
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

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-sage-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-forest-900">Recent Additions</h2>
          <p className="text-sm text-forest-600 mt-1">Freshly listed items from closets across the country</p>
        </div>
        <Link href="/marketplace" className="flex items-center gap-1.5 text-sm font-medium text-forest-600 hover:text-forest-800 transition-colors group">
          View all
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              'whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium border transition-colors',
              activeFilter === f
                ? 'bg-forest-600 text-white border-forest-600'
                : 'bg-white text-forest-700 border-sage-200 hover:bg-sage-50'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="masonry-grid">
        {listings.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            liked={likedItems.has(item.id)}
            onLike={() => toggleLike(item.id)}
          />
        ))}
      </div>
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
    <div className="masonry-item group mb-4">
      <div className="bg-white rounded-lg border border-sage-200 overflow-hidden shadow-sm hover:shadow transition-shadow">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50">
          <img
            src={item.image}
            alt={item.title}
            className="w-full object-cover"
            style={{ height: item.height === 'tall' ? '280px' : '200px' }}
          />

          {/* Simple badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <span className="text-[11px] font-medium px-2 py-0.5 bg-white/95 text-forest-800 rounded-sm shadow-sm">
              {item.condition}
            </span>
            {item.isSwap && (
              <span className="text-[11px] font-medium px-2 py-0.5 bg-sand-100 text-sand-800 rounded-sm shadow-sm flex items-center gap-1 w-fit">
                <Repeat2 className="w-3 h-3" /> Swap
              </span>
            )}
          </div>

          {/* Like button */}
          <button
            onClick={(e) => { e.preventDefault(); onLike(); }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
          >
            <Heart
              className={cn('w-4 h-4 transition-colors', liked ? 'fill-red-500 text-red-500' : 'text-gray-500')}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-3">
          <p className="text-sm text-forest-900 leading-tight mb-2 line-clamp-2">
            {item.title}
          </p>

          {/* Price row */}
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-base font-semibold text-forest-800 inr">₹{item.price.toLocaleString('en-IN')}</span>
            {item.originalPrice && (
              <span className="text-xs text-gray-400 line-through inr">₹{item.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>

          {/* Seller info */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin className="w-3 h-3" />
              <span className="text-xs">{item.city}</span>
            </div>
            <span className="text-xs text-gray-500">by {item.seller}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
