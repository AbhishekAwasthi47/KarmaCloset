'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Leaf, Heart, Repeat2, ShoppingBag, MapPin, Share2,
  Shield, BadgeCheck, Star, MessageCircle, ChevronLeft, ChevronRight,
  IndianRupee, Truck, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface ProductDetail {
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
  city: string;
  pincode: string;
  created_at: string;
  owner?: { name: string; avatar: string | null; city: string; green_karma: number; is_aadhaar_verified: boolean; is_trusted_swapper: boolean };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [myItems, setMyItems] = useState<{ id: string; title: string; images: string[]; price_inr: number | null }[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from('products')
        .select(`
          *,
          owner:profiles!products_owner_id_fkey(name, avatar, city, green_karma, is_aadhaar_verified, is_trusted_swapper)
        `)
        .eq('id', id)
        .maybeSingle();
      setProduct(data as ProductDetail || null);
      setLoading(false);
    };
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!user || !product) return;
    supabase
      .from('products')
      .select('id, title, images, price_inr')
      .eq('owner_id', user.id)
      .eq('status', 'available')
      .then(({ data }) => setMyItems((data as typeof myItems) || []));
  }, [user, product]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-forest-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <p className="text-lg font-semibold text-forest-800 mb-2">Item not found</p>
        <p className="text-sm text-forest-500 mb-4">This item may have been removed or is no longer available.</p>
        <Link href="/marketplace">
          <Button className="bg-forest-600 hover:bg-forest-700 text-white rounded-xl">Back to the Closet</Button>
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === product.owner_id;
  const ecoColor = product.eco_score >= 4.5 ? 'text-forest-600' : product.eco_score >= 3.5 ? 'text-sage-600' : 'text-sand-600';

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-800 mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-sage-50 mb-3">
            {product.images[activeImage] ? (
              <img src={product.images[activeImage]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-forest-200" />
              </div>
            )}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((activeImage - 1 + product.images.length) % product.images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveImage((activeImage + 1) % product.images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
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
              onClick={() => setLiked(!liked)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow transition-all hover:scale-110"
            >
              <Heart className={cn('w-4 h-4', liked ? 'fill-red-500 text-red-500' : 'text-forest-400')} />
            </button>
          </div>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all',
                    activeImage === i ? 'border-forest-600' : 'border-sage-200 hover:border-sage-300'
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="mb-4">
            <p className="text-xs text-forest-500 font-medium mb-1">{product.category}</p>
            <h1 className="text-2xl font-bold text-forest-900 leading-tight mb-2">{product.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              {product.price_inr && (
                <span className="text-2xl font-extrabold text-forest-800 inr">₹{product.price_inr.toLocaleString('en-IN')}</span>
              )}
              {product.is_swap_available && !product.price_inr && (
                <span className="text-lg font-bold text-sand-600">Swap Only</span>
              )}
              <span className={cn('flex items-center gap-1 text-sm font-semibold', ecoColor)}>
                <Leaf className="w-4 h-4" /> {product.eco_score} Karma
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-forest-800 mb-2">Description</h2>
            <p className="text-sm text-forest-600 leading-relaxed">{product.description || 'No description provided.'}</p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-sage-50 rounded-xl p-3">
              <p className="text-[10px] text-forest-400 font-medium uppercase">Condition</p>
              <p className="text-sm font-semibold text-forest-800">{product.eco_tag}</p>
            </div>
            <div className="bg-sage-50 rounded-xl p-3">
              <p className="text-[10px] text-forest-400 font-medium uppercase">Location</p>
              <p className="text-sm font-semibold text-forest-800 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {product.city || 'India'}
              </p>
            </div>
            <div className="bg-sage-50 rounded-xl p-3">
              <p className="text-[10px] text-forest-400 font-medium uppercase">Listed</p>
              <p className="text-sm font-semibold text-forest-800 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {new Date(product.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="bg-sage-50 rounded-xl p-3">
              <p className="text-[10px] text-forest-400 font-medium uppercase">Delivery</p>
              <p className="text-sm font-semibold text-forest-800 flex items-center gap-1">
                <Truck className="w-3 h-3" /> Pan-India
              </p>
            </div>
          </div>

          {/* Seller Card */}
          {product.owner && (
            <div className="bg-white rounded-xl border border-sage-100 p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sage-100 overflow-hidden">
                  {product.owner.avatar ? (
                    <img src={product.owner.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-forest-100">
                      <span className="text-sm font-bold text-forest-600">{product.owner.name[0].toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-forest-800">{product.owner.name}</p>
                    {product.owner.is_aadhaar_verified && (
                      <BadgeCheck className="w-3.5 h-3.5 text-forest-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-forest-500 flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> {product.owner.green_karma} Karma
                    {product.owner.city && <><span className="mx-1">·</span><MapPin className="w-3 h-3" /> {product.owner.city}</>}
                  </p>
                </div>
                <Link href={`/chat?to=${product.owner_id}`}>
                  <Button variant="outline" size="sm" className="border-sage-200 text-forest-700 rounded-lg text-xs">
                    <MessageCircle className="w-3.5 h-3.5 mr-1" /> Chat
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Actions */}
          {!isOwner && (
            <div className="flex gap-3">
              {product.price_inr && (
                <Button className="flex-1 bg-forest-600 hover:bg-forest-700 text-white py-3 h-auto rounded-xl font-semibold shadow-eco">
                  <ShoppingBag className="w-4 h-4 mr-2" /> Buy Now — ₹{product.price_inr.toLocaleString('en-IN')}
                </Button>
              )}
              {product.is_swap_available && (
                <Button
                  onClick={() => setShowSwapModal(true)}
                  variant={product.price_inr ? 'outline' : 'default'}
                  className={cn(
                    'flex-1 py-3 h-auto rounded-xl font-semibold',
                    product.price_inr
                      ? 'border-sand-300 text-sand-700 hover:bg-sand-50'
                      : 'bg-sand-500 hover:bg-sand-600 text-white shadow-eco'
                  )}
                >
                  <Repeat2 className="w-4 h-4 mr-2" /> Propose Swap
                </Button>
              )}
              <Button variant="outline" className="border-sage-200 rounded-xl px-3">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          )}

          {isOwner && (
            <div className="bg-forest-50 border border-forest-200 rounded-xl p-4 text-center">
              <p className="text-sm font-medium text-forest-700">This is your listing</p>
              <p className="text-xs text-forest-500 mt-0.5">Edit or manage it from your profile</p>
            </div>
          )}

          {/* Trust badges */}
          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-sage-100">
            <div className="flex items-center gap-1.5 text-xs text-forest-500">
              <Shield className="w-4 h-4 text-forest-400" /> Buyer Protection
            </div>
            <div className="flex items-center gap-1.5 text-xs text-forest-500">
              <Truck className="w-4 h-4 text-forest-400" /> Delhivery Shipping
            </div>
            <div className="flex items-center gap-1.5 text-xs text-forest-500">
              <IndianRupee className="w-4 h-4 text-forest-400" /> Escrow Payments
            </div>
          </div>
        </div>
      </div>

      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={() => setShowSwapModal(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-lg font-bold text-forest-900 mb-1">Propose a Swap</h2>
              <p className="text-sm text-forest-600 mb-4">Choose one of your items to offer in exchange</p>

              <div className="mb-4 p-3 bg-sage-50 rounded-xl">
                <p className="text-[10px] text-forest-400 font-medium uppercase mb-1">They want</p>
                <p className="text-sm font-semibold text-forest-800">{product.title}</p>
                {product.price_inr && <p className="text-xs text-forest-500">₹{product.price_inr.toLocaleString('en-IN')}</p>}
              </div>

              {myItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-forest-600 mb-3">You have no items to swap. List one first!</p>
                  <Link href="/sell">
                    <Button className="bg-forest-600 hover:bg-forest-700 text-white rounded-xl">List an Item</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  <p className="text-[10px] text-forest-400 font-medium uppercase">Your items</p>
                  {myItems.map((item) => (
                    <button
                      key={item.id}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-sage-200 hover:border-forest-400 hover:bg-forest-50 transition-all text-left"
                    >
                      <div className="w-12 h-12 rounded-lg bg-sage-50 overflow-hidden shrink-0">
                        {item.images[0] ? (
                          <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingBag className="w-5 h-5 text-forest-200 m-auto" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-forest-800 truncate">{item.title}</p>
                        <p className="text-xs text-forest-500">{item.price_inr ? `₹${item.price_inr.toLocaleString('en-IN')}` : 'Swap Only'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowSwapModal(false)}
                  variant="outline"
                  className="flex-1 border-sage-200 text-forest-700 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-sand-500 hover:bg-sand-600 text-white rounded-xl font-semibold"
                  disabled={myItems.length === 0}
                >
                  <Repeat2 className="w-4 h-4 mr-1.5" /> Send Proposal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
