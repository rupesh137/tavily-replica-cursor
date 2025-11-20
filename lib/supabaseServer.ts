import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.warn(
    "Supabase environment variables are not fully configured. " +
      "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable API key CRUD.",
  );
}

export const getSupabaseServerClient = () => {
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing Supabase configuration variables.");
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
    },
  });
};

