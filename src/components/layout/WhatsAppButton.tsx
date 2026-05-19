'use client';

import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  // ⚠️ REPLACE THIS with the actual WhatsApp number (include country code, no + sign)
  const phoneNumber = '2348053356264'; // ← CHANGE THIS!
  const message = encodeURIComponent('Hello DPiLOT COLLECTION! I\'m interested in your shoes.');

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={24} />
    </a>
  );
}