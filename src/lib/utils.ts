import type { Weekday } from "./types";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export const WEEKDAYS: { value: Weekday; label: string; short: string }[] = [
  { value: "mon", label: "Monday", short: "Mon" },
  { value: "tue", label: "Tuesday", short: "Tue" },
  { value: "wed", label: "Wednesday", short: "Wed" },
  { value: "thu", label: "Thursday", short: "Thu" },
  { value: "fri", label: "Friday", short: "Fri" },
  { value: "sat", label: "Saturday", short: "Sat" },
  { value: "sun", label: "Sunday", short: "Sun" },
];

export function weekdayLabel(day: Weekday) {
  return WEEKDAYS.find((d) => d.value === day)?.label ?? day;
}

export function formatRecurrence(days: Weekday[]) {
  if (days.length === 0) return "";
  const ordered = WEEKDAYS.filter((d) => days.includes(d.value));
  if (ordered.length === 1) return `Every ${ordered[0].label}`;
  return `Every ${ordered.map((d) => d.short).join(" · ")}`;
}

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const dateLongFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const timeFmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatDate(iso: string) {
  return dateFmt.format(new Date(iso));
}

export function formatDateLong(iso: string) {
  return dateLongFmt.format(new Date(iso));
}

export function formatTime(iso: string) {
  return timeFmt.format(new Date(iso));
}

export function formatDay(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (sameDay(date, today)) return "Today";
  if (sameDay(date, tomorrow)) return "Tomorrow";
  return dateFmt.format(date);
}

/** Request-time check used by server components (rides have departed?). */
export function isPast(iso: string) {
  return new Date(iso).getTime() < Date.now();
}

export function formatMoney(mad: number) {
  return `${mad} MAD`;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

/** Deterministic avatar hue per user so colors stay stable across renders. */
export function avatarTone(id: string) {
  const tones = [
    "bg-pine-100 text-pine-800",
    "bg-saffron-100 text-saffron-700",
    "bg-pine-700 text-pine-50",
    "bg-pine-200 text-pine-900",
    "bg-saffron-200 text-saffron-700",
  ];
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  return tones[hash % tones.length];
}

export function isAuiEmail(email: string) {
  return /^[a-zA-Z0-9._%+-]+@aui\.ma$/.test(email.trim().toLowerCase());
}

export function memberSince(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function whatsappLink(phone: string, message: string) {
  const digits = phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
  const normalized = digits.startsWith("0")
    ? `212${digits.slice(1)}`
    : digits.startsWith("212")
      ? digits
      : `212${digits}`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function pluralize(n: number, singular: string, plural?: string) {
  return `${n} ${n === 1 ? singular : (plural ?? `${singular}s`)}`;
}
