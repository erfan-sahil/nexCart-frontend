"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { cn } from "@/lib/utils";

type CountdownTimerProps = {
  target: string;
  className?: string;
};

const units = [
  { key: "hours", label: "Hrs" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
] as const;

function Clock({
  hours,
  minutes,
  seconds,
  className,
  pending = false,
}: {
  hours: number;
  minutes: number;
  seconds: number;
  className?: string;
  pending?: boolean;
}) {
  const values = { hours, minutes, seconds };

  return (
    <div
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15",
        className,
      )}
      role="timer"
      aria-hidden={pending || undefined}
      aria-label={
        pending
          ? undefined
          : `Ends in ${hours} hours ${minutes} minutes ${seconds} seconds`
      }
    >
      {units.map((unit, index) => (
        <div
          key={unit.key}
          className={cn(
            "flex min-w-14 flex-col items-center px-3 py-2",
            index > 0 && "border-l border-white/15",
          )}
        >
          <span className="font-mono text-xl leading-none font-semibold text-primary tabular-nums">
            {String(values[unit.key]).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] font-medium tracking-[0.14em] text-white/55 uppercase">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CountdownTimer({ target, className }: CountdownTimerProps) {
  const timeLeft = useCountdown(target);

  if (!timeLeft) {
    return (
      <Clock hours={0} minutes={0} seconds={0} pending className={className} />
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
    <Clock
      hours={hours}
      minutes={minutes}
      seconds={seconds}
      className={className}
    />
  );
}
