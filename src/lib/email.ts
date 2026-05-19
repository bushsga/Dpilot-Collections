'use client';

import emailjs from '@emailjs/browser';

export const sendOrderEmails = async (orderData: {
  orderId: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  items_list: string;
  total_amount: number;
}) => {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const customerTemplateId = process.env.NEXT_PUBLIC_EMAILJS_CUSTOMER_TEMPLATE_ID;
  const adminTemplateId = process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  console.log('EmailJS Config:', {
    serviceId: serviceId ? '✓' : '✗ MISSING',
    customerTemplateId: customerTemplateId ? '✓' : '✗ MISSING',
    adminTemplateId: adminTemplateId ? '✓' : '✗ MISSING',
    publicKey: publicKey ? '✓' : '✗ MISSING',
  });

  if (!serviceId || !customerTemplateId || !adminTemplateId || !publicKey) {
    throw new Error('EmailJS configuration missing. Check your .env.local file.');
  }

  // Send confirmation to customer
  try {
    const customerResult = await emailjs.send(
      serviceId,
      customerTemplateId,
      {
        customer_name: orderData.customer_name,
        order_id: orderData.orderId,
        total_amount: orderData.total_amount.toLocaleString(),
        items_list: orderData.items_list,
        to_email: orderData.customer_email,
      },
      publicKey
    );
    console.log('Customer email sent:', customerResult.status, customerResult.text);
  } catch (err: any) {
    console.error('Customer email failed:', err);
    throw new Error(`Customer email failed: ${err?.text || err?.message || 'Unknown error'}`);
  }

  // Send alert to admin
  try {
    const adminResult = await emailjs.send(
      serviceId,
      adminTemplateId,
      {
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        customer_address: orderData.customer_address,
        order_id: orderData.orderId,
        total_amount: orderData.total_amount.toLocaleString(),
        items_list: orderData.items_list,
        to_email: 'admin@dpilotcollection.com', // ← CHANGE THIS to your client's email
      },
      publicKey
    );
    console.log('Admin email sent:', adminResult.status, adminResult.text);
  } catch (err: any) {
    console.error('Admin email failed:', err);
    throw new Error(`Admin email failed: ${err?.text || err?.message || 'Unknown error'}`);
  }
};