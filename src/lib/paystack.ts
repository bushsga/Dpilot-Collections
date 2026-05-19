// Client-side Paystack public key
export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

// Server-side Paystack secret key
export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

// Helper to verify a Paystack transaction on the server
export async function verifyPaystackTransaction(reference: string) {
  if (!PAYSTACK_SECRET_KEY) {
    console.error('PAYSTACK_SECRET_KEY is missing!');
    throw new Error('Paystack secret key not configured');
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();
  return data;
}