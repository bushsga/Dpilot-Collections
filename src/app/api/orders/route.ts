import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('Order request body:', body);

    // Validate required fields
    if (!body.customer_name || !body.customer_email || !body.items || !body.total_amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate a unique Paystack reference
    const paystackRef = `DPILOT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create order in Supabase
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          customer_name: body.customer_name,
          customer_email: body.customer_email,
          customer_phone: body.customer_phone || '',
          customer_address: body.customer_address || '',
          items: body.items,
          total_amount: body.total_amount,
          status: 'pending',
          paystack_reference: paystackRef,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase order creation error:', error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order created but not returned from database' },
        { status: 500 }
      );
    }

    console.log('Order created:', order.id);

    return NextResponse.json({
      orderId: order.id,
      paystackReference: paystackRef,
    });
  } catch (err: any) {
    console.error('Order API error:', err);
    return NextResponse.json(
      { error: `Internal server error: ${err.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}