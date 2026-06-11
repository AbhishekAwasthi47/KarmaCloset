import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          phone: string | null;
          name: string;
          avatar: string;
          green_karma: number;
          pincode: string;
          city: string;
          is_aadhaar_verified: boolean;
          is_trusted_swapper: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          phone?: string | null;
          name?: string;
          avatar?: string;
          green_karma?: number;
          pincode?: string;
          city?: string;
          is_aadhaar_verified?: boolean;
          is_trusted_swapper?: boolean;
        };
        Update: {
          phone?: string | null;
          name?: string;
          avatar?: string;
          green_karma?: number;
          pincode?: string;
          city?: string;
          is_aadhaar_verified?: boolean;
          is_trusted_swapper?: boolean;
        };
      };
      products: {
        Row: {
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
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          price_inr?: number | null;
          is_swap_available?: boolean;
          eco_tag?: string;
          category?: string;
          status?: string;
          images?: string[];
          eco_score?: number;
          owner_id: string;
          pincode?: string;
          city?: string;
        };
        Update: {
          title?: string;
          description?: string;
          price_inr?: number | null;
          is_swap_available?: boolean;
          eco_tag?: string;
          category?: string;
          status?: string;
          images?: string[];
          eco_score?: number;
          pincode?: string;
          city?: string;
        };
      };
      swap_offers: {
        Row: {
          id: string;
          status: string;
          offered_item_id: string;
          requested_item_id: string;
          cash_difference_inr: number;
          initiator_id: string;
          receiver_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          status?: string;
          offered_item_id: string;
          requested_item_id: string;
          cash_difference_inr?: number;
          initiator_id: string;
          receiver_id: string;
        };
        Update: {
          status?: string;
          cash_difference_inr?: number;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          swap_offer_id: string;
          sender_id: string;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          swap_offer_id: string;
          sender_id: string;
          text: string;
        };
        Update: {
          text?: string;
        };
      };
    };
  };
};
