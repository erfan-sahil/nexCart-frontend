"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { cn } from "@/lib/utils";

type CountdownTimerProps = {
  target: string;
  className?: string;
};

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-11 flex-col items-center rounded-md bg-primary px-2 py-1 text-primary-foreground">
      <span className="font-mono text-sm leading-none font-semibold tabular-nums sm:text-base">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-0.5 text-[9px] tracking-wide uppercase opacity-80">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer({ target, className }: CountdownTimerProps) {
  const timeLeft = useCountdown(target);

  if (!timeLeft) {
    return (
      <div className={cn("flex items-center gap-1.5", className)} aria-hidden>
        <Unit value={0} label="hrs" />
        <span className="font-semibold text-white/60">:</span>
        <Unit value={0} label="min" />
        <span className="font-semibold text-white/60">:</span>
        <Unit value={0} label="sec" />
      </div>
    );
  }

  const { hours, minutes, seconds, isOver } = timeLeft;

  if (isOver) {
    return (
      <p className={cn("text-sm font-medium text-primary", className)}>
        Deal ended
      </p>
    );
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="mr-1 hidden text-sm text-white/70 sm:inline">
        Ends in
      </span>
      <Unit value={hours} label="hrs" />
      <span className="font-semibold text-white/60">:</span>
      <Unit value={minutes} label="min" />
      <span className="font-semibold text-white/60">:</span>
      <Unit value={seconds} label="sec" />
    </div>
  );
}
