import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // In Next.js 15+, cookies can only be set in Server Actions or Route Handlers.
          // We catch the error silently during Server Component rendering.
          // Auth will still work because the session is managed client-side via AuthContext.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Silently fail – this is expected in Server Components.
            // The client-side AuthContext handles session persistence.
          }
        },
      },
    }
  );
}