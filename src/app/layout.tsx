import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'DPiLOT COLLECTION | Premium Footwear',
  description: 'Original quality footwear, fully boxed and equipped.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-brand-secondary">
        <Script
          src="https://cdn.jsdelivr.net/npm/@ungap/custom-elements@1.1.0/min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver%2CResizeObserver%2Csmoothscroll"
          strategy="beforeInteractive"
        />

        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="bg-brand-primary text-white text-center py-6 text-sm">
              © {new Date().getFullYear()} DPiLOT COLLECTION. All rights reserved.
            </footer>

            {/* WhatsApp Floating Button */}
            {/*<WhatsAppButton />*/}
          </CartProvider>
        </AuthProvider>

        {/* Cloudinary Upload Widget */}
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="lazyOnload"
        />

        {/* Paystack Inline Script */}
        <Script
          src="https://js.paystack.co/v2/inline.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}