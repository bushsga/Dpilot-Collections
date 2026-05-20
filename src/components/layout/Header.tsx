'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiShoppingCart, FiMenu, FiX, FiShoppingBag, FiPackage, FiPhone } from 'react-icons/fi';
import { useCart } from '@/hooks/useCart';

const Header = () => {
  const { totalItems } = useCart();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-brand-surface border-b border-brand-muted/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-brand-primary flex-shrink-0">
          DPiLOT <span className="text-brand-accent">COLLECTION</span>
        </Link>

        {/* Desktop Navigation - WITH ICONS */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-primary transition-colors"
          >
            <FiShoppingBag size={16} />
            <span>Shop</span>
          </Link>
          <Link
            href="/my-orders"
            className="flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-primary transition-colors"
          >
            <FiPackage size={16} />
            <span>Orders</span>
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-primary transition-colors"
          >
            <FiPhone size={16} />
            <span>Contact</span>
          </Link>
          <Link href="/cart" className="relative text-brand-primary">
            <FiShoppingCart size={20} />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile: Cart + Hamburger */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/cart" className="relative text-brand-primary">
            <FiShoppingCart size={20} />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-brand-primary p-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="bg-brand-surface w-64 ml-auto h-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col py-4">
              <Link
                href="/products"
                onClick={handleNavClick}
                className="flex items-center gap-3 px-6 py-4 text-sm text-brand-primary hover:bg-brand-secondary transition-colors border-b border-brand-muted/5"
              >
                <FiShoppingBag size={18} />
                Shop
              </Link>
              <Link
                href="/my-orders"
                onClick={handleNavClick}
                className="flex items-center gap-3 px-6 py-4 text-sm text-brand-primary hover:bg-brand-secondary transition-colors border-b border-brand-muted/5"
              >
                <FiPackage size={18} />
                Orders
              </Link>
              <Link
                href="/contact"
                onClick={handleNavClick}
                className="flex items-center gap-3 px-6 py-4 text-sm text-brand-primary hover:bg-brand-secondary transition-colors border-b border-brand-muted/5"
              >
                <FiPhone size={18} />
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;