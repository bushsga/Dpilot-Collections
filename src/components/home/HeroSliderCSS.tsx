"use client"
import Link from 'next/link';

const slides = [
  { image: '/images/slide-1.jpg', alt: 'Slide 1' },
  { image: '/images/slide-2.jpg', alt: 'Slide 2' },
  { image: '/images/slide-3.jpg', alt: 'Slide 3' },
  { image: '/images/slide-4.jpg', alt: 'Slide 4' },
];

// Double the slides so the loop is seamless (no reverse scroll)
const allSlides = [...slides, ...slides];

export default function HeroSliderCSS() {
  return (
    <section className="bg-brand-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-4 py-12 md:py-20">
        {/* Text Column */}
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

        {/* CSS-Only Slider */}
        <div className="order-1 md:order-2">
<style jsx>{`
  @keyframes slideAnimation {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }
  .slider-track {
    display: flex;
    width: 800%;
    animation: slideAnimation 24s linear infinite;
  }
  .slider-track:hover {
    animation-play-state: paused;
  }
  .slide-item {
    width: 12.5%;
    flex-shrink: 0;
  }
`}</style>
          <div className="overflow-hidden rounded-sm">
            <div className="slider-track">
              {allSlides.map((slide, index) => (
                <div key={index} className="slide-item relative aspect-[4/3] bg-brand-accent/10">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover"
                    loading={index < 4 ? 'eager' : 'lazy'}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-brand-accent/5"><span class="text-brand-primary/30 font-bold text-4xl">DPiLOT</span></div>';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}