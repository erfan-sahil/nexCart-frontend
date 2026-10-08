"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

import { Container } from "@/components/common";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CATEGORY_ICONS } from "@/constants/category-icons";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

import { CategorySection } from "./category-section";

type CategoryDirectoryProps = {
  categories: Category[];
};

function filterCategories(categories: Category[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return categories;

  return categories.reduce<Category[]>((matched, category) => {
    const nameMatch = category.name.toLowerCase().includes(q);
    const matchingAisles = category.subcategories.filter((aisle) =>
      aisle.name.toLowerCase().includes(q),
    );

    if (nameMatch) {
      matched.push(category);
    } else if (matchingAisles.length > 0) {
      matched.push({ ...category, subcategories: matchingAisles });
    }

    return matched;
  }, []);
}

export function CategoryDirectory({ categories }: CategoryDirectoryProps) {
  const [query, setQuery] = useState("");
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? "");

  const visible = useMemo(
    () => filterCategories(categories, query),
    [categories, query],
  );

  const isFiltering = query.trim().length > 0;
  const [openSlug, setOpenSlug] = useState(categories[0]?.slug ?? "");
  const openSyncKey = isFiltering ? "filtering" : activeSlug;
  const [prevOpenSyncKey, setPrevOpenSyncKey] = useState(openSyncKey);

  if (openSyncKey !== prevOpenSyncKey) {
    setPrevOpenSyncKey(openSyncKey);
    if (!isFiltering && activeSlug) setOpenSlug(activeSlug);
  }

  useEffect(() => {
    if (isFiltering || visible.length === 0) return;

    const sections = visible
      .map((category) => document.getElementById(`category-${category.slug}`))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const next = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (next?.target.id) {
          setActiveSlug(next.target.id.replace("category-", ""));
        }
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0.15, 0.4, 0.7] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isFiltering, visible]);

  return (
    <Container className="py-8 sm:py-10 lg:py-12">
      <div className="mb-6">
        <label htmlFor="category-search" className="sr-only">
          Search categories and aisles
        </label>
        <div className="flex h-11 max-w-xl overflow-hidden rounded-full border border-border bg-surface-muted focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <span className="inline-flex items-center pl-4 text-muted-foreground">
            <Search className="size-4" />
          </span>
          <input
            id="category-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search departments or aisles"
            className="min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="sticky top-40 z-20 -mx-4 mb-6 border-b border-border bg-background/95 px-4 py-2 backdrop-blur lg:hidden">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 no-scrollbar">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.slug];
            const isActive = !isFiltering && activeSlug === category.slug;

            return (
              <a
                key={category.slug}
                href={`#category-${category.slug}`}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "border-primary bg-brand-soft font-medium text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary",
                )}
              >
                {Icon ? <Icon className="size-3.5" /> : null}
                {category.name}
              </a>
            );
          })}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-10">
        <aside className="sticky top-36 hidden lg:block">
          <ScrollArea className="max-h-[calc(100vh-10rem)] rounded-2xl border border-border bg-card">
            <div className="p-3">
              <p className="px-2 pt-1 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Departments
              </p>
              <ul className="space-y-0.5">
                {(isFiltering ? visible : categories).map((category) => {
                  const Icon = CATEGORY_ICONS[category.slug];
                  const isActive = !isFiltering && activeSlug === category.slug;
                  const open = isFiltering || openSlug === category.slug;

                  return (
                    <li key={category.slug}>
                      <div
                        className={cn(
                          "flex items-center rounded-xl pr-1",
                          isActive && "bg-brand-soft",
                        )}
                      >
                        <a
                          href={`#category-${category.slug}`}
                          className={cn(
                            "flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm transition-colors",
                            isActive
                              ? "font-medium text-primary"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {Icon ? <Icon className="size-4 shrink-0" /> : null}
                          <span className="min-w-0 flex-1 truncate">
                            {category.name}
                          </span>
                        </a>
                        <button
                          type="button"
                          aria-expanded={open}
                          aria-label={`${open ? "Hide" : "Show"} ${category.name} aisles`}
                          onClick={() =>
                            setOpenSlug((current) =>
                              current === category.slug ? "" : category.slug,
                            )
                          }
                          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <ChevronDown
                            className={cn(
                              "size-4 transition-transform duration-200",
                              open && "rotate-180",
                            )}
                          />
                        </button>
                      </div>
                      {open ? (
                        <ul className="mt-0.5 mb-1 ml-5 space-y-0.5 border-l border-border py-1 pl-2">
                          {category.subcategories.map((aisle) => (
                            <li key={aisle.id}>
                              <a
                                href={`#aisle-${category.slug}-${aisle.slug}`}
                                className="block truncate rounded-lg px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
                              >
                                {aisle.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          </ScrollArea>
        </aside>

        <div>
          {visible.length > 0 ? (
            visible.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
              <p className="text-base font-medium">No matching aisles</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try another department name, or clear the search.
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-4 text-sm font-medium text-primary hover:text-brand-hover"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
