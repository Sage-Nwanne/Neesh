// supabase/functions/publisher-application/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allow only your sites (and local dev)
const ALLOWED_ORIGINS = new Set<string>([
  "https://neesh.art",
  "https://www.neesh.art",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allowed,
    Vary: "Origin",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };
}

serve(async (req: Request) => {
  const origin = req.headers.get("origin");

  // Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "X-Neesh-Function": "publisher-application v2.2",
        ...corsHeaders(origin),
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "X-Neesh-Function": "publisher-application v2.2",
        ...corsHeaders(origin),
      },
    });
  }

  // Build server-side Supabase client (service role = ignores RLS)
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    // Parse JSON body
    let applicationData: Record<string, unknown>;
    try {
      applicationData = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "X-Neesh-Function": "publisher-application v2.2",
          ...corsHeaders(origin),
        },
      });
    }

    console.log("📝 Received publisher application:", applicationData);

    /** 1) Map legacy/mistyped client keys to actual DB columns */
    if ("estimated_copies_sold" in applicationData && !("copies_sold_estimate" in applicationData)) {
      const n = Number((applicationData as any).estimated_copies_sold);
      (applicationData as any).copies_sold_estimate = Number.isFinite(n) ? n : 0;
      delete (applicationData as any).estimated_copies_sold;
    }
    if ("sales_feedback" in applicationData && !("quotes_feedback" in applicationData)) {
      (applicationData as any).quotes_feedback = (applicationData as any).sales_feedback;
      delete (applicationData as any).sales_feedback;
    }
    if ("return_policy" in applicationData && !("accepts_returns" in applicationData)) {
      (applicationData as any).accepts_returns = (applicationData as any).return_policy;
      delete (applicationData as any).return_policy;
    }
    if ("volume_pricing" in applicationData && !("volume_pricing_tiers" in applicationData)) {
      // If the client sends 'volume_pricing' but your table column is 'volume_pricing_tiers'
      (applicationData as any).volume_pricing_tiers = (applicationData as any).volume_pricing;
      // keep both only if you truly use both columns; otherwise:
      delete (applicationData as any).volume_pricing;
    }

    /** 2) Defensive type coercion for common numeric/boolean fields */
    const toNum = (v: unknown, d = 0) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : d;
    };

    if ("has_sold_before" in applicationData) {
      const v = (applicationData as any).has_sold_before;
      (applicationData as any).has_sold_before = v === true || v === "yes" || v === "true";
    }
    if ("print_run" in applicationData) (applicationData as any).print_run = toNum((applicationData as any).print_run);
    if ("available_quantity" in applicationData) (applicationData as any).available_quantity = toNum((applicationData as any).available_quantity);
    if ("wholesale_price" in applicationData) (applicationData as any).wholesale_price = toNum((applicationData as any).wholesale_price);
    if ("suggested_retail_price" in applicationData) (applicationData as any).suggested_retail_price = toNum((applicationData as any).suggested_retail_price);
    if ("copies_sold_estimate" in applicationData) (applicationData as any).copies_sold_estimate = toNum((applicationData as any).copies_sold_estimate);

    /** 3) Whitelist only real columns from your table */
    const allowed = new Set<string>([
      "user_id",
      "status",
      "magazine_title",
      "issue_number",
      "description",
      "social_website_link",
      "print_run",
      "wholesale_price",
      "suggested_retail_price",
      "available_quantity",
      "specs",
      "cover_image_url",
      "has_sold_before",
      "distribution_channels",     // TEXT[]
      "copies_sold_estimate",      // INT
      "quotes_feedback",           // TEXT
      "fulfillment_method",
      "shipping_city",
      "shipping_state",
      "shipping_country",
      "accepts_returns",           // TEXT (per your schema)
      "email",
      "password",
      "first_name",
      "last_name",
      "business_name",
      "publication_type",
      "issue_frequency",
      "evergreen_score",
      "shelf_stability_months",
      "volume_pricing_tiers",      // JSONB
      "category_tags",             // TEXT[]
      "descriptive_blurb",
      "audience_positioning",
      "volume_pricing",            // JSONB (keep only if truly present in your schema)
    ]);

    const row = Object.fromEntries(
      Object.entries(applicationData).filter(([k]) => allowed.has(k))
    );

    // Default status if none was provided
    if (!("status" in row)) (row as any).status = "pending";

    console.log("🧹 Sanitized insert row keys:", Object.keys(row));

    /** 4) Insert */
    const { data: result, error } = await supabase
      .from("publisher_applications")
      .insert([row])
      .select("id, magazine_title, first_name, last_name, email")
      .single();

    if (error) {
      console.error("❌ insert error:", error);
      return new Response(JSON.stringify({ error: "Failed to submit application", details: error.message }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "X-Neesh-Function": "publisher-application v2.2",
          ...corsHeaders(origin),
        },
      });
    }

    console.log("✅ Publisher application submitted successfully:", result);

    return new Response(JSON.stringify({
      success: true,
      message: "Application submitted",
      data: result,
    }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "X-Neesh-Function": "publisher-application v2.2",
        ...corsHeaders(origin),
      },
    });
  } catch (e: any) {
    console.error("💥 function error:", e);
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: String(e?.message ?? e),
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "X-Neesh-Function": "publisher-application v2.2",
        ...corsHeaders(origin),
      },
    });
  }
});
