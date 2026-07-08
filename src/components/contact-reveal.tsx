"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle, Phone } from "lucide-react";
import { cn, formatPhone } from "@/lib/utils";

/**
 * Contact actions shown once a booking is accepted: WhatsApp deep link
 * (opens WhatsApp Web on laptops) plus an on-demand phone number reveal
 * for calling, texting, or copying.
 */
export function ContactReveal({
  phone,
  whatsappHref,
  whatsappLabel = "Open WhatsApp",
  compact = false,
}: {
  phone: string;
  whatsappHref: string;
  whatsappLabel?: string;
  compact?: boolean;
}) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable (http / old browser): the number is visible
      // and selectable anyway.
    }
  };

  const whatsappClasses = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[#1faa55] font-medium text-white shadow-card transition-colors hover:bg-[#178a45]",
    compact ? "px-3.5 py-2 text-xs" : "w-full px-5 py-2.5 text-sm",
  );

  const numberChip = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border border-line bg-paper-dim/70",
        compact ? "px-2.5 py-1.5" : "justify-center px-4 py-2.5 w-full",
      )}
    >
      <a
        href={`tel:${phone}`}
        className={cn(
          "font-semibold tabular-nums text-ink hover:text-pine-800",
          compact ? "text-xs" : "text-base",
        )}
      >
        {formatPhone(phone)}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy phone number"
        title="Copy number"
        className="rounded-md p-1 text-ink-faint transition-colors hover:bg-pine-100 hover:text-pine-800"
      >
        {copied ? <Check size={14} className="text-pine-700" /> : <Copy size={14} />}
      </button>
    </span>
  );

  const revealButton = (
    <button
      type="button"
      onClick={() => setRevealed(true)}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border border-line-strong bg-white font-medium text-ink transition-colors hover:border-pine-400 hover:text-pine-800",
        compact ? "px-3.5 py-2 text-xs" : "w-full px-5 py-2.5 text-sm",
      )}
    >
      <Phone size={compact ? 13 : 15} />
      Show number
    </button>
  );

  return (
    <div className={cn(compact ? "flex flex-wrap items-center gap-2" : "space-y-2")}>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={whatsappClasses}
      >
        <MessageCircle size={compact ? 14 : 16} />
        {whatsappLabel}
      </a>
      {revealed ? numberChip : revealButton}
    </div>
  );
}
