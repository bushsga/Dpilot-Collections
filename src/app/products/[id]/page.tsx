'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import type { Product, ProductVariant } from '@/types';
import AddToCartButton from '@/components/product/AddToCartButton';
import ProductImageGallery from '@/components/product/ProductImageGallery';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const { data: prod } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (!prod) {
      notFound();
    }

    const { data: vars } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', id)
      .order('created_at');

    setProduct(prod as Product);
    setVariants((vars || []) as ProductVariant[]);
    
    // Auto-select first available variant
    if (vars && vars.length > 0) {
      const firstAvailable = vars.find((v: ProductVariant) => v.quantity > 0);
      setSelectedVariant((firstAvailable || vars[0]) as ProductVariant);
    }
    
    setLoading(false);
  };

  if (loading) return <div className="text-center py-20 text-brand-muted">Loading...</div>;
  if (!product) return notFound();

  // Determine which images to show
  const displayImages = selectedVariant && selectedVariant.images.length > 0
    ? selectedVariant.images
    : product.images;

  // Determine available stock
  const availableStock = selectedVariant ? selectedVariant.quantity : product.quantity;
  const isOutOfStock = availableStock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <ProductImageGallery images={displayImages} productName={product.name} />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {product.category_slug && (
            <p className="text-xs text-brand-accent uppercase tracking-widest">
              {product.category_slug}
            </p>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-brand-primary">
            {product.name}
          </h1>

          <p className="text-3xl font-bold text-brand-accent">
            ₦{product.price.toLocaleString()}
          </p>

          {/* Color Variants */}
          {variants.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-brand-primary mb-3">Available Colors</h3>
              <div className="flex flex-wrap gap-3">
                {variants.map((variant: ProductVariant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                      selectedVariant?.id === variant.id
                        ? 'border-brand-accent ring-2 ring-brand-accent/20'
                        : variant.quantity <= 0
                        ? 'border-red-300 opacity-40 cursor-not-allowed'
                        : 'border-brand-muted/30 hover:border-brand-accent'
                    }`}
                    style={{ backgroundColor: variant.color_hex }}
                    title={`${variant.color_name}${variant.quantity <= 0 ? ' (Out of Stock)' : ` (${variant.quantity} in stock)`}`}
                    disabled={variant.quantity <= 0}
                  >
                    {variant.quantity <= 0 && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-full h-0.5 bg-red-400 rotate-45 absolute"></span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {selectedVariant && (
                <p className="text-xs text-brand-muted mt-2">
                  Color: {selectedVariant.color_name} 
                  {selectedVariant.quantity <= 3 && selectedVariant.quantity > 0 && (
                    <span className="text-orange-500 ml-2">(Only {selectedVariant.quantity} left!)</span>
                  )}
                  {selectedVariant.quantity <= 0 && (
                    <span className="text-red-500 ml-2">(Out of Stock)</span>
                  )}
                </p>
              )}
            </div>
          )}

          {/* No variants - show simple stock info */}
          {variants.length === 0 && (
            <div>
              {product.quantity <= 3 && product.quantity > 0 && (
                <p className="text-sm text-orange-500">Only {product.quantity} left in stock!</p>
              )}
              {product.quantity <= 0 && (
                <p className="text-sm text-red-500">Out of Stock</p>
              )}
            </div>
          )}

          {product.description && (
            <div>
              <h3 className="text-sm font-semibold text-brand-primary mb-2">Description</h3>
              <p className="text-brand-muted leading-relaxed">{product.description}</p>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-brand-primary mb-3">Available Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size: number) => (
                  <span
                    key={size}
                    className="px-4 py-2 border border-brand-muted/20 text-sm text-brand-primary"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            {isOutOfStock ? (
              <p className="text-red-600 text-sm">✕ Out of Stock</p>
            ) : (
              <p className="text-green-600 text-sm">✓ In Stock ({availableStock} available)</p>
            )}
          </div>

          <AddToCartButton product={product} variant={selectedVariant} />
        </div>
      </div>
    </div>
  );
}