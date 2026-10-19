import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Header otentikasi tidak ditemukan.");

    const client = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await client.auth.getUser();
    if (authError || !user) throw new Error("User tidak valid.");

    const { plan, duration_months, purchase_token } = await req.json();

    // ponytail: receipt validation di-skip untuk sandbox/dev. Pasang Google Play / RevenueCat API saat rilis production.
    if (Deno.env.get("ENVIRONMENT") === "production" && !purchase_token) {
      throw new Error("Purchase token wajib di production.");
    }

    const months = duration_months ?? (plan === "yearly" ? 12 : 1);

    const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

    // Ambil expiry lama jika user perpanjang sebelum masa habis
    const { data: profile } = await adminSupabase
      .from("profiles")
      .select("pro_expires_at")
      .eq("id", user.id)
      .single();

    const now = new Date();
    const currentExpiry = profile?.pro_expires_at ? new Date(profile.pro_expires_at) : null;
    const baseDate = currentExpiry && currentExpiry > now ? currentExpiry : now;

    const expiresAt = new Date(baseDate);
    expiresAt.setMonth(expiresAt.getMonth() + months);

    const { error: updateError } = await adminSupabase
      .from("profiles")
      .update({
        is_pro: true,
        pro_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ success: true, pro_expires_at: expiresAt.toISOString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
