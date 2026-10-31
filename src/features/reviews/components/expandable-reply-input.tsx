"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { REVIEW_BODY_MAX } from "../constants";

const MIN_VIEWPORT_PX = 36;
const MAX_VIEWPORT_PX = 96;

type ExpandableReplyBoxProps = {
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function ExpandableReplyBox({
  children,
  footer,
  className,
}: ExpandableReplyBoxProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-lg border border-input bg-transparent shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30",
        className,
      )}
    >
      {children}
      {footer ? (
        <div className="flex items-center justify-end gap-1 border-t border-border/70 bg-muted/30 px-2 py-1">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

type ExpandableReplyInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
};

export function ExpandableReplyInput({
  id,
  value,
  onChange,
  placeholder = "Write a reply…",
  disabled,
  className,
  autoFocus,
}: ExpandableReplyInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [viewportHeight, setViewportHeight] = useState(MIN_VIEWPORT_PX);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    element.style.height = "0px";
    const contentHeight = element.scrollHeight;
    element.style.height = `${contentHeight}px`;
    setViewportHeight(
      Math.min(Math.max(contentHeight, MIN_VIEWPORT_PX), MAX_VIEWPORT_PX),
    );
  }, [value]);

  return (
    <ScrollArea
      className={cn("w-full", className)}
      style={{ height: viewportHeight }}
    >
      <Textarea
        ref={ref}
        id={id}
        value={value}
        disabled={disabled}
        rows={1}
        maxLength={REVIEW_BODY_MAX}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        autoFocus={autoFocus}
        className="min-h-9 resize-none overflow-hidden rounded-none border-0 bg-transparent py-2 shadow-none focus-visible:ring-0 dark:bg-transparent"
      />
    </ScrollArea>
  );
}
