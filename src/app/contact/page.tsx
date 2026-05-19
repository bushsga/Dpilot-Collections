'use client';

import { useState } from 'react';
import { FiSend, FiPhone, FiMail } from 'react-icons/fi';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      // Replace with your actual Formspree endpoint
      const response = await fetch('https://formspree.io/f/xlgvewdn', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setSent(true);
        form.reset();
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-brand-primary mb-4 text-center">
          Contact Us
        </h1>
        <p className="text-brand-muted text-center mb-12">
          Have questions? We&apos;d love to hear from you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="bg-brand-surface border border-brand-muted/10 p-6 text-center">
            <FiPhone className="mx-auto text-brand-accent mb-3" size={24} />
            <h3 className="text-sm font-semibold text-brand-primary mb-1">Phone</h3>
            <p className="text-sm text-brand-muted">+234 805 335 6264</p>
          </div>

          <div className="bg-brand-surface border border-brand-muted/10 p-6 text-center">
            <FiMail className="mx-auto text-brand-accent mb-3" size={24} />
            <h3 className="text-sm font-semibold text-brand-primary mb-1">Email</h3>
            <p className="text-sm text-brand-muted">dpilot241@gmail.com</p>
          </div>

          <div className="bg-brand-surface border border-brand-muted/10 p-6 text-center">
            <FiSend className="mx-auto text-brand-accent mb-3" size={24} />
            <h3 className="text-sm font-semibold text-brand-primary mb-1">WhatsApp</h3>
            <p className="text-sm text-brand-muted">Join our WhatsApp group</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-12 bg-brand-surface border border-brand-muted/10 p-8">
          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-brand-primary mb-2">Message Sent!</h3>
              <p className="text-brand-muted">We&apos;ll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-semibold text-brand-primary mb-4">Send us a message</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-primary mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full border border-brand-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-brand-accent bg-brand-secondary"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-primary mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full border border-brand-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-brand-accent bg-brand-secondary"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-primary mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  className="w-full border border-brand-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-brand-accent bg-brand-secondary"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-primary mb-2">Message *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="w-full border border-brand-muted/30 px-4 py-3 text-sm focus:outline-none focus:border-brand-accent bg-brand-secondary resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-brand-accent text-white px-8 py-3 text-sm font-medium hover:bg-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}