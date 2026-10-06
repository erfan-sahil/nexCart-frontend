"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { heroSlides } from "@/data/mock";
import { cn } from "@/lib/utils";

export function HeroBanner() {
  const [index, setIndex] = useState(0);
  const slide = heroSlides[index];

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(id);
  }, []);

  const goTo = (next: number) => {
    setIndex((next + heroSlides.length) % heroSlides.length);
  };

  return (
    <section aria-roledescription="carousel" aria-label="Featured">
      <div className="grid items-center lg:grid-cols-2">
        <div className="order-1 px-4 pt-5 sm:px-6 sm:pt-6 lg:order-2 lg:py-10 lg:pr-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] lg:pl-2">
          <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-muted shadow-[0_24px_50px_-28px_rgba(42,18,24,0.45)] ring-1 ring-border sm:aspect-[16/10] lg:aspect-[5/4] lg:max-h-[min(34rem,70vh)]">
              {heroSlides.map((item, slideIndex) => (
                <Image
                  key={item.id}
                  src={item.image}
                  alt=""
                  fill
                  priority={slideIndex === 0}
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className={cn(
                    "object-cover object-center transition-opacity duration-700",
                    slideIndex === index
                      ? "opacity-100"
                      : "pointer-events-none opacity-0",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="order-2 flex items-center lg:order-1">
          <div className="w-full px-4 py-10 sm:px-6 sm:py-14 lg:py-20 lg:pr-16 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            <p className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">
              {slide.eyebrow}
            </p>
            <h1 className="mt-4 max-w-xl text-4xl leading-[0.98] text-foreground sm:text-5xl lg:text-6xl">
              {slide.title}
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
              {slide.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={slide.href}
                className="auth-orange-button inline-flex h-12 items-center px-6"
              >
                {slide.ctaLabel}
              </Link>
              <Link
                href="/stores"
                className="inline-flex h-12 items-center rounded-full border border-foreground/20 px-6 text-sm font-semibold text-foreground transition-colors duration-500 hover:border-primary hover:text-primary"
              >
                Browse stores
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={() => goTo(index - 1)}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={() => goTo(index + 1)}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
              <p className="text-sm font-medium text-muted-foreground tabular-nums">
                <span className="text-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="px-1">/</span>
                {String(heroSlides.length).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
