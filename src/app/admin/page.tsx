'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Product, ProductVariant } from '@/types';

export default function AdminDashboard() {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [lowStockVariants, setLowStockVariants] = useState<{ variant: ProductVariant; productName: string }[]>([]);
  const supabase = createClient();

  useEffect(() => {
    checkLowStock();
  }, []);

  const checkLowStock = async () => {
    // Products with low stock (3 or less)
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .lte('quantity', 3)
      .gt('quantity', -1)
      .order('quantity');

    if (products) setLowStockProducts(products as Product[]);

    // Variants with low stock
    const { data: variants } = await supabase
      .from('product_variants')
      .select('*, products(name)')
      .lte('quantity', 3)
      .gt('quantity', -1)
      .order('quantity');

    if (variants) {
      setLowStockVariants(
        (variants as any[]).map((v) => ({
          variant: v as ProductVariant,
          productName: v.products?.name || 'Unknown',
        }))
      );
    }
  };

  const totalLowStock = lowStockProducts.length + lowStockVariants.length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-primary mb-8">Dashboard</h1>

      {/* Low Stock Alert Banner */}
      {totalLowStock > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">⚠️</span>
            <h2 className="text-lg font-semibold text-orange-800">
              Low Stock Alert ({totalLowStock})
            </h2>
          </div>
          
          {lowStockProducts.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium text-orange-700 mb-2">Products:</p>
              <ul className="space-y-1">
                {lowStockProducts.map((p) => (
                  <li key={p.id} className="text-sm text-orange-600 flex justify-between">
                    <Link href={`/admin/products/${p.id}/edit`} className="hover:underline">
                      {p.name}
                    </Link>
                    <span className="font-bold">{p.quantity} left</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {lowStockVariants.length > 0 && (
            <div>
              <p className="text-sm font-medium text-orange-700 mb-2">Color Variants:</p>
              <ul className="space-y-1">
                {lowStockVariants.map((v) => (
                  <li key={v.variant.id} className="text-sm text-orange-600 flex justify-between">
                    <span>{v.productName} - {v.variant.color_name}</span>
                    <span className="font-bold">{v.variant.quantity} left</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="bg-brand-surface p-8 border border-brand-muted/10 hover:border-brand-accent transition-colors"
        >
          <h3 className="text-lg font-semibold text-brand-primary mb-2">Products</h3>
          <p className="text-sm text-brand-muted">Manage your shoe collection</p>
        </Link>

        <Link
          href="/admin/categories"
          className="bg-brand-surface p-8 border border-brand-muted/10 hover:border-brand-accent transition-colors"
        >
          <h3 className="text-lg font-semibold text-brand-primary mb-2">Categories</h3>
          <p className="text-sm text-brand-muted">Organize your products</p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-brand-surface p-8 border border-brand-muted/10 hover:border-brand-accent transition-colors"
        >
          <h3 className="text-lg font-semibold text-brand-primary mb-2">Orders</h3>
          <p className="text-sm text-brand-muted">View and manage orders</p>
        </Link>
      </div>
    </div>
  );
}