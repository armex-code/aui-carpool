import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

/** Origin → destination with a dotted connector, the visual spine of a ride. */
export function RouteLine({
  from,
  to,
  fromDetail,
  toDetail,
  compact = false,
  className,
}: {
  from: string;
  to: string;
  fromDetail?: string | null;
  toDetail?: string | null;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("min-w-0", compact ? "" : "flex-1")}>
        <p className={cn("truncate font-semibold text-ink", compact ? "text-sm" : "text-base")}>
          {from}
        </p>
        {!compact && fromDetail && (
          <p className="truncate text-xs text-ink-faint">{fromDetail}</p>
        )}
      </div>
      <div className="route-dots relative h-2 min-w-8 flex-1">
        <span className="absolute -left-0.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border-2 border-pine-600 bg-white" />
        <MapPin
          size={14}
          className="absolute -right-1 top-1/2 -translate-y-1/2 fill-paper text-pine-700"
        />
      </div>
      <div className={cn("min-w-0 text-right", compact ? "" : "flex-1")}>
        <p className={cn("truncate font-semibold text-ink", compact ? "text-sm" : "text-base")}>
          {to}
        </p>
        {!compact && toDetail && (
          <p className="truncate text-xs text-ink-faint">{toDetail}</p>
        )}
      </div>
    </div>
  );
}
