import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({
  rating,
  className,
  size = 14,
}: {
  rating: number;
  className?: string;
  size?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(rating)
              ? "fill-saffron-400 text-saffron-400"
              : "fill-line text-line"
          }
        />
      ))}
    </span>
  );
}

/** Compact "★ 4.9 · 12 rides" line used on cards. */
export function RatingLine({
  avg,
  count,
  label,
  className,
}: {
  avg: number | null;
  count: number;
  label?: string;
  className?: string;
}) {
  if (avg === null || count === 0) {
    return (
      <span className={cn("text-xs text-ink-faint", className)}>
        No ratings yet
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs text-ink-soft", className)}>
      <Star size={13} className="fill-saffron-400 text-saffron-400" />
      <span className="font-semibold text-ink">{avg.toFixed(1)}</span>
      <span>
        · {count} {label ?? "review"}{count === 1 ? "" : "s"}
      </span>
    </span>
  );
}
