import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" } });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { email, password } = await req.json();

  // Check if user exists
  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
  const existing = users?.find(u => u.email === email);

  let userId: string;

  if (existing) {
    // Update password
    const { error } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });
    if (error) return Response.json({ error: error.message }, { status: 400 });
    userId = existing.id;
  } else {
    // Create user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) return Response.json({ error: error.message }, { status: 400 });
    userId = data.user.id;
  }

  // Ensure admin role
  const { data: roles } = await supabaseAdmin.from("user_roles").select("*").eq("user_id", userId).eq("role", "admin");
  if (!roles?.length) {
    const { error: roleErr } = await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: "admin" });
    if (roleErr) return Response.json({ error: roleErr.message }, { status: 400 });
  }

  return Response.json({ success: true, userId });
});
