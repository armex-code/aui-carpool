import { cn } from "@/lib/utils";

/**
 * Subtle zellige-inspired eight-point star lattice, used as a decorative
 * wash on dark green surfaces. Purely ornamental.
 */
export function ZelligePattern({
  className,
  id = "zellige",
}: {
  className?: string;
  id?: string;
}) {
  return (
    <svg
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <path
            d="M28 6 33 23 50 28 33 33 28 50 23 33 6 28 23 23Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="28" cy="28" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0 0h6M50 0h6M0 56h6M50 56h6" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
