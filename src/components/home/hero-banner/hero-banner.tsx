"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Container } from "@/components/shared/container";
import { heroSlides } from "@/data/mock";
import { cn } from "@/lib/utils";

export function HeroBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(id);
  }, []);

  const goTo = (next: number) => {
    setIndex((next + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="relative overflow-hidden bg-surface-dark">
      <div className="relative min-h-[420px] sm:min-h-[500px] lg:min-h-[560px]">
        {heroSlides.map((slide, slideIndex) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              slideIndex === index
                ? "opacity-100"
                : "pointer-events-none opacity-0",
            )}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              priority={slideIndex === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20" />
            <Container className="relative flex min-h-[420px] flex-col justify-center py-16 sm:min-h-[500px] lg:min-h-[560px]">
              <p className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">
                {slide.eyebrow}
              </p>
              <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {slide.title}
              </h1>
              <p className="mt-4 max-w-lg text-base text-white/70 sm:text-lg">
                {slide.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={slide.href}
                  className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-hover"
                >
                  {slide.ctaLabel}
                </Link>
                <Link
                  href="/stores"
                  className="inline-flex h-11 items-center rounded-full border border-white/20 px-6 text-sm font-medium text-white hover:border-primary hover:text-primary"
                >
                  Browse stores
                </Link>
              </div>
            </Container>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10">
        <Container className="flex items-center justify-between">
          <div className="pointer-events-auto flex gap-2">
            {heroSlides.map((slide, slideIndex) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${slideIndex + 1}`}
                onClick={() => setIndex(slideIndex)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  slideIndex === index
                    ? "w-8 bg-primary"
                    : "w-3 bg-white/40 hover:bg-white/70",
                )}
              />
            ))}
          </div>
          <div className="pointer-events-auto hidden gap-2 sm:flex">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => goTo(index - 1)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-ink/40 text-white hover:border-primary hover:text-primary"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => goTo(index + 1)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-ink/40 text-white hover:border-primary hover:text-primary"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </Container>
      </div>
    </section>
  );
}
