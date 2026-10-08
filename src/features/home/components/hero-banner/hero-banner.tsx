"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { heroSlides } from "@/data/mock";
import { cn } from "@/lib/utils";

const SLIDE_MS = 6500;

export function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const slide = heroSlides[index];
  const nextSlide = heroSlides[(index + 1) % heroSlides.length];

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length);
    }, SLIDE_MS);

    return () => window.clearInterval(id);
  }, [cycle]);

  const goTo = (next: number) => {
    setIndex((next + heroSlides.length) % heroSlides.length);
    setCycle((current) => current + 1);
  };

  return (
    <section aria-roledescription="carousel" aria-label="Featured">
      <div className="grid items-center lg:grid-cols-2">
        <div className="order-1 px-4 pt-5 sm:px-6 sm:pt-6 lg:order-2 lg:py-10 lg:pr-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] lg:pl-2">
          <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
            <div className="relative mb-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-tl-[1.35rem] rounded-tr-[6.5rem] rounded-br-[1.35rem] rounded-bl-[4rem] bg-muted sm:aspect-[16/10] lg:aspect-[5/4] lg:max-h-[min(32rem,68vh)]">
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

              <button
                type="button"
                aria-label={`Next: ${nextSlide.title}`}
                onClick={() => goTo(index + 1)}
                className="absolute -bottom-2 -left-1 size-[4.75rem] overflow-hidden rounded-full ring-[5px] ring-background transition-transform duration-300 hover:scale-105 sm:size-[5.5rem]"
              >
                <Image
                  src={nextSlide.image}
                  alt=""
                  fill
                  sizes="88px"
                  className="object-cover"
                />
              </button>
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
                className="auth-orange-button inline-flex h-12 items-center px-6 text-[#fff4f2]! hover:text-[#fff4f2]!"
              >
                {slide.ctaLabel}
              </Link>
              <Link
                href="/stores"
                className="inline-flex h-12 items-center rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors duration-300 hover:border-primary hover:bg-brand-soft"
              >
                Browse stores
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-4 sm:mt-16">
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
              <div className="flex items-center gap-2">
                {heroSlides.map((item, slideIndex) => {
                  const active = slideIndex === index;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`Show slide ${slideIndex + 1}`}
                      aria-current={active ? "true" : undefined}
                      onClick={() => goTo(slideIndex)}
                      className={cn(
                        "relative h-1.5 overflow-hidden rounded-full bg-border transition-[width] duration-300",
                        active ? "w-12" : "w-4",
                      )}
                    >
                      {active ? (
                        <span
                          key={`${item.id}-${cycle}`}
                          className="hero-slide-progress absolute inset-0 origin-left bg-primary"
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
