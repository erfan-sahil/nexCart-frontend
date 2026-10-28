import { cn } from "@/lib/utils";

type SectionEmptyProps = {
  message?: string;
  invert?: boolean;
};

export function SectionEmpty({
  message = "No products available right now.",
  invert = false,
}: SectionEmptyProps) {
  return (
    <p
      className={cn(
        "rounded-2xl border border-dashed px-6 py-10 text-center text-sm",
        invert
          ? "border-white/20 text-white/70"
          : "border-border bg-card text-muted-foreground",
      )}
    >
      {message}
    </p>
  );
}
