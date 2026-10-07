import { countries, type Country } from "./countries";

export const DEFAULT_COUNTRY =
  countries.find((country) => country.iso === "BD") ?? countries[0];

const countriesByDialLength = [...countries].sort(
  (left, right) => right.dial.length - left.dial.length,
);

const preferredOrder = ["US", "GB", "RU", "AU", "NO", "FI", "ZA"];

export function countryFlag(iso: string) {
  return [...iso.toUpperCase()]
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

export function formatDial(dial: string) {
  return `+${dial}`;
}

export function nationalLimit(country: Country) {
  return Math.max(4, 15 - country.dial.length);
}

export function toInternational(country: Country, national: string) {
  const digits = national.replace(/\D/g, "").replace(/^0+/, "");
  if (!digits) return "";
  return `+${country.dial}${digits}`;
}

export function splitInternational(value: string, current?: Country) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return { country: current ?? DEFAULT_COUNTRY, national: "" };
  }

  if (current && digits.startsWith(current.dial)) {
    return {
      country: current,
      national: digits.slice(current.dial.length),
    };
  }

  const matches = countriesByDialLength.filter((country) =>
    digits.startsWith(country.dial),
  );

  if (matches.length === 0) {
    return { country: current ?? DEFAULT_COUNTRY, national: digits };
  }

  const longest = matches[0]?.dial.length ?? 0;
  const tied = matches.filter((country) => country.dial.length === longest);
  const country =
    preferredOrder
      .map((iso) => tied.find((item) => item.iso === iso))
      .find((item) => item !== undefined) ??
    tied[0] ??
    DEFAULT_COUNTRY;

  return { country, national: digits.slice(country.dial.length) };
}

export function countryMatches(country: Country, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const dialQuery = normalized.replace(/^\+/, "").replace(/\s/g, "");

  return (
    country.name.toLowerCase().includes(normalized) ||
    country.iso.toLowerCase() === normalized ||
    (dialQuery.length > 0 && country.dial.startsWith(dialQuery))
  );
}
