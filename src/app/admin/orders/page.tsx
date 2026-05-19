'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Order } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setOrders(data as Order[]);
    setLoading(false);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      setOrders((prev: Order[]) =>
        prev.map((o: Order) => (o.id === orderId ? { ...o, status: newStatus as Order['status'] } : o))
      );
    }
  };

  const handleTrackingUpdate = async (orderId: string, trackingNumber: string) => {
    const { error } = await supabase
      .from('orders')
      .update({
        tracking_number: trackingNumber,
        status: 'shipped',
      })
      .eq('id', orderId);

    if (!error) {
      setOrders((prev: Order[]) =>
        prev.map((o: Order) =>
          o.id === orderId
            ? { ...o, tracking_number: trackingNumber, status: 'shipped' }
            : o
        )
      );
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    shipped: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-200 text-green-800',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-primary mb-8">
        Orders ({orders.length})
      </h1>

      {loading ? (
        <p className="text-brand-muted">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brand-muted text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: Order) => (
            <div
              key={order.id}
              className="bg-white border border-brand-muted/10 p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-brand-primary">
                    {order.customer_name}
                  </p>
                  <p className="text-xs text-brand-muted mt-1">
                    {order.customer_email} • {order.customer_phone}
                  </p>
                  <p className="text-xs text-brand-muted mt-1">
                    Ref: {order.paystack_reference || 'N/A'}
                  </p>
                  <p className="text-xs text-brand-muted mt-1">
                    Order ID: {order.id.slice(0, 8)}...
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-3 py-1 font-medium ${
                      statusColors[order.status] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                  <span className="text-sm font-bold text-brand-accent">
                    ₦{order.total_amount?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-brand-muted/10 pt-4 mb-4">
                <p className="text-xs font-medium text-brand-muted mb-2">ITEMS</p>
                <div className="space-y-2">
                  {(order.items as any[]).map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-brand-primary">
                        {item.product_name}
                        {item.color_name && ` (${item.color_name})`}
                        {item.size && ` - Size: ${item.size}`} x{item.quantity}
                      </span>
                      <span className="text-brand-muted">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="border-t border-brand-muted/10 pt-4 mb-4">
                <p className="text-xs font-medium text-brand-muted mb-1">DELIVERY ADDRESS</p>
                <p className="text-sm text-brand-primary">{order.customer_address}</p>
              </div>

              {/* Tracking Number */}
              {order.status === 'paid' && (
                <div className="border-t border-brand-muted/10 pt-4 mb-4">
                  <p className="text-xs font-medium text-brand-muted mb-2">
                    ADD TRACKING NUMBER (will mark as shipped)
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter waybill / tracking number"
                      value={trackingInputs[order.id] || order.tracking_number || ''}
                      onChange={(e) =>
                        setTrackingInputs((prev: Record<string, string>) => ({
                          ...prev,
                          [order.id]: e.target.value,
                        }))
                      }
                      className="flex-1 border border-brand-muted/30 px-3 py-2 text-xs focus:outline-none focus:border-brand-accent"
                    />
                    <button
                      onClick={() => {
                        const tracking = trackingInputs[order.id] || '';
                        if (tracking.trim()) {
                          handleTrackingUpdate(order.id, tracking.trim());
                        }
                      }}
                      className="bg-brand-accent text-white px-4 py-2 text-xs font-medium hover:bg-brand-primary transition-colors"
                    >
                      Save & Mark Shipped
                    </button>
                  </div>
                </div>
              )}

              {/* Show tracking if already shipped */}
              {order.status === 'shipped' && order.tracking_number && (
                <div className="border-t border-brand-muted/10 pt-4 mb-4">
                  <p className="text-xs font-medium text-brand-muted mb-1">TRACKING NUMBER</p>
                  <p className="text-sm text-brand-accent font-medium">{order.tracking_number}</p>
                </div>
              )}

              {/* Status Update Buttons */}
              <div className="flex flex-wrap gap-2">
                {['pending', 'paid', 'shipped', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(order.id, status)}
                    className={`text-xs px-3 py-1 border transition-colors ${
                      order.status === status
                        ? 'border-brand-accent bg-brand-accent text-white'
                        : 'border-brand-muted/20 text-brand-muted hover:border-brand-accent'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}