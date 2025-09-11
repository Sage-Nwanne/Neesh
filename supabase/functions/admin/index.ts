import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
/** Allowed browser origins (prod + local) */ const ALLOWED_ORIGINS = new Set([
  "https://neesh.art",
  "https://www.neesh.art",
  "https://neeshapp2025.web.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
]);
function corsHeaders(origin) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Vary": "Origin",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
    "Access-Control-Max-Age": "86400"
  };
}
function json(body, init = {}) {
  const { origin, authState, headers, ...rest } = init;
  return new Response(JSON.stringify(body), {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      "X-Neesh-Function": "admin v2.2",
      ...authState ? {
        "X-Auth-State": authState
      } : {},
      ...headers || {},
      ...corsHeaders(origin ?? null)
    }
  });
}
serve(async (req)=>{
  const origin = req.headers.get("origin");
  // Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "X-Neesh-Function": "admin v2.2",
        ...corsHeaders(origin)
      }
    });
  }
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY"); // used only to verify user JWT
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"); // privileged DB
    // ---------- AUTH ----------
    const authHeader = req.headers.get("Authorization") || "";
    console.log("Auth header received:", authHeader ? `Bearer ${authHeader.slice(0, 20)}...` : "NONE");
    const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
    console.log("Bearer token extracted:", bearer ? `${bearer.slice(0, 20)}...` : "NONE");
    if (!bearer) {
      // Request reached your code (so not gateway 401), but no token provided.
      return json({
        error: "Missing Authorization bearer token"
      }, {
        status: 401,
        origin,
        authState: "no-bearer"
      });
    }
    // If someone accidentally sends the anon key as the "user token", treat as not logged in
    if (bearer === anonKey) {
      return json({
        error: "User token required (got anon key)"
      }, {
        status: 401,
        origin,
        authState: "anon-key-not-allowed"
      });
    }
    // Verify the user with the provided JWT
    const userClient = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${bearer}`
        }
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    // Debug: Log the full user object structure
    console.log("User verification result:", {
      user: user?.email,
      app_metadata: user?.app_metadata,
      user_metadata: user?.user_metadata,
      role_from_app_metadata: user?.app_metadata?.role,
      full_user_object: JSON.stringify(user, null, 2),
      error: userErr?.message
    });
    if (userErr) {
      console.log("User verification failed:", userErr.message);
      return json({
        error: "Invalid user token",
        details: userErr.message
      }, {
        status: 401,
        origin,
        authState: "invalid-user-jwt"
      });
    }
    if (!user) {
      console.log("No user found for token");
      return json({
        error: "User not found for token"
      }, {
        status: 401,
        origin,
        authState: "no-user"
      });
    }
    // Check for admin role in multiple possible locations
    const userRole = user.app_metadata?.role || user.user_metadata?.role;
    const isAdmin = userRole === "admin" || user.email === "admin@neesh.art";
    console.log("Admin check:", {
      userRole,
      isAdmin,
      email: user.email,
      app_metadata_role: user.app_metadata?.role,
      user_metadata_role: user.user_metadata?.role
    });
    if (!isAdmin) {
      console.log("User is not admin:", user.email, "Role:", userRole);
      return json({
        error: "Forbidden (requires admin role)",
        debug: {
          email: user.email,
          role: userRole,
          app_metadata: user.app_metadata,
          user_metadata: user.user_metadata
        }
      }, {
        status: 403,
        origin,
        authState: "not-admin"
      });
    }
    // ---------- DB CLIENT ----------
    const db = createClient(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    // ---------- ROUTING ----------
    const url = new URL(req.url);
    const path = url.pathname; // For Edge Functions this is usually "/admin" or "/admin/..."
    // Normalize helpers - Edge Functions receive "/" when called via /functions/v1/admin
    const isAdminRoot = (p)=>p === "/" || p === "/admin" || p.endsWith("/admin");
    const isAdminGet = req.method === "GET" && isAdminRoot(path);
    const isAdminAppGet = req.method === "GET" && (path.startsWith("/admin/applications/") || path.includes("/admin/applications/")) && !path.endsWith("/approve") && !path.endsWith("/deny");
    const isApprove = req.method === "PUT" && path.endsWith("/approve") && (path.includes("/admin/applications/") || path.startsWith("/admin/applications/"));
    const isDeny = req.method === "PUT" && path.endsWith("/deny") && (path.includes("/admin/applications/") || path.startsWith("/admin/applications/"));
    // ---------- HANDLERS ----------
    // GET /admin — list all applications
    if (isAdminGet) {
      const [{ data: pubs, error: e1 }, { data: rets, error: e2 }] = await Promise.all([
        db.from("publisher_applications").select("*").order("created_at", {
          ascending: false
        }),
        db.from("retailer_applications").select("*").order("created_at", {
          ascending: false
        })
      ]);
      if (e1 || e2) {
        return json({
          error: "Failed to fetch applications",
          details: e1?.message ?? e2?.message
        }, {
          status: 500,
          origin,
          authState: "ok-admin"
        });
      }
      const apps = [
        ...(pubs ?? []).map((a)=>({
            id: a.id,
            type: "publisher",
            applicantName: a.applicant_name ?? `${a.first_name ?? ""} ${a.last_name ?? ""}`.trim(),
            businessName: a.business_name,
            email: a.email,
            status: a.status,
            submittedAt: a.created_at,
            magazineTitle: a.magazine_title,
            applicationData: a
          })),
        ...(rets ?? []).map((a)=>({
            id: a.id,
            type: "retailer",
            applicantName: a.applicant_name ?? a.buyer_name ?? "",
            businessName: a.business_name ?? a.shop_name ?? "",
            email: a.email ?? a.buyer_email ?? "",
            status: a.status,
            submittedAt: a.created_at,
            storeLocation: a.store_location ?? (a.business_city && a.business_state ? `${a.business_city}, ${a.business_state}` : undefined),
            applicationData: a
          }))
      ].sort((x, y)=>new Date(y.submittedAt).getTime() - new Date(x.submittedAt).getTime());
      return json(apps, {
        status: 200,
        origin,
        authState: "ok-admin"
      });
    }
    // GET /admin/applications/:id
    if (isAdminAppGet) {
      const parts = path.split("/").filter(Boolean);
      const id = parts[parts.length - 1]; // last segment
      const type = url.searchParams.get("type") === "retailer" ? "retailer" : "publisher";
      const table = type === "retailer" ? "retailer_applications" : "publisher_applications";
      const { data, error } = await db.from(table).select("*").eq("id", id).single();
      if (error) {
        return json({
          error: "Failed to fetch application",
          details: error.message
        }, {
          status: 500,
          origin,
          authState: "ok-admin"
        });
      }
      return json(data, {
        status: 200,
        origin,
        authState: "ok-admin"
      });
    }
    // PUT /admin/applications/:id/approve
    if (isApprove) {
      const parts = path.split("/").filter(Boolean);
      const id = parts[parts.length - 2]; // .../:id/approve
      const body = await req.json().catch(()=>({}));
      const type = body?.type === "retailer" ? "retailer" : "publisher";
      const table = type === "retailer" ? "retailer_applications" : "publisher_applications";
      const { data, error } = await db.from(table).update({
        status: "approved"
      }).eq("id", id).select().single();
      if (error) {
        return json({
          error: "Approve failed",
          details: error.message
        }, {
          status: 500,
          origin,
          authState: "ok-admin"
        });
      }
      return json({
        success: true,
        application: data
      }, {
        status: 200,
        origin,
        authState: "ok-admin"
      });
    }
    // PUT /admin/applications/:id/deny
    if (isDeny) {
      const parts = path.split("/").filter(Boolean);
      const id = parts[parts.length - 2]; // .../:id/deny
      const body = await req.json().catch(()=>({}));
      const type = body?.type === "retailer" ? "retailer" : "publisher";
      const table = type === "retailer" ? "retailer_applications" : "publisher_applications";
      const { data, error } = await db.from(table).update({
        status: "rejected"
      }).eq("id", id).select().single();
      if (error) {
        return json({
          error: "Deny failed",
          details: error.message
        }, {
          status: 500,
          origin,
          authState: "ok-admin"
        });
      }
      return json({
        success: true,
        application: data
      }, {
        status: 200,
        origin,
        authState: "ok-admin"
      });
    }
    // Route not found
    return json({
      error: "Route not found"
    }, {
      status: 404,
      origin,
      authState: "ok-admin"
    });
  } catch (e) {
    console.error("admin fatal:", e);
    return json({
      error: "Internal server error",
      details: String(e?.message ?? e)
    }, {
      status: 500,
      origin,
      authState: "exception"
    });
  }
});
