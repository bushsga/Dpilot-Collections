"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

const slides = [
  {
    image: "/images/slide-1.jpg",
  },
  {
    image: "/images/slide-2.jpg",
  },
  {
    image: "/images/slide-3.jpg",
  },
  {
    image: "/images/slide-4.jpg",
  },
]

export default function HeroSliderCSS() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

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

        {/* Image Slider - Same logic as your working code */}
        <div className="order-1 md:order-2">
          <div className="relative aspect-[4/3] min-h-[280px] md:min-h-[360px] overflow-hidden rounded-sm bg-brand-accent/10">
            {slides.map((slide, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-opacity duration-1000"
                style={{ opacity: index === currentSlide ? 1 : 0 }}
              >
                <Image
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}

            {/* Slide Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  className="h-2 w-8 transition-all"
                  style={{
                    backgroundColor: index === currentSlide ? '#1B3A4B' : 'rgba(107,114,128,0.4)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}