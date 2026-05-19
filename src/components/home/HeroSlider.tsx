'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const slides = [
  { image: '/images/slide-1.jpg', alt: 'Slide 1' },
  { image: '/images/slide-2.jpg', alt: 'Slide 2' },
  { image: '/images/slide-3.jpg', alt: 'Slide 3' },
  { image: '/images/slide-4.jpg', alt: 'Slide 4' },
];

export default function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi]);

  return (
    <section className="bg-brand-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-4 py-12 md:py-20">
        {/* Text Column - on mobile appears first */}
        <div className="order-2 md:order-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-brand-primary mb-4 tracking-tight">
            DPiLOT <span className="text-brand-accent">COLLECTION</span>
          </h1>
          <p className="text-brand-muted text-lg max-w-md mx-auto md:mx-0 mb-8">
            Premium footwear, fully boxed and equipped. Step into authenticity.
          </p>
          <Link
            href="/products"
            className="inline-block bg-brand-accent text-white px-8 py-4 font-medium text-sm hover:bg-brand-primary transition-colors"
          >
            Shop Collection
          </Link>
        </div>

        {/* Slider Column */}
        <div className="order-1 md:order-2">
          <div className="overflow-hidden rounded-sm" ref={emblaRef}>
            <div className="flex">
              {slides.map((slide, index) => (
                <div key={index} className="flex-[0_0_100%] relative aspect-[4/3] bg-brand-surface">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === selectedIndex ? 'bg-brand-accent' : 'bg-brand-muted/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}