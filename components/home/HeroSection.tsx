'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, MapPin, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories = [
  'Kurtas',
  'Sarees',
  'Sneakers',
  'Lehengas',
  'Jackets',
  'Accessories',
];

const trendingSearches = ['Vintage Levi\'s', 'Silk Saree', 'Nike Air Max', 'Banarasi Dupatta', 'Bomber Jacket'];

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <section className="relative bg-[#faf8f3] min-h-[85vh] flex items-center border-b border-sage-200">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Content */}
          <div className="animate-slide-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-forest-900 leading-[1.1] tracking-tight mb-5">
              Your Closet,
              <span className="block text-forest-600 mt-2">
                Good Karma
              </span>
              <span className="block mt-2">&amp; a Greener Planet</span>
            </h1>

            <p className="text-lg text-forest-700/80 mb-8 max-w-lg leading-relaxed">
              Buy, sell, or swap pre-owned clothing. Clean out your closet, find unique pieces, and give clothes a second life in our community.
            </p>

            {/* Search Bar */}
            <div className={cn(
              'relative bg-white rounded-lg shadow-sm border transition-all duration-200 mb-6',
              focused ? 'border-forest-400 ring-1 ring-forest-400' : 'border-sage-200'
            )}>
              <div className="flex items-center">
                <div className="pl-4 pr-2">
                  <Search className="w-5 h-5 text-forest-400" />
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Search for kurtas, sneakers, sarees..."
                  className="flex-1 py-4 text-sm text-forest-800 placeholder:text-forest-400 bg-transparent outline-none"
                />
                <div className="pr-2">
                  <Button size="sm" className="bg-forest-600 hover:bg-forest-700 text-white rounded px-5 py-2 font-medium">
                    Search
                  </Button>
                </div>
              </div>
              {/* Trending suggestions */}
              {focused && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-md border border-sage-100 p-4 z-10">
                  <p className="text-xs text-forest-500 mb-3 flex items-center gap-1 uppercase tracking-wider">
                    <TrendingUp className="w-3 h-3" /> Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((s) => (
                      <button
                        key={s}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setQuery(s);
                          setFocused(false);
                        }}
                        className="text-sm px-3 py-1.5 rounded bg-sage-50 text-forest-700 hover:bg-sage-100 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((label) => (
                <Link key={label} href={`/marketplace?category=${label.toLowerCase()}`}>
                  <button className="px-4 py-2 rounded-md bg-white border border-sage-200 text-sm font-medium text-forest-700 hover:bg-sage-50 transition-colors">
                    {label}
                  </button>
                </Link>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/marketplace">
                <Button className="bg-forest-600 hover:bg-forest-700 text-white px-6 py-3 h-auto rounded-md font-medium transition-all">
                  Explore the Closet
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/sell">
                <Button variant="outline" className="border-forest-300 text-forest-700 hover:bg-sage-50 px-6 py-3 h-auto rounded-md font-medium">
                  Clean Out &amp; Sell
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 mt-10 pt-6 border-t border-sage-200">
              <div>
                <p className="text-sm font-medium text-forest-800">Over 3,800 active community members</p>
                <p className="text-xs text-forest-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> Exchanging fashion across India
                </p>
              </div>
            </div>
          </div>

          {/* Right — Visual Cards */}
          <div className="relative hidden lg:block">
            <HeroProductCards />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroProductCards() {
  const cards = [
    {
      image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Silk Saree (Worn Once)',
      price: '₹2,500',
      tag: 'Selling',
      rotate: '-6deg',
      position: 'top-10 left-12',
      zIndex: 10,
    },
    {
      image: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Old Levi\'s 501',
      price: 'Swap preferred',
      tag: 'Swap',
      rotate: '4deg',
      position: 'top-20 right-4',
      zIndex: 20,
    },
    {
      image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Upcycled Jacket',
      price: '₹850',
      tag: 'Upcycled',
      rotate: '-2deg',
      position: 'bottom-4 left-24',
      zIndex: 30,
    },
  ];

  return (
    <div className="relative h-[480px] w-full">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`absolute ${card.position} w-56 bg-[#fdfdfc] p-3 pb-4 shadow-md border border-gray-200 cursor-pointer transition-transform hover:scale-105 hover:z-50`}
          style={{ transform: `rotate(${card.rotate})`, zIndex: card.zIndex }}
        >
          <div className="relative mb-3">
            <img src={card.image} alt={card.title} className="w-full h-48 object-cover brightness-95 contrast-105" />
          </div>
          <div className="px-1 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-800 font-serif italic mb-1">{card.title}</p>
              <span className="text-sm text-gray-600">{card.price}</span>
            </div>
            <span className={cn(
              'text-[10px] uppercase tracking-wide font-bold px-2 py-1 rounded-sm',
              card.tag === 'Upcycled' ? 'bg-forest-100 text-forest-700' :
              card.tag === 'Swap' ? 'bg-sand-100 text-sand-800' :
              'bg-gray-100 text-gray-600'
            )}>
              {card.tag}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
