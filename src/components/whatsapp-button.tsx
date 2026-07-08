import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function WhatsAppButton({
  href,
  label = "Open WhatsApp",
  className,
}: {
  href: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1faa55] px-5 py-2.5 text-sm font-medium text-white shadow-card transition-colors hover:bg-[#178a45]",
        className,
      )}
    >
      <MessageCircle size={16} />
      {label}
    </a>
  );
}
