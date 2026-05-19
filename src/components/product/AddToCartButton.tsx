'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import type { Product, ProductVariant } from '@/types';

interface AddToCartButtonProps {
  product: Product;
  variant?: ProductVariant | null;
}

export default function AddToCartButton({ product, variant }: AddToCartButtonProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const availableStock = variant ? variant.quantity : product.quantity;
  const isOutOfStock = availableStock <= 0;

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    if (isOutOfStock) {
      alert('This item is out of stock');
      return;
    }

    addItem(product, variant || null, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-brand-muted/10">
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-brand-primary">Select Size:</label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size: number) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 text-sm border transition-colors ${
                  selectedSize === size
                    ? 'border-brand-accent bg-brand-accent text-white'
                    : 'border-brand-muted/20 text-brand-primary hover:border-brand-accent'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={`w-full py-4 text-sm font-medium transition-colors ${
          isOutOfStock
            ? 'bg-brand-muted/20 text-brand-muted cursor-not-allowed'
            : added
            ? 'bg-green-600 text-white'
            : 'bg-brand-accent text-white hover:bg-brand-primary'
        }`}
      >
        {isOutOfStock ? 'Out of Stock' : added ? '✓ Added to Cart!' : 'Add to Cart'}
      </button>

      {!isOutOfStock && availableStock <= 3 && (
        <p className="text-xs text-orange-500 text-center">
          Only {availableStock} left in stock!
        </p>
      )}
    </div>
  );
}