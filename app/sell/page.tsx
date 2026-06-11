'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Sparkles, Leaf, Upload, X, Loader as Loader2, Check, Tag, MapPin, IndianRupee, Repeat2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const categoryOptions = [
  'Ethnic Wear', 'Western Wear', 'Sneakers', 'Jackets', 'Accessories',
  'Denim', 'Bags', 'Kids', 'Home Decor', 'Other'
];

const ecoTagOptions = ['Gently Used', 'New-Eco', 'Upcycled'];

export default function SellPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [ecoTag, setEcoTag] = useState('Gently Used');
  const [isSwapAvailable, setIsSwapAvailable] = useState(true);
  const [city, setCity] = useState(profile?.city || '');
  const [pincode, setPincode] = useState(profile?.pincode || '');
  const [ecoScore, setEcoScore] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setImages((prev) => [...prev, url]);
      };
      reader.readAsDataURL(file);
      setImageFiles((prev) => [...prev, file]);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAiMagic = async () => {
    if (images.length === 0) {
      setError('Upload at least one photo first');
      return;
    }
    setAiLoading(true);
    setError('');

    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-magic-listing', {
        body: { image_count: images.length, category_hint: category },
      });

      if (fnError) throw new Error(fnError.message);
      if (data) {
        setTitle(data.title || '');
        setDescription(data.description || '');
        setCategory(data.category || category);
        setEcoTag(data.eco_tag || ecoTag);
        setEcoScore(data.eco_score || 4.0);
        setAiGenerated(true);
      }
    } catch {
      // Fallback: generate placeholder content
      setTitle('Pre-owned Fashion Item');
      setDescription('Quality pre-owned item in great condition. Perfect for sustainable fashion lovers. Clean out your closet and give this piece a second life.');
      setEcoScore(4.0);
      setAiGenerated(true);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) { router.push('/login'); return; }
    if (!title || !category) { setError('Title and category are required'); return; }

    setSubmitting(true);
    setError('');

    try {
      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        const ext = file.name.split('.').pop();
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(path, file);
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
          imageUrls.push(urlData.publicUrl);
        }
      }

      const { error: insertError } = await supabase.from('products').insert({
        title,
        description,
        price_inr: price ? parseInt(price) : null,
        is_swap_available: isSwapAvailable,
        eco_tag: ecoTag,
        category,
        images: imageUrls.length > 0 ? imageUrls : images,
        eco_score: ecoScore,
        owner_id: user.id,
        city,
        pincode,
      });

      if (insertError) throw insertError;
      setSuccess(true);
      setTimeout(() => router.push('/profile'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to list item');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-forest-600" />
          </div>
          <h2 className="text-xl font-bold text-forest-900 mb-1">Item Listed!</h2>
          <p className="text-sm text-forest-600">Your closet item is now live. Earn karma with every exchange.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-forest-900">Sell from Your Closet</h1>
        <p className="text-forest-600 mt-1 text-sm">Clean out your closet, list items with AI Magic, and earn karma.</p>
      </div>

      <div className="space-y-6">
        {/* Photo Upload */}
        <div className="bg-white rounded-2xl border border-sage-100 shadow-card p-5">
          <h2 className="text-sm font-semibold text-forest-800 mb-3 flex items-center gap-2">
            <Camera className="w-4 h-4 text-forest-500" /> Photos
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-sage-200">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-forest-600 text-white">Cover</span>
                )}
              </div>
            ))}
            {images.length < 8 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-sage-200 hover:border-forest-400 bg-sage-50/50 hover:bg-forest-50/50 flex flex-col items-center justify-center gap-1 transition-colors"
              >
                <Upload className="w-5 h-5 text-forest-400" />
                <span className="text-[10px] font-medium text-forest-500">Add Photo</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
          <p className="text-[11px] text-forest-400 mt-2">Up to 8 photos. First photo is the cover image.</p>
        </div>

        {/* AI Magic Listing */}
        <div className="bg-white rounded-2xl border border-sage-100 shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-forest-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sand-500" /> AI Magic Listing
            </h2>
            <Button
              onClick={handleAiMagic}
              disabled={aiLoading || images.length === 0}
              size="sm"
              className="bg-sand-500 hover:bg-sand-600 text-white rounded-lg font-semibold"
            >
              {aiLoading ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> Generating...</>
              ) : (
                <><Sparkles className="w-3.5 h-3.5 mr-1" /> Auto-Fill with AI</>
              )}
            </Button>
          </div>

          {aiGenerated && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-forest-50 border border-forest-200">
              <Check className="w-3.5 h-3.5 text-forest-600" />
              <span className="text-xs text-forest-700 font-medium">AI-generated listing. Edit as needed.</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-forest-700 mb-1.5">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Vintage Levi's 501 — W30 L32"
                className="w-full px-3 py-2.5 rounded-xl border border-sage-200 text-sm text-forest-800 placeholder:text-forest-400 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-forest-700 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item — condition, size, brand, story..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-sage-200 text-sm text-forest-800 placeholder:text-forest-400 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-forest-700 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-sage-200 text-sm text-forest-800 outline-none focus:border-forest-400 bg-white"
                >
                  <option value="">Select category</option>
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-forest-700 mb-1.5">Condition</label>
                <div className="flex gap-2">
                  {ecoTagOptions.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setEcoTag(tag)}
                      className={cn(
                        'flex-1 px-2 py-2 rounded-lg text-[11px] font-semibold border transition-all',
                        ecoTag === tag
                          ? 'bg-forest-600 text-white border-forest-600'
                          : 'bg-white text-forest-600 border-sage-200 hover:border-sage-300'
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Swap */}
        <div className="bg-white rounded-2xl border border-sage-100 shadow-card p-5">
          <h2 className="text-sm font-semibold text-forest-800 mb-3 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-forest-500" /> Pricing & Swap
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-forest-700 mb-1.5">Price (INR)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-forest-500">₹</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price or leave empty for swap-only"
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-sage-200 text-sm text-forest-800 placeholder:text-forest-400 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all"
                />
              </div>
              <p className="text-[11px] text-forest-400 mt-1">Leave empty if you only want to swap</p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-sand-50 border border-sand-200">
              <div className="flex items-center gap-2">
                <Repeat2 className="w-4 h-4 text-sand-600" />
                <div>
                  <p className="text-sm font-medium text-forest-800">Open to Swaps</p>
                  <p className="text-[11px] text-forest-500">Let others propose item exchanges</p>
                </div>
              </div>
              <button
                onClick={() => setIsSwapAvailable(!isSwapAvailable)}
                className={cn(
                  'w-11 h-6 rounded-full transition-colors relative',
                  isSwapAvailable ? 'bg-forest-600' : 'bg-sage-300'
                )}
              >
                <span className={cn(
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                  isSwapAvailable ? 'left-[22px]' : 'left-0.5'
                )} />
              </button>
            </div>

            {ecoScore > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-forest-50 border border-forest-200">
                <Leaf className="w-4 h-4 text-forest-600" />
                <div>
                  <p className="text-xs font-semibold text-forest-700">Karma Score: {ecoScore.toFixed(1)}</p>
                  <p className="text-[10px] text-forest-500">Higher score = more visibility in the closet</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl border border-sage-100 shadow-card p-5">
          <h2 className="text-sm font-semibold text-forest-800 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-forest-500" /> Location
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-forest-700 mb-1.5">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai"
                className="w-full px-3 py-2.5 rounded-xl border border-sage-200 text-sm text-forest-800 placeholder:text-forest-400 outline-none focus:border-forest-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-forest-700 mb-1.5">Pincode</label>
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit pincode"
                className="w-full px-3 py-2.5 rounded-xl border border-sage-200 text-sm text-forest-800 placeholder:text-forest-400 outline-none focus:border-forest-400 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {/* Submit */}
        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={submitting || !title || !category}
            className="flex-1 bg-forest-600 hover:bg-forest-700 text-white py-3 h-auto rounded-xl font-semibold shadow-eco"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Listing...</>
            ) : (
              <><Tag className="w-4 h-4 mr-2" /> List Item</>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-sage-200 text-forest-700 rounded-xl px-6"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
