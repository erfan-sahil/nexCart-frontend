import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <article
      aria-hidden
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="relative bg-surface-muted">
        <Skeleton className="aspect-square w-full rounded-none" />
        <Skeleton className="absolute top-2 right-2 size-8 rounded-full" />
      </div>

      <div className="flex flex-1 flex-col gap-2 bg-card p-3">
        <div className="inline-flex min-w-0 items-center gap-1.5">
          <Skeleton className="size-5 shrink-0 rounded-full" />
          <Skeleton className="h-2.5 w-16" />
        </div>

        <div className="flex h-10 flex-col justify-center gap-1">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>

        <div className="flex h-[16.5px] items-center">
          <Skeleton className="h-3 w-16" />
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/80 pt-2.5">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="size-8 shrink-0 rounded-full" />
        </div>
      </div>
    </article>
  );
}
