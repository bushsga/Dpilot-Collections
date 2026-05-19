'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';

interface ProductCardSliderProps {
  product: Product;
}

export default function ProductCardSlider({ product }: ProductCardSliderProps) {
  const hasMultipleImages = product.images && product.images.length > 1;
  
  const [emblaRef] = useEmblaCarousel(
    { loop: hasMultipleImages },
    hasMultipleImages ? [Autoplay({ delay: 3000, stopOnInteraction: false })] : []
  );

  const totalStock = product.quantity;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-brand-surface border border-brand-muted/10 hover:border-brand-accent transition-all block"
    >
      {/* Image Container */}
      <div className="aspect-square relative overflow-hidden bg-brand-secondary">
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {(product.images && product.images.length > 0
              ? product.images
              : ['/images/placeholder.jpg']
            ).map((img: string, idx: number) => (
              <div key={idx} className="flex-[0_0_100%] relative h-full">
                <Image
                  src={img}
                  alt={`${product.name} - Image ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Price Tag */}
        <div className="absolute top-3 left-3 bg-brand-primary text-white text-xs px-3 py-1 z-10">
          ₦{product.price.toLocaleString()}
        </div>

        {/* Stock Badge */}
        {totalStock <= 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 z-10">
            Sold Out
          </div>
        )}
        {totalStock > 0 && totalStock <= 3 && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 z-10">
            Only {totalStock} left
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-brand-primary line-clamp-2 mb-1 group-hover:text-brand-accent transition-colors">
          {product.name}
        </h3>

        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <p className="text-xs text-brand-muted">
            Sizes: {product.sizes.join(', ')}
          </p>
        )}

        {/* Stock Status */}
        {totalStock > 3 && (
          <p className="text-xs text-green-600 mt-1">In Stock</p>
        )}
        {totalStock > 0 && totalStock <= 3 && (
          <p className="text-xs text-orange-500 mt-1">Low Stock</p>
        )}
        {totalStock <= 0 && (
          <p className="text-xs text-red-500 mt-1">Out of Stock</p>
        )}
      </div>
    </Link>
  );
}