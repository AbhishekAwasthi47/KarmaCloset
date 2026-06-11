'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf, Shield, BadgeCheck, Star, Package, Repeat2, Heart, Settings, LogOut, MapPin, CreditCard as Edit3, Camera, TrendingUp, Award, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface UserProduct {
  id: string;
  title: string;
  price_inr: number | null;
  status: string;
  images: string[];
  eco_tag: string;
  is_swap_available: boolean;
}

export default function ProfilePage() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'listings' | 'swaps' | 'saved'>('listings');
  const [myProducts, setMyProducts] = useState<UserProduct[]>([]);
  const [swapCount, setSwapCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('products')
      .select('id, title, price_inr, status, images, eco_tag, is_swap_available')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setMyProducts((data as UserProduct[]) || []));

    supabase
      .from('swap_offers')
      .select('id', { count: 'exact', head: true })
      .or(`initiator_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .then(({ count }) => setSwapCount(count || 0));
  }, [user]);

  if (loading || !user || !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-forest-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const karmaLevel =
    profile.green_karma >= 200 ? 'Eco Champion' :
    profile.green_karma >= 100 ? 'Green Warrior' :
    profile.green_karma >= 50 ? 'Eco Explorer' :
    'Eco Starter';

  const karmaProgress = Math.min((profile.green_karma / 200) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-sage-100 shadow-card overflow-hidden mb-6">
        {/* Cover gradient */}
        <div className="h-28 bg-gradient-to-r from-forest-600 via-forest-500 to-sage-400 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
        </div>

        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-sage-100 border-4 border-white shadow-card overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-forest-100">
                    <span className="text-2xl font-bold text-forest-600">
                      {(profile.name || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-forest-600 text-white flex items-center justify-center shadow-eco hover:bg-forest-700 transition-colors">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Name & Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-forest-900">{profile.name || 'KarmaCloset User'}</h1>
                {profile.is_aadhaar_verified && (
                  <Badge className="karma-badge text-[10px]">
                    <BadgeCheck className="w-3 h-3 mr-0.5" /> Aadhaar Verified
                  </Badge>
                )}
                {profile.is_trusted_swapper && (
                  <Badge className="bg-sand-100 text-sand-700 border border-sand-200 text-[10px] px-2 py-0.5 rounded-full font-medium">
                    <Shield className="w-3 h-3 mr-0.5" /> Trusted Swapper
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-forest-500">
                {profile.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {profile.city}
                  </span>
                )}
                {profile.pincode && <span>{profile.pincode}</span>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link href="/profile/edit">
                <Button variant="outline" size="sm" className="border-sage-200 text-forest-700 rounded-lg">
                  <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="border-sage-200 text-forest-500 hover:text-red-600 hover:border-red-200 rounded-lg"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Green Karma Card */}
      <div className="bg-white rounded-2xl border border-sage-100 shadow-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-forest-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-forest-800">Karma Score</p>
              <p className="text-xs text-forest-500">{karmaLevel}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold text-forest-700">{profile.green_karma}</p>
            <p className="text-xs text-forest-500">kg CO₂ saved</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 rounded-full bg-sage-100 overflow-hidden mb-3">
          <div
            className="h-full rounded-full bg-gradient-to-r from-forest-500 to-sage-400 transition-all duration-1000"
            style={{ width: `${karmaProgress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-forest-400 font-medium">
          <span>Eco Starter</span>
          <span>Eco Explorer</span>
          <span>Green Warrior</span>
          <span>Eco Champion</span>
        </div>

        {/* Karma breakdown */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-sage-50 rounded-xl p-3 text-center">
            <Package className="w-4 h-4 text-forest-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-forest-800">{myProducts.length}</p>
            <p className="text-[10px] text-forest-500">Items Listed</p>
          </div>
          <div className="bg-sand-50 rounded-xl p-3 text-center">
            <Repeat2 className="w-4 h-4 text-sand-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-forest-800">{swapCount}</p>
            <p className="text-[10px] text-forest-500">Swaps</p>
          </div>
          <div className="bg-forest-50 rounded-xl p-3 text-center">
            <TrendingUp className="w-4 h-4 text-forest-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-forest-800">{profile.green_karma}</p>
            <p className="text-[10px] text-forest-500">Karma Points</p>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white rounded-2xl border border-sage-100 shadow-card p-6 mb-6">
        <h2 className="text-sm font-semibold text-forest-800 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-forest-500" /> Trust & Verification
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: BadgeCheck, label: 'Aadhaar Verified', active: profile.is_aadhaar_verified, color: 'text-forest-600 bg-forest-50' },
            { icon: Shield, label: 'Trusted Swapper', active: profile.is_trusted_swapper, color: 'text-sand-600 bg-sand-50' },
            { icon: Star, label: '5-Star Rating', active: false, color: 'text-amber-600 bg-amber-50' },
            { icon: Truck, label: 'Verified Shipper', active: false, color: 'text-forest-600 bg-sage-50' },
          ].map(({ icon: Icon, label, active, color }) => (
            <div
              key={label}
              className={cn(
                'rounded-xl p-3 text-center border transition-all',
                active ? `${color} border-current/20` : 'bg-sage-50 border-sage-100 opacity-50'
              )}
            >
              <Icon className={cn('w-5 h-5 mx-auto mb-1.5', active ? '' : 'text-forest-300')} />
              <p className={cn('text-[11px] font-semibold', active ? '' : 'text-forest-400')}>{label}</p>
              {!active && (
                <p className="text-[9px] text-forest-400 mt-0.5">Coming soon</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-sage-100 shadow-card overflow-hidden">
        <div className="flex border-b border-sage-100">
          {(['listings', 'swaps', 'saved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-3 text-sm font-medium transition-colors capitalize',
                activeTab === tab
                  ? 'text-forest-700 border-b-2 border-forest-600 bg-forest-50/50'
                  : 'text-forest-400 hover:text-forest-600'
              )}
            >
              {tab === 'listings' && <Package className="w-4 h-4 inline mr-1.5" />}
              {tab === 'swaps' && <Repeat2 className="w-4 h-4 inline mr-1.5" />}
              {tab === 'saved' && <Heart className="w-4 h-4 inline mr-1.5" />}
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'listings' && (
            myProducts.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No listings yet"
                description="Start selling or swapping your pre-owned items!"
                actionLabel="List an Item"
                actionHref="/sell"
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {myProducts.map((p) => (
                  <ProductMiniCard key={p.id} product={p} />
                ))}
              </div>
            )
          )}

          {activeTab === 'swaps' && (
            <EmptyState
              icon={Repeat2}
              title="No swap activity yet"
              description="When you propose or receive swap offers, they'll appear here."
              actionLabel="Browse Items"
              actionHref="/marketplace"
            />
          )}

          {activeTab === 'saved' && (
            <EmptyState
              icon={Heart}
              title="No saved items"
              description="Items you like will be saved here for quick access."
              actionLabel="Explore"
              actionHref="/marketplace"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ProductMiniCard({ product }: { product: UserProduct }) {
  const statusColors: Record<string, string> = {
    available: 'bg-forest-100 text-forest-700',
    pending: 'bg-sand-100 text-sand-700',
    sold: 'bg-sage-100 text-forest-500',
  };

  return (
    <div className="rounded-xl border border-sage-100 overflow-hidden hover:shadow-card-hover transition-all group cursor-pointer">
      <div className="relative aspect-square bg-sage-50">
        {product.images[0] ? (
          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-forest-300" />
          </div>
        )}
        <span className={cn('absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full', statusColors[product.status] || statusColors.available)}>
          {product.status}
        </span>
      </div>
      <div className="p-2.5">
        <p className="text-xs font-semibold text-forest-800 line-clamp-1">{product.title}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-bold text-forest-700 inr">
            {product.price_inr ? `₹${product.price_inr.toLocaleString('en-IN')}` : 'Swap Only'}
          </span>
          {product.is_swap_available && (
            <span className="text-[9px] font-semibold text-sand-600 bg-sand-50 px-1.5 py-0.5 rounded-full">Swap</span>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="text-center py-10">
      <div className="w-14 h-14 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-forest-300" />
      </div>
      <p className="text-sm font-semibold text-forest-800 mb-1">{title}</p>
      <p className="text-xs text-forest-500 mb-4 max-w-xs mx-auto">{description}</p>
      <Link href={actionHref}>
        <Button size="sm" className="bg-forest-600 hover:bg-forest-700 text-white rounded-lg">
          {actionLabel}
        </Button>
      </Link>
    </div>
  );
}
