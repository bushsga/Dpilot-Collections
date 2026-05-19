import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-brand-primary mb-4">Order Placed Successfully!</h1>
        <p className="text-brand-muted mb-8">
          Thank you for your order. We&apos;ll contact you shortly with delivery details.
        </p>
        
        <Link
          href="/products"
          className="inline-block bg-brand-accent text-white px-8 py-3 text-sm font-medium hover:bg-brand-primary transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}