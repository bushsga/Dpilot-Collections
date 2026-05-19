import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { reference, orderId } = await request.json();

    console.log('Verifying payment:', { reference, orderId });

    if (!reference || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Missing reference or orderId' },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await paystackResponse.json();

    console.log('Paystack verification response:', data);

    if (!paystackResponse.ok) {
      console.error('Paystack API error:', data);
      return NextResponse.json(
        { success: false, error: data.message || 'Paystack verification failed' },
        { status: 400 }
      );
    }

    if (data.status && data.data.status === 'success') {
      // Update order status to 'paid'
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId)
        .eq('paystack_reference', reference);

      if (updateError) {
        console.error('Order update error:', updateError);
        return NextResponse.json(
          { success: false, error: 'Failed to update order status' },
          { status: 500 }
        );
      }

      // Decrease stock
      try {
        // Get the order items
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
      } catch (stockError) {
        console.error('Stock decrease error:', stockError);
        // Don't fail the verification – stock decrease is secondary
      }

      console.log('Payment verified and order updated');
      return NextResponse.json({ success: true });
    }

    // Payment not successful
    return NextResponse.json(
      { success: false, error: `Payment status: ${data.data?.status || 'unknown'}` },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('Verification error:', err);
    return NextResponse.json(
      { success: false, error: `Server error: ${err.message || 'Unknown'}` },
      { status: 500 }
    );
  }
}