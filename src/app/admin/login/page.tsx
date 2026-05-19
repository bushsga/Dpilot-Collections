'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError);
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-brand-surface p-8 border border-brand-muted/10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-brand-primary">
            DPiLOT <span className="text-brand-accent">COLLECTION</span>
          </h1>
          <p className="text-sm text-brand-muted mt-2">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-primary mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-brand-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-brand-accent transition-colors bg-brand-secondary"
              placeholder="admin@dpilot.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-primary mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-brand-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-brand-accent transition-colors bg-brand-secondary"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-accent text-white py-3 text-sm font-medium hover:bg-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}