import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import type { Product, Category } from '@/types';

interface SearchParams {
  category?: string;
  size?: string;
  minPrice?: string;
  maxPrice?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();

  // Fetch all categories for filter
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  // Build query
  let query = supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('created_at', { ascending: false });

  // Apply filters
  if (params.category) {
    query = query.eq('category_slug', params.category);
  }

  const { data: products } = await query;

  // Filter by size on client (since PostgreSQL array filtering is complex)
  let filteredProducts = products || [];
  
  if (params.size) {
    const sizeNum = parseInt(params.size);
    filteredProducts = filteredProducts.filter(
      (p) => p.sizes && p.sizes.includes(sizeNum)
    );
  }

  if (params.minPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= parseFloat(params.minPrice!)
    );
  }

  if (params.maxPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= parseFloat(params.maxPrice!)
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">
          {params.category 
            ? categories?.find(c => c.slug === params.category)?.name || 'Products'
            : 'All Products'
          }
        </h1>
        <p className="text-brand-muted mt-2">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-brand-surface border border-brand-muted/10 p-6 space-y-8 sticky top-24">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-semibold text-brand-primary mb-3">Category</h3>
              <div className="space-y-2">
                <Link
                  href="/products"
                  className={`block text-sm ${!params.category ? 'text-brand-accent font-medium' : 'text-brand-muted hover:text-brand-primary'} transition-colors`}
                >
                  All
                </Link>
                {(categories || []).map((cat: Category) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className={`block text-sm ${params.category === cat.slug ? 'text-brand-accent font-medium' : 'text-brand-muted hover:text-brand-primary'} transition-colors`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h3 className="text-sm font-semibold text-brand-primary mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {[40, 41, 42, 43, 44, 45, 46, 47].map((size) => (
                  <Link
                    key={size}
                    href={`/products?${params.category ? `category=${params.category}&` : ''}size=${size}`}
                    className={`px-3 py-1 text-xs border ${params.size === size.toString() ? 'border-brand-accent bg-brand-accent text-white' : 'border-brand-muted/20 text-brand-muted hover:border-brand-accent'} transition-colors`}
                  >
                    {size}
                  </Link>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(params.category || params.size) && (
              <Link
                href="/products"
                className="block text-sm text-red-500 hover:text-red-600 transition-colors"
              >
                Clear all filters
              </Link>
            )}
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-brand-muted text-lg">No products match your filters.</p>
              <Link href="/products" className="text-sm text-brand-accent hover:underline mt-2 inline-block">
                View all products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Product Card Component (same as homepage)
function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-brand-surface border border-brand-muted/10 hover:border-brand-accent transition-all"
    >
      <div className="aspect-square relative overflow-hidden bg-brand-secondary">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-muted text-sm">
            No Image
          </div>
        )}
        
        <div className="absolute top-3 left-3 bg-brand-primary text-white text-xs px-3 py-1">
          ₦{product.price.toLocaleString()}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-brand-primary line-clamp-2 mb-1 group-hover:text-brand-accent transition-colors">
          {product.name}
        </h3>
        
        {product.sizes && product.sizes.length > 0 && (
          <p className="text-xs text-brand-muted">
            Sizes: {product.sizes.join(', ')}
          </p>
        )}
      </div>
    </Link>
  );
}