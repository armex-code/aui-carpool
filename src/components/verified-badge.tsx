import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-pine-100 px-2 py-0.5 text-[11px] font-semibold text-pine-800",
        className,
      )}
      title="Signed up with a verified @aui.ma email"
    >
      <ShieldCheck size={12} />
      AUI verified
    </span>
  );
}
