"use client";

import { Combobox } from "@base-ui/react/combobox";
import { Check, ChevronDown, Search } from "lucide-react";
import { useId, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "cn";

import { countries, type Country } from "../lib/countries";
import {
  countryFlag,
  countryMatches,
  formatDial,
  nationalLimit,
  splitInternational,
  toInternational,
} from "../lib/phone";

type PhoneFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  hint?: string;
  placeholder?: string;
};

export function PhoneField({
  value,
  onChange,
  onBlur,
  error,
  hint = "Optional. Choose a country, then enter your number.",
  placeholder = "1712345678",
}: PhoneFieldProps) {
  const fieldId = useId();
  const descriptionId = `${fieldId}-description`;
  const initial = splitInternational(value);
  const [country, setCountry] = useState(initial.country);
  const [national, setNational] = useState(initial.national);
  const [query, setQuery] = useState("");

  function selectCountry(next: Country) {
    setCountry(next);
    onChange(toInternational(next, national));
  }

  function updateNational(raw: string) {
    const digits = raw
      .replace(/\D/g, "")
      .replace(/^0+/, "")
      .slice(0, nationalLimit(country));
    setNational(digits);
    onChange(toInternational(country, digits));
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={fieldId}>Phone</Label>
      <div
        data-slot="phone-field"
        className={cn(
          "flex h-10 overflow-hidden rounded-lg border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30",
          error &&
            "border-destructive ring-3 ring-destructive/20 dark:border-destructive/50 dark:ring-destructive/40",
        )}
      >
        <Combobox.Root
          items={countries}
          value={country}
          inputValue={query}
          onInputValueChange={setQuery}
          onOpenChange={(open) => {
            if (open) setQuery("");
          }}
          onValueChange={(next) => {
            if (next) selectCountry(next);
          }}
          itemToStringLabel={(item) => item.name}
          isItemEqualToValue={(item, selected) => item.iso === selected.iso}
          filter={countryMatches}
          autoHighlight
        >
          <Combobox.Trigger
            type="button"
            aria-label={`Country, ${country.name}, ${formatDial(country.dial)}`}
            className="group/country flex h-full shrink-0 items-center gap-1.5 border-r border-input pr-2 pl-2.5 text-sm outline-none select-none hover:bg-muted/70 focus-visible:bg-muted data-popup-open:bg-muted"
          >
            <span className="text-base leading-none" aria-hidden>
              {countryFlag(country.iso)}
            </span>
            <span className="font-medium tabular-nums">
              {formatDial(country.dial)}
            </span>
            <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-[popup-open]/country:rotate-180" />
          </Combobox.Trigger>
          <Combobox.Portal>
            <Combobox.Positioner
              side="bottom"
              sideOffset={6}
              align="start"
              className="isolate z-50"
            >
              <Combobox.Popup className="flex max-h-[min(22rem,var(--available-height))] w-[min(20rem,calc(100vw-1.5rem))] origin-(--transform-origin) flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 transition-[transform,opacity] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
                <div className="border-b border-border p-1.5">
                  <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Combobox.Input
                      placeholder="Search countries"
                      aria-label="Search countries"
                      className="h-8 w-full rounded-md bg-muted/50 pr-2.5 pl-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
                    />
                  </div>
                </div>
                <Combobox.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No country found.
                </Combobox.Empty>
                <Combobox.List className="overflow-y-auto overscroll-contain p-1">
                  {(item: Country) => (
                    <Combobox.Item
                      key={item.iso}
                      value={item}
                      className="relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-8 pl-2 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                    >
                      <span className="text-base leading-none" aria-hidden>
                        {countryFlag(item.iso)}
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        {item.name}
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {formatDial(item.dial)}
                      </span>
                      <Combobox.ItemIndicator className="absolute right-2 flex size-4 items-center justify-center">
                        <Check className="size-3.5" />
                      </Combobox.ItemIndicator>
                    </Combobox.Item>
                  )}
                </Combobox.List>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
        <Input
          id={fieldId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder={placeholder}
          value={national}
          maxLength={nationalLimit(country)}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? descriptionId : undefined}
          onBlur={onBlur}
          onChange={(event) => updateNational(event.target.value)}
          className="h-full rounded-none border-0 bg-transparent px-3 shadow-none focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent"
        />
      </div>
      {error ? (
        <p id={descriptionId} className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
