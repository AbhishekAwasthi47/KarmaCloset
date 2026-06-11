import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ListingRequest {
  image_count: number;
  category_hint?: string;
}

const categoryMap: Record<string, string[]> = {
  "Ethnic Wear": ["saree", "kurta", "lehenga", "dupatta", "salwar", "churidar", "anarkali"],
  "Western Wear": ["shirt", "dress", "jeans", "trousers", "blazer", "skirt", "top"],
  "Sneakers": ["sneakers", "shoes", "nike", "adidas", "puma", "running shoes", "air max"],
  "Jackets": ["jacket", "bomber", "denim jacket", "leather jacket", "windbreaker", "blazer"],
  "Accessories": ["bag", "watch", "jewelry", "scarf", "belt", "sunglasses", "earrings"],
  "Denim": ["jeans", "denim", "levi's", "levis", "501", "jacket", "shorts"],
  "Bags": ["handbag", "tote", "backpack", "clutch", "messenger", "duffle"],
  "Kids": ["kids", "children", "baby", "toddler", "boys", "girls"],
  "Home Decor": ["cushion", "curtain", "bedsheet", "rug", "lamp", "vase", "wall art"],
};

const ecoTagMap: Record<string, string> = {
  "saree": "Gently Used",
  "kurta": "Gently Used",
  "upcycled": "Upcycled",
  "kantha": "Upcycled",
  "vintage": "Gently Used",
  "new": "New-Eco",
  "handmade": "Upcycled",
};

function generateTitle(category: string, categoryHint?: string): string {
  const items = categoryMap[category] || ["fashion item"];
  const item = items[Math.floor(Math.random() * items.length)];
  const adjectives = ["Vintage", "Classic", "Handcrafted", "Premium", "Pre-loved", "Stylish"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const brands = ["Designer", "Branded", "Premium Quality"];
  const brand = Math.random() > 0.5 ? brands[Math.floor(Math.random() * brands.length)] + " " : "";
  return `${adj} ${brand}${item.charAt(0).toUpperCase() + item.slice(1)} — Great Condition`;
}

function generateDescription(category: string, ecoTag: string): string {
  const items = categoryMap[category] || ["item"];
  const item = items[Math.floor(Math.random() * items.length)];

  const descriptions = [
    `Quality pre-owned ${item} in excellent condition. This piece has been well-maintained and is ready for a new home. Perfect for sustainable fashion lovers who want to look great while reducing their environmental footprint. Clean out your closet and give this ${item} a second life!`,
    `Beautiful ${item} looking for a new closet! ${ecoTag === "Upcycled" ? "This piece has been creatively upcycled with love and care, making it truly one-of-a-kind." : "Gently used with minimal signs of wear."} A great addition to any wardrobe — sustainable, stylish, and wallet-friendly.`,
    `Give this ${item} a second chance! ${ecoTag === "New-Eco" ? "Brand new with eco-friendly credentials." : "Well-maintained and ready to wear."} By choosing pre-owned, you're saving approximately 2.5 kg of CO2 and helping make fashion more sustainable. Every swap earns you karma points!`,
  ];

  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function calculateEcoScore(ecoTag: string): number {
  switch (ecoTag) {
    case "Upcycled": return 4.8 + Math.random() * 0.2;
    case "New-Eco": return 4.5 + Math.random() * 0.3;
    default: return 3.8 + Math.random() * 0.7;
  }
}

function inferCategory(hint?: string): string {
  if (!hint) {
    const cats = Object.keys(categoryMap);
    return cats[Math.floor(Math.random() * cats.length)];
  }
  const lower = hint.toLowerCase();
  for (const [cat, keywords] of Object.entries(categoryMap)) {
    if (keywords.some((kw) => lower.includes(kw)) || lower.includes(cat.toLowerCase())) {
      return cat;
    }
  }
  return hint || "Other";
}

function inferEcoTag(category: string): string {
  const tag = ecoTagMap[category.toLowerCase()];
  return tag || "Gently Used";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: ListingRequest = await req.json();
    const { image_count, category_hint } = body;

    const category = inferCategory(category_hint);
    const ecoTag = inferEcoTag(category);
    const title = generateTitle(category, category_hint);
    const description = generateDescription(category, ecoTag);
    const ecoScore = Math.round(calculateEcoScore(ecoTag) * 10) / 10;

    const data = {
      title,
      description,
      category,
      eco_tag: ecoTag,
      eco_score: ecoScore,
      image_count,
      generated_at: new Date().toISOString(),
    };

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
