'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  // Make sure we're on the client before rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, loading, pathname, router, isClient]);

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-brand-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // If on login page or no user, just render children (the login form)
  if (!user || pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Admin is logged in
  return (
    <div className="min-h-screen bg-brand-secondary">
      {/* Admin Nav */}
      <div className="bg-brand-primary text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-8">
            <span className="font-bold text-sm whitespace-nowrap">
              DPiLOT <span className="text-brand-muted">ADMIN</span>
            </span>
            <nav className="flex gap-6 text-sm">
              <Link href="/admin" className="hover:text-brand-accent transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/products" className="hover:text-brand-accent transition-colors">
                Products
              </Link>
              <Link href="/admin/categories" className="hover:text-brand-accent transition-colors">
                Categories
              </Link>
              <Link href="/admin/orders" className="hover:text-brand-accent transition-colors">
                Orders
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-brand-muted hidden sm:inline">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}