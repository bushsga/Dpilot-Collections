import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Category } from '@/types';
import HeroSlider from '@/components/home/HeroSlider';
import TestimonialCarousel from '@/components/home/TestimonialCarousel';
import ProductCardSlider from '@/components/product/ProductCardSlider';
import type { Product } from '@/types';

export default async function Home() {
  const supabase = await createServerSupabaseClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  // Fetch featured products (up to 8)
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .eq('featured', true)
    .limit(8)
    .order('created_at', { ascending: false });

  // If no featured products, just get the latest 8
  const { data: latestProducts } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .limit(8)
    .order('created_at', { ascending: false });

  const displayProducts = (featuredProducts && featuredProducts.length > 0)
    ? featuredProducts
    : latestProducts || [];

  return (
    <>
      {/* Hero Section with Slider */}
      <HeroSlider />

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto py-20 px-4">
        <h2 className="text-2xl font-bold text-brand-primary mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(categories || []).map((category: Category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group bg-brand-surface p-10 text-center border border-brand-muted/10 hover:border-brand-accent transition-all"
            >
              <h3 className="text-lg font-semibold text-brand-primary group-hover:text-brand-accent transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto py-20 px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-brand-primary">
            {featuredProducts && featuredProducts.length > 0 ? 'Featured Picks' : 'New Arrivals'}
          </h2>
          <Link
            href="/products"
            className="text-sm text-brand-accent hover:underline"
          >
            View All →
          </Link>
        </div>

        {displayProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-brand-muted text-lg">No products available yet.</p>
            <p className="text-brand-muted text-sm mt-2">Check back soon for new arrivals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProducts.map((product: Product) => (
              <ProductCardSlider key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Testimonials Carousel */}
      <TestimonialCarousel />

      {/* Trust Banner */}
      <section className="bg-brand-surface border-y border-brand-muted/10 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-semibold text-brand-primary mb-2">Original Quality</h3>
            <p className="text-sm text-brand-muted">100% authentic products</p>
          </div>
          <div>
            <h3 className="font-semibold text-brand-primary mb-2">Fully Boxed</h3>
            <p className="text-sm text-brand-muted">Complete with original packaging</p>
          </div>
          <div>
            <h3 className="font-semibold text-brand-primary mb-2">Fast Delivery</h3>
            <p className="text-sm text-brand-muted">Nationwide shipping available</p>
          </div>
        </div>
      </section>
    </>
  );
}
