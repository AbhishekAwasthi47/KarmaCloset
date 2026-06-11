'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, MapPin, Loader as Loader2, Check, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

export default function ProfileEditPage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setCity(profile.city || '');
      setPincode(profile.pincode || '');
      setAvatarUrl(profile.avatar || '');
    }
  }, [profile]);

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError('');

    try {
      let finalAvatarUrl = avatarUrl;

      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop();
        const path = `${user.id}/avatar-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(path, avatarFile);
        if (!uploadError) {
          const { data } = supabase.storage.from('product-images').getPublicUrl(path);
          finalAvatarUrl = data.publicUrl;
        }
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ name, city, pincode, avatar: finalAvatarUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await refreshProfile();
      setSuccess(true);
      setTimeout(() => router.push('/profile'), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user || !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-forest-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-forest-600" />
          </div>
          <h2 className="text-xl font-bold text-forest-900 mb-1">Profile Updated!</h2>
          <p className="text-sm text-forest-600">Redirecting to your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Profile
      </button>

      <h1 className="text-2xl font-bold text-forest-900 mb-6">Edit Profile</h1>

      <div className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-sage-100 overflow-hidden border-2 border-sage-200">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-forest-100">
                  <User className="w-8 h-8 text-forest-400" />
                </div>
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-forest-600 text-white flex items-center justify-center shadow-eco hover:bg-forest-700 transition-colors cursor-pointer">
              <Camera className="w-3 h-3" />
              <input type="file" accept="image/*" onChange={handleAvatarSelect} className="hidden" />
            </label>
          </div>
          <div>
            <p className="text-sm font-semibold text-forest-800">Profile Photo</p>
            <p className="text-xs text-forest-500">JPG, PNG. Max 2MB.</p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-forest-700 mb-1.5">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-3 py-2.5 rounded-xl border border-sage-200 text-sm text-forest-800 placeholder:text-forest-400 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-medium text-forest-700 mb-1.5">City</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Mumbai"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-sage-200 text-sm text-forest-800 placeholder:text-forest-400 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all"
            />
          </div>
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-xs font-medium text-forest-700 mb-1.5">Pincode</label>
          <input
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="6-digit pincode"
            className="w-full px-3 py-2.5 rounded-xl border border-sage-200 text-sm text-forest-800 placeholder:text-forest-400 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleSave}
            disabled={saving || !name}
            className="flex-1 bg-forest-600 hover:bg-forest-700 text-white py-3 h-auto rounded-xl font-semibold shadow-eco"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
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
