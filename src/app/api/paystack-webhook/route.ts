import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // 1. Get the raw request body (as text) so we can verify the signature
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);

    // 2. Check that the request actually came from Paystack
    const paystackSignature = request.headers.get('x-paystack-signature');
    if (!paystackSignature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY!;
    const hash = crypto
      .createHmac('sha512', secret)
      .update(rawBody)
      .digest('hex');

    if (hash !== paystackSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // 3. Only do something when the event is a successful payment
    if (body.event === 'charge.success') {
      const reference = body.data.reference;
      const metadata = body.data.metadata;
      const orderId = metadata?.order_id;

      if (orderId) {
        // Update order status to 'paid'
        await supabaseAdmin
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', orderId)
          .eq('paystack_reference', reference);

        // Also decrease stock (same logic we already have)
        const { data: order } = await supabaseAdmin
          .from('orders')
          .select('items')
          .eq('id', orderId)
          .single();

        if (order?.items) {
          const items = order.items as any[];
          for (const item of items) {
            if (item.variant_id) {
              await supabaseAdmin.rpc('decrease_variant_stock', {
                variant_id: item.variant_id,
                qty: item.quantity,
              });
            } else if (item.product_id) {
              await supabaseAdmin.rpc('decrease_product_stock', {
                product_id: item.product_id,
                qty: item.quantity,
              });
            }
          }
        }
      }
    }

    // 4. Always respond with a 200 so Paystack knows we received it
    return NextResponse.json({ status: 'success' });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Tell Next.js this route runs on the server (Node.js)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Don't cache this route