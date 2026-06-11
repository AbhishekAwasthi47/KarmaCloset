'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, Leaf, Trash2, Plus, Minus, ArrowRight,
  Shield, Truck, IndianRupee, Repeat2, Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  ecoScore: number;
  city: string;
  quantity: number;
}

const mockCartItems: CartItem[] = [
  {
    id: '1',
    title: 'Pure Silk Banarasi Saree — Royal Blue',
    price: 3200,
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
    ecoScore: 4.8,
    city: 'Varanasi',
    quantity: 1,
  },
  {
    id: '2',
    title: 'Hand Block Print Cotton Kurta — Set of 3',
    price: 780,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
    ecoScore: 4.7,
    city: 'Jaipur',
    quantity: 1,
  },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(mockCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 79 : 0;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryFee - discount;
  const co2Saved = items.reduce((sum, item) => sum + item.ecoScore * 0.5 * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-forest-300" />
        </div>
        <h2 className="text-xl font-bold text-forest-900 mb-2">Your cart is empty</h2>
        <p className="text-sm text-forest-600 mb-6">Browse the closet and add items you love.</p>
        <Link href="/marketplace">
          <Button className="bg-forest-600 hover:bg-forest-700 text-white rounded-xl">
            Browse the Closet
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-forest-900">Your Cart</h1>
        <p className="text-forest-600 mt-1 text-sm">{items.length} item{items.length !== 1 ? 's' : ''} from closets across India</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 bg-white rounded-2xl border border-sage-100 p-4 shadow-card hover:shadow-card-hover transition-all">
              <div className="w-24 h-24 rounded-xl bg-sage-50 overflow-hidden shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-forest-900 line-clamp-2">{item.title}</p>
                    <p className="text-xs text-forest-500 mt-0.5 flex items-center gap-1">
                      <Leaf className="w-3 h-3" /> {item.ecoScore} Karma · {item.city}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-forest-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-lg border border-sage-200 flex items-center justify-center hover:bg-sage-50 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-semibold text-forest-800 w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-lg border border-sage-200 flex items-center justify-center hover:bg-sage-50 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-base font-bold text-forest-800 inr">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Karma earned */}
          <div className="bg-forest-50 border border-forest-200 rounded-2xl p-4 text-center">
            <Leaf className="w-6 h-6 text-forest-600 mx-auto mb-1" />
            <p className="text-sm font-bold text-forest-800">{co2Saved.toFixed(1)} kg CO2</p>
            <p className="text-[11px] text-forest-600">Karma you'll earn from this order</p>
          </div>

          {/* Price breakdown */}
          <div className="bg-white rounded-2xl border border-sage-100 shadow-card p-5">
            <h2 className="text-sm font-semibold text-forest-800 mb-4">Order Summary</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-forest-600">Subtotal</span>
                <span className="font-semibold text-forest-800 inr">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-forest-600">Delivery</span>
                <span className="font-semibold text-forest-800 inr">₹{deliveryFee}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-forest-600">
                  <span>Karma Discount (10%)</span>
                  <span className="font-semibold text-forest-700">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="border-t border-sage-100 pt-2.5 flex justify-between">
                <span className="font-semibold text-forest-800">Total</span>
                <span className="text-lg font-extrabold text-forest-800 inr">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Promo */}
            {!promoApplied ? (
              <div className="flex gap-2 mt-4">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code"
                  className="flex-1 px-3 py-2 rounded-lg border border-sage-200 text-xs text-forest-800 placeholder:text-forest-400 outline-none focus:border-forest-400"
                />
                <Button
                  onClick={() => { if (promoCode.trim()) setPromoApplied(true); }}
                  size="sm"
                  variant="outline"
                  className="border-sage-200 text-forest-700 rounded-lg text-xs"
                >
                  Apply
                </Button>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-1.5 text-xs text-forest-600 font-medium bg-forest-50 px-3 py-2 rounded-lg border border-forest-200">
                <Leaf className="w-3 h-3" /> Karma discount applied!
              </div>
            )}

            <Button className="w-full bg-forest-600 hover:bg-forest-700 text-white py-3 h-auto rounded-xl font-semibold shadow-eco mt-4">
              <IndianRupee className="w-4 h-4 mr-1.5" /> Checkout — ₹{total.toLocaleString('en-IN')}
            </Button>
          </div>

          {/* Trust */}
          <div className="space-y-2">
            {[
              { icon: Shield, text: 'Buyer Protection — 100% refund if item differs' },
              { icon: Truck, text: 'Delhivery-powered tracked delivery' },
              { icon: IndianRupee, text: 'Escrow payments via Razorpay' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs text-forest-500">
                <Icon className="w-3.5 h-3.5 text-forest-400 shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
