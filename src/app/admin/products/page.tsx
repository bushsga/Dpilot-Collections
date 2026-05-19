'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/types';
import Image from 'next/image';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [restockingId, setRestockingId] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState<number>(10);
  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data as Product[]);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter((p: Product) => p.id !== id));
    } else {
      alert('Failed to delete: ' + error.message);
    }
  };

  const handleRestock = async (productId: string) => {
    if (restockQty <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    const { error } = await supabase.rpc('restock_product', {
      product_id: productId,
      qty: restockQty,
    });
    if (!error) {
      setProducts((prev: Product[]) =>
        prev.map((p: Product) =>
          p.id === productId
            ? { ...p, quantity: p.quantity + restockQty, in_stock: true }
            : p
        )
      );
      setRestockingId(null);
      setRestockQty(10);
    } else {
      alert('Restock failed: ' + error.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-brand-primary">Products ({products.length})</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-brand-accent text-white px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium hover:bg-brand-primary transition-colors"
        >
          <FiPlus />
          <span className="hidden sm:inline">Add Product</span>
        </Link>
      </div>

      {loading ? (
        <p className="text-brand-muted">Loading products...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brand-muted text-lg mb-4">No products yet</p>
          <Link href="/admin/products/new" className="text-brand-accent hover:underline text-sm">
            Add your first product
          </Link>
        </div>
      ) : (
        <>
          {/* ========== DESKTOP TABLE ========== */}
          <div className="hidden md:block bg-white border border-brand-muted/10">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-muted/10 text-left">
                    <th className="p-4 text-sm font-medium text-brand-muted">Product</th>
                    <th className="p-4 text-sm font-medium text-brand-muted">Price</th>
                    <th className="p-4 text-sm font-medium text-brand-muted">Category</th>
                    <th className="p-4 text-sm font-medium text-brand-muted">Stock</th>
                    <th className="p-4 text-sm font-medium text-brand-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: Product) => (
                    <tr key={product.id} className="border-b border-brand-muted/5 hover:bg-brand-secondary/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.name} width={48} height={48} className="w-12 h-12 object-cover border" />
                          ) : (
                            <div className="w-12 h-12 bg-brand-secondary flex items-center justify-center text-brand-muted text-xs">No img</div>
                          )}
                          <span className="text-sm font-medium text-brand-primary truncate max-w-[200px]">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium">₦{product.price.toLocaleString()}</td>
                      <td className="p-4 text-sm text-brand-muted">{product.category_slug || '—'}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${product.quantity <= 0 ? 'text-red-600' : product.quantity <= 3 ? 'text-orange-500' : 'text-green-600'}`}>
                            {product.quantity}
                          </span>
                          {restockingId === product.id ? (
                            <div className="flex items-center gap-1">
                              <input type="number" min="1" value={restockQty} onChange={(e) => setRestockQty(parseInt(e.target.value) || 0)} className="w-16 border px-2 py-1 text-xs" />
                              <button onClick={() => handleRestock(product.id)} className="bg-green-600 text-white text-xs px-2 py-1">✓</button>
                              <button onClick={() => setRestockingId(null)} className="text-red-500 text-xs px-2 py-1">✕</button>
                            </div>
                          ) : (
                            <button onClick={() => { setRestockingId(product.id); setRestockQty(10); }} className="text-brand-muted hover:text-green-600" title="Restock">
                              <FiRefreshCw size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Link href={`/admin/products/${product.id}/edit`} className="text-brand-muted hover:text-brand-accent"><FiEdit2 size={16} /></Link>
                          <button onClick={() => handleDelete(product.id, product.name)} className="text-brand-muted hover:text-red-600"><FiTrash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========== MOBILE CARDS ========== */}
          <div className="md:hidden space-y-4">
            {products.map((product: Product) => (
              <div key={product.id} className="bg-white border border-brand-muted/10 p-4">
                <div className="flex gap-3 mb-3">
                  {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.name} width={64} height={64} className="w-16 h-16 object-cover border flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-brand-secondary flex items-center justify-center text-brand-muted text-xs flex-shrink-0">No img</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-brand-primary truncate">{product.name}</h3>
                    <p className="text-sm font-bold text-brand-accent mt-1">₦{product.price.toLocaleString()}</p>
                  </div>
                </div>

                {/* Info Row */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                  <div>
                    <span className="text-brand-muted">Category: </span>
                    <span className="text-brand-primary">{product.category_slug || '—'}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted">Stock: </span>
                    <span className={`font-bold ${product.quantity <= 0 ? 'text-red-600' : product.quantity <= 3 ? 'text-orange-500' : 'text-green-600'}`}>
                      {product.quantity}
                    </span>
                  </div>
                </div>

                {/* Restock & Actions Row */}
                <div className="flex items-center justify-between">
                  {/* Restock */}
                  <div className="flex items-center gap-2">
                    {restockingId === product.id ? (
                      <div className="flex items-center gap-1">
                        <input type="number" min="1" value={restockQty} onChange={(e) => setRestockQty(parseInt(e.target.value) || 0)} className="w-14 border px-2 py-1 text-xs" />
                        <button onClick={() => handleRestock(product.id)} className="bg-green-600 text-white text-xs px-2 py-1 rounded">✓</button>
                        <button onClick={() => setRestockingId(null)} className="text-red-500 text-xs">✕</button>
                      </div>
                    ) : (
                      <button onClick={() => { setRestockingId(product.id); setRestockQty(10); }} className="flex items-center gap-1 text-xs text-brand-muted hover:text-green-600">
                        <FiRefreshCw size={12} /> Restock
                      </button>
                    )}
                  </div>

                  {/* Edit/Delete */}
                  <div className="flex items-center gap-4">
                    <Link href={`/admin/products/${product.id}/edit`} className="flex items-center gap-1 text-xs text-brand-muted hover:text-brand-accent">
                      <FiEdit2 size={14} /> Edit
                    </Link>
                    <button onClick={() => handleDelete(product.id, product.name)} className="flex items-center gap-1 text-xs text-brand-muted hover:text-red-600">
                      <FiTrash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}