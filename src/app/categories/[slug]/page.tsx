import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Product } from '@/types';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  // Fetch category
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!category) {
    notFound();
  }

  // Fetch products in this category
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category_slug', slug)
    .eq('in_stock', true)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">{category.name}</h1>
        <p className="text-brand-muted mt-2">
          {(products || []).length} product{(products || []).length !== 1 ? 's' : ''} found
        </p>
      </div>

      {(products || []).length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brand-muted text-lg">No products in this category yet.</p>
          <Link href="/products" className="text-sm text-brand-accent hover:underline mt-2 inline-block">
            Browse all products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products!.map((product: Product) => (
            <Link
              key={product.id}
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
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
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
          ))}
        </div>
      )}
    </div>
  );
}