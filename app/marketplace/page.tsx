'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, Leaf, Heart, Repeat2, ShoppingBag, MapPin, X, ChevronDown, Grid3x3 as Grid3X3, LayoutList, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const categories = [
  'All', 'Ethnic Wear', 'Western Wear', 'Sneakers', 'Jackets',
  'Accessories', 'Denim', 'Bags', 'Kids', 'Home Decor'
];

const conditions = ['Any', 'New with Tags', 'Gently Used', 'Upcycled'];
const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Karma Score', value: 'karma' },
];

interface Product {
  id: string;
  title: string;
  description: string;
  price_inr: number | null;
  is_swap_available: boolean;
  eco_tag: string;
  category: string;
  status: string;
  images: string[];
  eco_score: number;
  owner_id: string;
  pincode: string;
  city: string;
  created_at: string;
}

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeCondition, setActiveCondition] = useState('Any');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select('*')
      .eq('status', 'available');

    if (activeCategory !== 'All') {
      query = query.eq('category', activeCategory);
    }
    if (activeCondition !== 'Any') {
      query = query.eq('eco_tag', activeCondition);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
    }
    if (priceRange[0] > 0) {
      query = query.gte('price_inr', priceRange[0]);
    }
    if (priceRange[1] < 50000) {
      query = query.lte('price_inr', priceRange[1]);
    }

    switch (sortBy) {
      case 'price_asc':
        query = query.order('price_inr', { ascending: true, nullsFirst: false });
        break;
      case 'price_desc':
        query = query.order('price_inr', { ascending: false, nullsFirst: true });
        break;
      case 'karma':
        query = query.order('eco_score', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data } = await query.limit(48);
    setProducts((data as Product[]) || []);
    setLoading(false);
  }, [activeCategory, activeCondition, sortBy, search, priceRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleLike = (id: string) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const activeFilterCount = [
    activeCategory !== 'All',
    activeCondition !== 'Any',
    priceRange[0] > 0 || priceRange[1] < 50000,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-forest-900">The Closet</h1>
        <p className="text-forest-600 mt-1 text-sm">Browse pre-owned and eco-friendly items from closets across India</p>
      </div>

      {/* Search & Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search kurtas, sneakers, sarees..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sage-200 bg-white text-sm text-forest-800 placeholder:text-forest-400 focus:border-forest-400 focus:ring-2 focus:ring-forest-100 outline-none transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-forest-400" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'border-sage-200 rounded-xl text-sm',
              activeFilterCount > 0 && 'border-forest-400 text-forest-700 bg-forest-50'
            )}
          >
            <SlidersHorizontal className="w-4 h-4 mr-1.5" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-forest-600 text-white border-0 rounded-full">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          <div className="relative">
            <Button variant="outline" className="border-sage-200 rounded-xl text-sm">
              <ArrowUpDown className="w-4 h-4 mr-1.5" />
              Sort
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="hidden sm:flex border border-sage-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn('p-2 transition-colors', viewMode === 'grid' ? 'bg-forest-50 text-forest-700' : 'text-forest-400 hover:bg-sage-50')}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn('p-2 transition-colors', viewMode === 'list' ? 'bg-forest-50 text-forest-700' : 'text-forest-400 hover:bg-sage-50')}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-all',
              activeCategory === cat
                ? 'bg-forest-600 text-white border-forest-600 shadow-eco'
                : 'bg-white text-forest-700 border-sage-200 hover:border-sage-300 hover:bg-sage-50'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-sage-100 shadow-card p-5 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-forest-800">Filters</h3>
            <button
              onClick={() => { setActiveCondition('Any'); setPriceRange([0, 50000]); }}
              className="text-xs text-forest-500 hover:text-forest-700 underline"
            >
              Clear all
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-medium text-forest-700 mb-2 block">Condition</label>
              <div className="flex flex-wrap gap-2">
                {conditions.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCondition(c)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                      activeCondition === c
                        ? 'bg-forest-600 text-white border-forest-600'
                        : 'bg-white text-forest-600 border-sage-200 hover:border-sage-300'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-forest-700 mb-2 block">Price Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceRange[0] || ''}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  placeholder="Min"
                  className="w-24 px-3 py-1.5 rounded-lg border border-sage-200 text-xs text-forest-800 outline-none focus:border-forest-400"
                />
                <span className="text-forest-400">-</span>
                <input
                  type="number"
                  value={priceRange[1] < 50000 ? priceRange[1] : ''}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 50000])}
                  placeholder="Max"
                  className="w-24 px-3 py-1.5 rounded-lg border border-sage-200 text-xs text-forest-800 outline-none focus:border-forest-400"
                />
                <span className="text-xs text-forest-500">INR</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-forest-500">
          {loading ? 'Searching...' : `${products.length} items found`}
        </p>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-sage-100 overflow-hidden">
              <div className="aspect-square bg-sage-100 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-sage-100 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-sage-100 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-forest-300" />
          </div>
          <p className="text-lg font-semibold text-forest-800 mb-1">No items found</p>
          <p className="text-sm text-forest-500 mb-4">Try adjusting your filters or search terms</p>
          <Button onClick={() => { setSearch(''); setActiveCategory('All'); setActiveCondition('Any'); setPriceRange([0, 50000]); }} className="bg-forest-600 hover:bg-forest-700 text-white rounded-xl">
            Clear Filters
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductGridCard key={p.id} product={p} liked={likedItems.has(p.id)} onLike={() => toggleLike(p.id)} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <ProductListCard key={p.id} product={p} liked={likedItems.has(p.id)} onLike={() => toggleLike(p.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductGridCard({ product, liked, onLike }: { product: Product; liked: boolean; onLike: () => void }) {
  const discount = product.price_inr ? Math.round(((5000 - product.price_inr) / 5000) * 100) : null;

  return (
    <div className="group bg-white rounded-2xl border border-sage-100 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square bg-sage-50 overflow-hidden">
        {product.images[0] ? (
          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-forest-200" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className={cn(
            'text-[10px] font-bold px-2 py-0.5 rounded-full',
            product.eco_tag === 'Upcycled' ? 'bg-forest-600 text-white' :
            product.eco_tag === 'New-Eco' ? 'bg-sage-600 text-white' :
            'bg-white/90 text-forest-700 border border-sage-200'
          )}>
            {product.eco_tag}
          </span>
          {product.is_swap_available && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sand-500 text-white flex items-center gap-0.5 w-fit">
              <Repeat2 className="w-2.5 h-2.5" /> Swap
            </span>
          )}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); onLike(); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-all hover:scale-110"
        >
          <Heart className={cn('w-3.5 h-3.5', liked ? 'fill-red-500 text-red-500' : 'text-forest-400')} />
        </button>
      </div>
      <div className="p-3">
        <p className="text-xs font-semibold text-forest-900 line-clamp-2 leading-tight mb-1.5">{product.title}</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-forest-800 inr">
            {product.price_inr ? `₹${product.price_inr.toLocaleString('en-IN')}` : 'Swap Only'}
          </span>
          <span className="flex items-center gap-0.5 text-[11px] text-forest-500 font-medium">
            <Leaf className="w-3 h-3 text-forest-500" />
            {product.eco_score}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-forest-500">
          <MapPin className="w-3 h-3" />
          {product.city || 'India'}
        </div>
      </div>
    </div>
  );
}

function ProductListCard({ product, liked, onLike }: { product: Product; liked: boolean; onLike: () => void }) {
  return (
    <div className="flex gap-4 bg-white rounded-2xl border border-sage-100 p-3 shadow-card hover:shadow-card-hover transition-all">
      <div className="w-28 h-28 rounded-xl bg-sage-50 overflow-hidden shrink-0">
        {product.images[0] ? (
          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-forest-200" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-forest-900 line-clamp-1">{product.title}</p>
            <p className="text-xs text-forest-500 line-clamp-1 mt-0.5">{product.description}</p>
          </div>
          <button onClick={onLike} className="shrink-0">
            <Heart className={cn('w-4 h-4', liked ? 'fill-red-500 text-red-500' : 'text-forest-400')} />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-bold text-forest-800 inr">
            {product.price_inr ? `₹${product.price_inr.toLocaleString('en-IN')}` : 'Swap Only'}
          </span>
          {product.is_swap_available && (
            <Badge className="text-[9px] px-1.5 py-0 bg-sand-100 text-sand-700 border border-sand-200 rounded-full font-semibold">
              <Repeat2 className="w-2.5 h-2.5 mr-0.5" /> Swap
            </Badge>
          )}
          <span className="flex items-center gap-0.5 text-[11px] text-forest-500 font-medium ml-auto">
            <Leaf className="w-3 h-3" /> {product.eco_score} Karma
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-forest-500">
          <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {product.city || 'India'}</span>
          <span>{product.eco_tag}</span>
        </div>
      </div>
    </div>
  );
}
