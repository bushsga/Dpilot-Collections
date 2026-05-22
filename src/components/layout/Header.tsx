"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="font-bold">Logo</Link>
          {/* Desktop links */}
          <div className="hidden md:flex space-x-4">
            <Link href="/">Home</Link>
          </div>
          {/* Mobile button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            Menu
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <Link href="/">Home</Link>
        </div>
      )}
    </nav>
  );
}