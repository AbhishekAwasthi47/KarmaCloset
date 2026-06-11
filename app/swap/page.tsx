'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Repeat2, IndianRupee, MessageCircle, Check, X, Clock, ArrowRight, Leaf, ShoppingBag, ChevronRight, Loader as Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface SwapOffer {
  id: string;
  status: string;
  offered_item_id: string;
  requested_item_id: string;
  cash_difference_inr: number;
  initiator_id: string;
  receiver_id: string;
  created_at: string;
  updated_at: string;
  offered_item?: { title: string; images: string[]; price_inr: number | null };
  requested_item?: { title: string; images: string[]; price_inr: number | null };
}

type Tab = 'active' | 'received' | 'completed';

export default function SwapPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('active');
  const [offers, setOffers] = useState<SwapOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const fetchOffers = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('swap_offers')
        .select(`
          *,
          offered_item:products!swap_offers_offered_item_id_fkey(title, images, price_inr),
          requested_item:products!swap_offers_requested_item_id_fkey(title, images, price_inr)
        `)
        .or(`initiator_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      setOffers((data as SwapOffer[]) || []);
      setLoading(false);
    };

    fetchOffers();
  }, [user]);

  const activeOffers = offers.filter((o) => o.status === 'pending');
  const receivedOffers = offers.filter((o) => o.status === 'pending' && o.receiver_id === user?.id);
  const completedOffers = offers.filter((o) => ['accepted', 'completed', 'rejected'].includes(o.status));

  const displayOffers = activeTab === 'active'
    ? activeOffers
    : activeTab === 'received'
    ? receivedOffers
    : completedOffers;

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-forest-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4">
          <Repeat2 className="w-8 h-8 text-forest-300" />
        </div>
        <h2 className="text-xl font-bold text-forest-900 mb-2">Login to Start Swapping</h2>
        <p className="text-sm text-forest-600 mb-6">Sign in to propose and manage Bhav-Tav swaps.</p>
        <Link href="/login">
          <Button className="bg-forest-600 hover:bg-forest-700 text-white rounded-xl">Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center">
            <Repeat2 className="w-5 h-5 text-sand-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-forest-900">Bhav-Tav</h1>
            <p className="text-sm text-forest-600">Propose a trade, negotiate, and earn karma with every swap.</p>
          </div>
        </div>
      </div>

      {/* How Bhav-Tav Works */}
      <div className="bg-white rounded-2xl border border-sage-100 shadow-card p-5 mb-6">
        <h2 className="text-sm font-semibold text-forest-800 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sand-500" /> How Bhav-Tav Works
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Repeat2, title: 'Propose a Swap', desc: 'See an item you like? Offer one of yours in exchange.' },
            { icon: IndianRupee, title: 'Add Cash Difference', desc: 'If values differ, add cash to balance the deal.' },
            { icon: MessageCircle, title: 'Chat & Close', desc: 'Negotiate via built-in chat. Accept, counter, or decline.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-forest-50 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-forest-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-forest-800">{title}</p>
                <p className="text-[11px] text-forest-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sage-100 mb-6">
        {([
          { key: 'active' as Tab, label: 'Active', count: activeOffers.length },
          { key: 'received' as Tab, label: 'Received', count: receivedOffers.length },
          { key: 'completed' as Tab, label: 'Completed', count: completedOffers.length },
        ]).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              'flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1.5',
              activeTab === key
                ? 'text-forest-700 border-b-2 border-forest-600 bg-forest-50/50'
                : 'text-forest-400 hover:text-forest-600'
            )}
          >
            {label}
            {count > 0 && (
              <span className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                activeTab === key ? 'bg-forest-600 text-white' : 'bg-sage-100 text-forest-500'
              )}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Offers List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-sage-100 p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl bg-sage-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-sage-100 rounded w-3/4" />
                  <div className="h-3 bg-sage-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : displayOffers.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4">
            <Repeat2 className="w-8 h-8 text-forest-300" />
          </div>
          <p className="text-lg font-semibold text-forest-800 mb-1">
            {activeTab === 'active' ? 'No active swaps' : activeTab === 'received' ? 'No received offers' : 'No completed swaps yet'}
          </p>
          <p className="text-sm text-forest-500 mb-4">
            {activeTab === 'active'
              ? 'Browse the closet and propose your first swap!'
              : activeTab === 'received'
              ? 'When others propose swaps on your items, they\'ll appear here.'
              : 'Your completed swaps will show here with karma earned.'}
          </p>
          <Link href="/marketplace">
            <Button className="bg-forest-600 hover:bg-forest-700 text-white rounded-xl">
              Browse the Closet
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {displayOffers.map((offer) => (
            <SwapOfferCard key={offer.id} offer={offer} isReceiver={offer.receiver_id === user?.id} />
          ))}
        </div>
      )}
    </div>
  );
}

function SwapOfferCard({ offer, isReceiver }: { offer: SwapOffer; isReceiver: boolean }) {
  const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
    pending: { color: 'bg-sand-100 text-sand-700 border-sand-200', icon: Clock, label: 'Pending' },
    accepted: { color: 'bg-forest-100 text-forest-700 border-forest-200', icon: Check, label: 'Accepted' },
    rejected: { color: 'bg-red-100 text-red-700 border-red-200', icon: X, label: 'Declined' },
    completed: { color: 'bg-forest-100 text-forest-700 border-forest-200', icon: Check, label: 'Completed' },
  };

  const { color, icon: StatusIcon, label } = statusConfig[offer.status] || statusConfig.pending;
  const offeredItem = offer.offered_item;
  const requestedItem = offer.requested_item;

  return (
    <div className="bg-white rounded-2xl border border-sage-100 shadow-card p-4 hover:shadow-card-hover transition-all">
      <div className="flex items-center justify-between mb-3">
        <Badge className={cn('text-[10px] font-semibold border', color)}>
          <StatusIcon className="w-3 h-3 mr-0.5" />
          {label}
        </Badge>
        <span className="text-[11px] text-forest-400">
          {new Date(offer.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>
      </div>

      {/* Swap visualization */}
      <div className="flex items-center gap-3">
        {/* Offered item */}
        <div className="flex-1">
          <div className="w-full aspect-[4/3] rounded-xl bg-sage-50 overflow-hidden mb-2">
            {offeredItem?.images?.[0] ? (
              <img src={offeredItem.images[0]} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-forest-200" />
              </div>
            )}
          </div>
          <p className="text-xs font-semibold text-forest-800 line-clamp-1">{offeredItem?.title || 'Item'}</p>
          <p className="text-[11px] text-forest-500">
            {offeredItem?.price_inr ? `₹${offeredItem.price_inr.toLocaleString('en-IN')}` : 'Swap Only'}
          </p>
          <p className="text-[10px] text-forest-400 mt-0.5">{isReceiver ? 'Their item' : 'Your item'}</p>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <Repeat2 className="w-5 h-5 text-sand-500" />
          {offer.cash_difference_inr > 0 && (
            <span className="text-[10px] font-bold text-sand-600 bg-sand-50 px-1.5 py-0.5 rounded-full border border-sand-200">
              +₹{offer.cash_difference_inr.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Requested item */}
        <div className="flex-1">
          <div className="w-full aspect-[4/3] rounded-xl bg-sage-50 overflow-hidden mb-2">
            {requestedItem?.images?.[0] ? (
              <img src={requestedItem.images[0]} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-forest-200" />
              </div>
            )}
          </div>
          <p className="text-xs font-semibold text-forest-800 line-clamp-1">{requestedItem?.title || 'Item'}</p>
          <p className="text-[11px] text-forest-500">
            {requestedItem?.price_inr ? `₹${requestedItem.price_inr.toLocaleString('en-IN')}` : 'Swap Only'}
          </p>
          <p className="text-[10px] text-forest-400 mt-0.5">{isReceiver ? 'Your item' : 'Their item'}</p>
        </div>
      </div>

      {/* Actions */}
      {offer.status === 'pending' && isReceiver && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-sage-100">
          <Button size="sm" className="flex-1 bg-forest-600 hover:bg-forest-700 text-white rounded-lg text-xs font-semibold">
            <Check className="w-3.5 h-3.5 mr-1" /> Accept Swap
          </Button>
          <Button size="sm" variant="outline" className="flex-1 border-sage-200 text-forest-600 rounded-lg text-xs font-semibold">
            <MessageCircle className="w-3.5 h-3.5 mr-1" /> Counter
          </Button>
          <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold px-3">
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {offer.status === 'pending' && !isReceiver && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-sage-100">
          <Button size="sm" variant="outline" className="flex-1 border-sage-200 text-forest-600 rounded-lg text-xs font-semibold">
            <MessageCircle className="w-3.5 h-3.5 mr-1" /> Chat
          </Button>
          <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold px-3">
            Cancel
          </Button>
        </div>
      )}

      {offer.status === 'accepted' && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-sage-100">
          <Leaf className="w-3.5 h-3.5 text-forest-500" />
          <span className="text-[11px] text-forest-600 font-medium">Karma earned! This swap saved ~2.5 kg CO2.</span>
          <ChevronRight className="w-3.5 h-3.5 text-forest-400 ml-auto" />
        </div>
      )}
    </div>
  );
}
