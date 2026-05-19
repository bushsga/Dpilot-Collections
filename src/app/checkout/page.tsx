'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { PAYSTACK_PUBLIC_KEY } from '@/lib/paystack';

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: Record<string, any>) => { openIframe: () => void };
    };
  }
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Wait for client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev: typeof formData) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const verifyPayment = async (reference: string, orderId: string) => {
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, orderId }),
      });

      const data = await response.json();

      if (data.success) {
        // Try to send emails (non-critical)
        try {
          const { sendOrderEmails } = await import('@/lib/email');
          const itemsList = items
            .map((item) => `${item.product.name} (Size: ${item.size || 'N/A'}) x${item.quantity}`)
            .join(', ');

          await sendOrderEmails({
            orderId,
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone,
            customer_address: formData.address,
            items_list: itemsList,
            total_amount: totalPrice,
          });
        } catch (emailError) {
          console.error('Email sending failed (non-critical):', emailError);
        }

        clearCart();
        router.push('/checkout/success');
      } else {
        setError(data.error || 'Payment verification failed. Please contact support.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError('Network error during verification. Please contact support.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create order in database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_address: formData.address,
          items: items.map((item) => ({
            product_id: item.product.id,
            product_name: item.product.name,
            variant_id: item.variant?.id || undefined,
            color_name: item.variant?.color_name || undefined,
            size: item.size,
            price: item.product.price,
            quantity: item.quantity,
          })),
          total_amount: totalPrice,
        }),
      });

      const orderData = await response.json();

      if (!response.ok || !orderData.orderId) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Open Paystack payment
      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: formData.email,
        amount: totalPrice * 100,
        currency: 'NGN',
        ref: orderData.paystackReference,
        metadata: {
          order_id: orderData.orderId,
          customer_name: formData.name,
          customer_phone: formData.phone,
        },
        onClose: () => {
          setLoading(false);
          setError('Payment was not completed. You can try again.');
        },
        callback: (response: any) => {
          verifyPayment(response.reference, orderData.orderId);
        },
      });

      handler.openIframe();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  // Don't render anything until client-side hydration is complete
  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-brand-muted">Loading checkout...</p>
      </div>
    );
  }

  // After hydration, check if cart is empty
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-brand-primary mb-4">Your cart is empty</h1>
        <Link href="/products" className="text-brand-accent hover:underline">
          Go shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-primary mb-8 transition-colors"
      >
        <FiArrowLeft />
        Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold text-brand-primary">Checkout</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-brand-primary mb-2">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-brand-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-brand-accent bg-white"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-primary mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-brand-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-brand-accent bg-white"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-primary mb-2">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border border-brand-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-brand-accent bg-white"
              placeholder="08012345678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-primary mb-2">Delivery Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-brand-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-brand-accent bg-white resize-none"
              placeholder="Enter your full delivery address"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-accent text-white py-4 text-sm font-medium hover:bg-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : `Pay ₦${totalPrice.toLocaleString()}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-brand-surface border border-brand-muted/10 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-brand-primary mb-4">Your Order</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.variant?.id || 'novariant'}-${item.size}`} className="flex justify-between text-sm">
                  <span className="text-brand-muted truncate max-w-[200px]">
                    {item.product.name}
                    {item.variant && ` (${item.variant.color_name})`}
                    {item.size && ` - ${item.size}`} x{item.quantity}
                  </span>
                  <span className="text-brand-primary font-medium">
                    ₦{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-muted/10 pt-3">
              <div className="flex justify-between font-semibold text-brand-primary">
                <span>Total</span>
                <span>₦{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}