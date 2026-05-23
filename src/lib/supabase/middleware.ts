import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh the session if it exists
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.pathname === '/admin/login') {
      // Allow access to login page
      if (user) {
        // Already logged in — redirect to admin dashboard
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }

    if (!user) {
      // Not logged in — redirect to login
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    // Role gate for builder-only routes (pages/theme/assets). admin role
    // gets in everywhere, editor role gets builder routes only.
    const path = request.nextUrl.pathname;
    const builderOnly = /^\/admin\/(pages|theme|assets)(\/|$)/.test(path);
    const { data: roleRow } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();
    const role = (roleRow as { role?: 'admin' | 'editor' } | null)?.role ?? null;

    if (!role) {
      // Logged in but not provisioned as builder/admin user — sign out path
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('error', 'not-authorized');
      return NextResponse.redirect(url);
    }

    if (role === 'editor' && !builderOnly && path !== '/admin') {
      // Editors can only see /admin landing + builder routes
      const url = request.nextUrl.clone();
      url.pathname = '/admin/pages';
      return NextResponse.redirect(url);
    }
  }

  // Protect customer portal routes
  if (request.nextUrl.pathname.startsWith('/portal')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
