import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allow only your sites (and local dev)
const ALLOWED_ORIGINS = new Set([
  "https://neesh.art",
  "https://neeshapp2025.web.app",
  "https://www.neesh.art",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Vary": "Origin",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };
}

serve(async (req) => {
  const origin = req.headers.get("origin");

  // Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "X-Neesh-Function": "retailer-application v2.1",
        ...corsHeaders(origin)
      }
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }

  try {
    // Service role is fine here (server-side) and ignores RLS
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const applicationData = await req.json();
    console.log('📝 Received retailer application:', applicationData);

    const { data: result, error } = await supabase
      .from("retailer_applications")
      .insert([applicationData])
      .select("id, shop_name, buyer_email, buyer_name")
      .single();

    if (error) {
      console.error("❌ insert error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to submit application", details: error.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders(origin) } },
      );
    }

    console.log('✅ Retailer application submitted successfully:', result);

    // Send confirmation email
    try {
      const confirmationResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/application-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        },
        body: JSON.stringify({
          applicationId: result.id,
          applicationType: 'retailer',
          applicantEmail: result.buyer_email,
          applicantName: result.buyer_name || 'there',
          businessName: (applicationData as any).business_name,
          shopName: result.shop_name,
        }),
      });

      if (confirmationResponse.ok) {
        console.log("✅ Confirmation email sent successfully");
      } else {
        console.error("❌ Failed to send confirmation email:", await confirmationResponse.text());
      }
    } catch (emailError) {
      console.error("❌ Error sending confirmation email:", emailError);
      // Don't fail the application submission if email fails
    }

    return new Response(
      JSON.stringify({ success: true, message: "Application submitted", data: result }),
      { status: 201, headers: { "Content-Type": "application/json", ...corsHeaders(origin) } },
    );
  } catch (e) {
    console.error("💥 function error:", e);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(e?.message ?? e) }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders(origin) } },
    );
  }
});
