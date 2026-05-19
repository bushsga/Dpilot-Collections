'use client';

import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import Image from 'next/image';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, getItemKey } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-brand-primary mb-4">Your Cart is Empty</h1>
        <p className="text-brand-muted mb-8">Looks like you haven&apos;t added any shoes yet.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-brand-accent text-white px-8 py-3 text-sm font-medium hover:bg-brand-primary transition-colors"
        >
          <FiArrowLeft />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-brand-primary mb-8">
        Shopping Cart ({totalItems} item{totalItems !== 1 ? 's' : ''})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const itemKey = getItemKey(item.product.id, item.variant?.id ?? null, item.size);
            const displayImages = item.variant && item.variant.images.length > 0
              ? item.variant.images
              : item.product.images;

            return (
              <div
                key={itemKey}
                className="bg-brand-surface border border-brand-muted/10 p-4 flex gap-4"
              >
                {/* Product Image */}
                <div className="w-24 h-24 relative flex-shrink-0 bg-brand-secondary">
                  {displayImages && displayImages.length > 0 ? (
                    <Image
                      src={displayImages[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-muted text-xs">
                      No img
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-brand-primary truncate">
                    {item.product.name}
                  </h3>
                  {item.variant && (
                    <p className="text-xs text-brand-muted mt-1">
                      Color: {item.variant.color_name}
                    </p>
                  )}
                  {item.size && (
                    <p className="text-xs text-brand-muted mt-1">Size: {item.size}</p>
                  )}
                  <p className="text-sm font-semibold text-brand-accent mt-2">
                    ₦{item.product.price.toLocaleString()}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.variant?.id ?? null,
                          item.size,
                          item.quantity - 1
                        )
                      }
                      className="w-8 h-8 border border-brand-muted/20 flex items-center justify-center hover:border-brand-accent transition-colors"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.variant?.id ?? null,
                          item.size,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 border border-brand-muted/20 flex items-center justify-center hover:border-brand-accent transition-colors"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>

                {/* Subtotal & Remove */}
                <div className="flex flex-col items-end justify-between">
                  <p className="text-sm font-semibold text-brand-primary">
                    ₦{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() =>
                      removeItem(item.product.id, item.variant?.id ?? null, item.size)
                    }
                    className="text-brand-muted hover:text-red-600 transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-brand-surface border border-brand-muted/10 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-brand-primary mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-brand-muted">
                <span>Subtotal</span>
                <span>₦{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-brand-muted">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t border-brand-muted/10 pt-3 flex justify-between font-semibold text-brand-primary">
                <span>Total</span>
                <span>₦{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-brand-accent text-white text-center py-4 text-sm font-medium mt-6 hover:bg-brand-primary transition-colors"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="block w-full text-center text-sm text-brand-muted hover:text-brand-accent mt-4 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}