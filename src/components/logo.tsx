import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      className={cn("h-9 w-9", className)}
    >
      <rect width="40" height="40" rx="12" className="fill-pine-700" />
      {/* winding mountain road from origin dot to destination pin */}
      <path
        d="M11 30c7 0 4.5-10 11-10"
        stroke="#F3DDAB"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="0.2 4.4"
      />
      <circle cx="11" cy="30" r="3" fill="#FAF7F1" />
      <path
        d="M27 8.5c3.6 0 6.5 2.9 6.5 6.5 0 4.9-6.5 10.5-6.5 10.5S20.5 19.9 20.5 15c0-3.6 2.9-6.5 6.5-6.5Z"
        fill="#FAF7F1"
      />
      <circle cx="27" cy="15" r="2.6" className="fill-pine-700" />
    </svg>
  );
}

export function Logo({
  href = "/",
  dark = false,
}: {
  href?: string;
  dark?: boolean;
}) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <LogoMark />
      <span
        className={cn(
          "font-display text-lg font-semibold tracking-tight",
          dark ? "text-paper" : "text-pine-900",
        )}
      >
        AUI Carpool
      </span>
    </Link>
  );
}
