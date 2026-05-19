'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const testimonials = [
  { name: 'Amina', text: 'Best quality shoes! Fast delivery too.', rating: 5 },
  { name: 'Chidi', text: 'My Timbs came fully boxed and perfect.', rating: 5 },
  { name: 'Fola', text: 'Original LV sneakers – I’m impressed.', rating: 5 },
  { name: 'Tunde', text: 'Great customer service. Will buy again!', rating: 5 },
  { name: 'Ngozi', text: 'The slides are so comfortable. Thank you!', rating: 5 },
  { name: 'Emeka', text: 'Luxury shoes at a fair price. Highly recommended.', rating: 5 },
];

export default function TestimonialCarousel() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [Autoplay({ delay: 3500 })]
  );

  return (
    <section className="py-20 bg-brand-surface">
      <h2 className="text-2xl font-bold text-brand-primary text-center mb-12">
        What Our Customers Say
      </h2>
      <div className="overflow-hidden max-w-5xl mx-auto px-4" ref={emblaRef}>
        <div className="flex gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] bg-brand-secondary border border-brand-muted/10 p-6"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-brand-primary text-sm italic mb-4">&ldquo;{t.text}&rdquo;</p>
              <p className="text-brand-accent text-sm font-semibold">– {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}