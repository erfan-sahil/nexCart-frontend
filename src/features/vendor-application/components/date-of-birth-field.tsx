"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { Field } from "./fields";

const earliestBirthday = new Date(1900, 0, 1);

function latestAdultBirthday(today = new Date()) {
  return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
}

export function parseDateOnly(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return undefined;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return date;
}

function formatDateOnly(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

type DateOfBirthFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function DateOfBirthField({
  value,
  onChange,
  error,
}: DateOfBirthFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? parseDateOnly(value) : undefined;
  const latest = latestAdultBirthday();

  return (
    <Field label="Date of birth" error={error} hint="You must be 18 or older.">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          type="button"
          aria-invalid={Boolean(error)}
          className={cn(
            "flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 text-left text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive",
            !selected && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
          {selected ? format(selected, "PPP") : "Select date of birth"}
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            required
            selected={selected}
            defaultMonth={selected ?? latest}
            captionLayout="dropdown"
            startMonth={earliestBirthday}
            endMonth={latest}
            disabled={[{ before: earliestBirthday }, { after: latest }]}
            onSelect={(date) => {
              onChange(formatDateOnly(date));
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
