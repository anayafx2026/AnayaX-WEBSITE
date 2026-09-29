import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "@/config/supabase.server";
import type { Database } from "@/types/database.generated";

// Refresh only. This is NOT route authorization. Each private operation must authorize.
export async function proxy(request: NextRequest) {
  const config = getSupabaseConfig();
  let response = NextResponse.next({ request });
  const supabase = createServerClient<Database>(config.url, config.key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values, headers) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });
  await supabase.auth.getClaims();
  return response;
}

// Public marketing, metadata and health routes must not contact Auth.
// Add actual session-aware routes here when implementing the product.
export const config = { matcher: ["/account/:path*", "/admin/:path*", "/auth/:path*"] };
