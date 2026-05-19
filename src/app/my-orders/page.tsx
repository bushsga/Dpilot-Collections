'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Order } from '@/types';

export default function MyOrdersPage() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', email.toLowerCase().trim())
      .order('created_at', { ascending: false });

    setOrders(data || []);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-brand-primary mb-8">Track Your Orders</h1>

      <form onSubmit={handleLookup} className="flex gap-3 mb-8">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          className="flex-1 border border-brand-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-brand-accent bg-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-accent text-white px-6 py-3 text-sm font-medium hover:bg-brand-primary transition-colors disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Look Up'}
        </button>
      </form>

      {searched && (
        <>
          {orders.length === 0 ? (
            <p className="text-brand-muted text-center py-10">No orders found for this email.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order: Order) => (
                <div
                  key={order.id}
                  className="bg-white border border-brand-muted/10 p-6"
                >
                  <div className="flex justify-between mb-3">
                    <span className="text-xs text-brand-muted">
                      Order ID: {order.id.slice(0, 8)}...
                    </span>
                    <span className={`text-xs px-2 py-1 ${
                      order.status === 'paid' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="text-sm space-y-1 mb-3">
                    {(order.items as any[]).map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-brand-primary">
                          {item.product_name} {item.size && `(${item.size})`} x{item.quantity}
                        </span>
                        <span className="text-brand-muted">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 flex justify-between text-sm font-semibold">
                    <span>Total</span>
                    <span>₦{order.total_amount.toLocaleString()}</span>
                  </div>

                  {order.status === 'shipped' && (
                    <p className="mt-3 text-sm text-brand-accent">
                      🚚 Tracking: {order.tracking_number || 'Pending'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}