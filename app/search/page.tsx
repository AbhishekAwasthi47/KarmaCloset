'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, X, TrendingUp, Clock, Leaf, MapPin, ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const trendingSearches = [
  'Vintage Levi\'s', 'Silk Saree', 'Nike Air Max', 'Banarasi Dupatta',
  'Bomber Jacket', 'Kurta Set', 'Handbag', 'Sneakers'
];

const recentSearches = ['Kurtas', 'Denim jacket', 'Saree under 2000'];

const popularCategories = [
  { label: 'Ethnic Wear', emoji: '👘', href: '/marketplace?category=Ethnic Wear' },
  { label: 'Sneakers', emoji: '👟', href: '/marketplace?category=Sneakers' },
  { label: 'Jackets', emoji: '🧥', href: '/marketplace?category=Jackets' },
  { label: 'Accessories', emoji: '💍', href: '/marketplace?category=Accessories' },
  { label: 'Denim', emoji: '👖', href: '/marketplace?category=Denim' },
  { label: 'Bags', emoji: '👜', href: '/marketplace?category=Bags' },
];

interface SearchResult {
  id: string;
  title: string;
  price_inr: number | null;
  images: string[];
  city: string;
  eco_score: number;
  is_swap_available: boolean;
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setHasSearched(false); return; }
    setSearching(true);
    setHasSearched(true);
    const { data } = await supabase
      .from('products')
      .select('id, title, price_inr, images, city, eco_score, is_swap_available')
      .eq('status', 'available')
      .or(`title.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%`)
      .limit(20);
    setResults((data as SearchResult[]) || []);
    setSearching(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(t);
  }, [query, doSearch]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the closet... kurtas, sneakers, sarees"
          className="w-full pl-12 pr-12 py-4 rounded-2xl border border-sage-200 bg-white text-sm text-forest-800 placeholder:text-forest-400 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all shadow-card"
          autoFocus
        />
        {query && (
          <button onClick={() => { setQuery(''); setHasSearched(false); }} className="absolute right-4 top-1/2 -translate-y-1/2">
            <X className="w-5 h-5 text-forest-400" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {hasSearched ? (
        searching ? (
          <div className="text-center py-12">
            <div className="w-6 h-6 border-2 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-semibold text-forest-800 mb-1">No items found</p>
            <p className="text-sm text-forest-500">Try different keywords or browse categories below</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-forest-500 mb-3">{results.length} results for &ldquo;{query}&rdquo;</p>
            <div className="space-y-3">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => router.push(`/marketplace?id=${item.id}`)}
                  className="w-full flex gap-3 bg-white rounded-xl border border-sage-100 p-3 hover:shadow-card-hover transition-all text-left"
                >
                  <div className="w-16 h-16 rounded-lg bg-sage-50 overflow-hidden shrink-0">
                    {item.images[0] ? (
                      <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-forest-200" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-forest-800 line-clamp-1">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-forest-700 inr">
                        {item.price_inr ? `₹${item.price_inr.toLocaleString('en-IN')}` : 'Swap Only'}
                      </span>
                      <span className="flex items-center gap-0.5 text-[11px] text-forest-500">
                        <Leaf className="w-3 h-3" /> {item.eco_score}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-forest-400 mt-0.5">
                      <MapPin className="w-3 h-3" /> {item.city || 'India'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="space-y-8">
          {/* Recent Searches */}
          <div>
            <h3 className="text-xs font-semibold text-forest-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Recent Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="px-3 py-1.5 rounded-full bg-white border border-sage-200 text-sm text-forest-700 hover:bg-sage-50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Trending */}
          <div>
            <h3 className="text-xs font-semibold text-forest-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Trending in the Closet
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="px-3 py-1.5 rounded-full bg-forest-50 border border-forest-200 text-sm text-forest-700 hover:bg-forest-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-xs font-semibold text-forest-500 uppercase tracking-widest mb-3">Browse Categories</h3>
            <div className="grid grid-cols-3 gap-3">
              {popularCategories.map(({ label, emoji, href }) => (
                <button
                  key={label}
                  onClick={() => router.push(href)}
                  className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-white border border-sage-100 hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-xs font-semibold text-forest-700">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
