/*
  # EcoSwap Core Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, PK, references auth.users)
      - `phone` (text, unique, nullable — set after OTP verification)
      - `name` (text)
      - `avatar` (text, URL to profile picture)
      - `green_karma` (integer, default 0 — kg of CO2 saved)
      - `pincode` (text, 6-digit Indian pincode)
      - `city` (text)
      - `is_aadhaar_verified` (boolean, default false)
      - `is_trusted_swapper` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `products`
      - `id` (uuid, PK)
      - `title` (text)
      - `description` (text)
      - `price_inr` (integer, nullable — null if swap-only)
      - `is_swap_available` (boolean, default true)
      - `eco_tag` (text — Upcycled, Gently Used, New-Eco)
      - `category` (text)
      - `status` (text, default 'available' — available, pending, sold)
      - `images` (text array — URLs to product images)
      - `eco_score` (numeric, default 0)
      - `owner_id` (uuid, FK to profiles)
      - `pincode` (text)
      - `city` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `swap_offers`
      - `id` (uuid, PK)
      - `status` (text, default 'pending' — pending, accepted, rejected, completed)
      - `offered_item_id` (uuid, FK to products)
      - `requested_item_id` (uuid, FK to products)
      - `cash_difference_inr` (integer, default 0)
      - `initiator_id` (uuid, FK to profiles)
      - `receiver_id` (uuid, FK to profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `chat_messages`
      - `id` (uuid, PK)
      - `swap_offer_id` (uuid, FK to swap_offers)
      - `sender_id` (uuid, FK to profiles)
      - `text` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on ALL tables
    - Profiles: users can read all, update own only
    - Products: anyone can read, only owner can insert/update/delete
    - Swap offers: participants can read, initiator can insert, participants can update
    - Chat messages: participants can read, sender can insert

  3. Indexes
    - products(owner_id), products(status), products(category), products(city)
    - swap_offers(initiator_id), swap_offers(receiver_id), swap_offers(status)
    - chat_messages(swap_offer_id), chat_messages(created_at)
    - profiles(phone), profiles(city)
*/

-- =====================
-- PROFILES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text UNIQUE,
  name text NOT NULL DEFAULT '',
  avatar text DEFAULT '',
  green_karma integer NOT NULL DEFAULT 0,
  pincode text DEFAULT '',
  city text DEFAULT '',
  is_aadhaar_verified boolean NOT NULL DEFAULT false,
  is_trusted_swapper boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- PRODUCTS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  price_inr integer,
  is_swap_available boolean NOT NULL DEFAULT true,
  eco_tag text NOT NULL DEFAULT 'Gently Used',
  category text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'available',
  images text[] NOT NULL DEFAULT '{}',
  eco_score numeric NOT NULL DEFAULT 0,
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pincode text DEFAULT '',
  city text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owners can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own products"
  ON products FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- =====================
-- SWAP OFFERS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS swap_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'pending',
  offered_item_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  requested_item_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  cash_difference_inr integer NOT NULL DEFAULT 0,
  initiator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE swap_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Swap participants can view offers"
  ON swap_offers FOR SELECT
  TO authenticated
  USING (auth.uid() = initiator_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can initiate swap offers"
  ON swap_offers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = initiator_id);

CREATE POLICY "Swap participants can update offers"
  ON swap_offers FOR UPDATE
  TO authenticated
  USING (auth.uid() = initiator_id OR auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = initiator_id OR auth.uid() = receiver_id);

-- =====================
-- CHAT MESSAGES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  swap_offer_id uuid NOT NULL REFERENCES swap_offers(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  text text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Swap participants can view messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM swap_offers
      WHERE swap_offers.id = chat_messages.swap_offer_id
      AND (swap_offers.initiator_id = auth.uid() OR swap_offers.receiver_id = auth.uid())
    )
  );

CREATE POLICY "Swap participants can send messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM swap_offers
      WHERE swap_offers.id = chat_messages.swap_offer_id
      AND (swap_offers.initiator_id = auth.uid() OR swap_offers.receiver_id = auth.uid())
    )
  );

-- =====================
-- INDEXES
-- =====================
CREATE INDEX IF NOT EXISTS idx_products_owner ON products(owner_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_city ON products(city);

CREATE INDEX IF NOT EXISTS idx_swap_offers_initiator ON swap_offers(initiator_id);
CREATE INDEX IF NOT EXISTS idx_swap_offers_receiver ON swap_offers(receiver_id);
CREATE INDEX IF NOT EXISTS idx_swap_offers_status ON swap_offers(status);

CREATE INDEX IF NOT EXISTS idx_chat_messages_offer ON chat_messages(swap_offer_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);

-- =====================
-- UPDATED_AT TRIGGER
-- =====================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON products;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON swap_offers;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON swap_offers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
