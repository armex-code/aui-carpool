import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "whatsapp";
type ButtonSize = "sm" | "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine-600 disabled:opacity-50 disabled:pointer-events-none";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-pine-700 text-paper hover:bg-pine-800 shadow-card",
  secondary:
    "bg-white text-ink border border-line-strong hover:border-pine-400 hover:text-pine-800",
  ghost: "text-pine-800 hover:bg-pine-100/60",
  danger: "bg-white text-red-700 border border-red-200 hover:bg-red-50",
  whatsapp: "bg-[#1faa55] text-white hover:bg-[#178a45] shadow-card",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "text-sm px-3.5 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-6 py-3",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: React.ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <Link
      href={href}
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    />
  );
}

type BadgeTone = "green" | "amber" | "red" | "neutral" | "paper" | "rose";

const badgeTones: Record<BadgeTone, string> = {
  green: "bg-pine-100 text-pine-800",
  amber: "bg-saffron-100 text-saffron-700",
  red: "bg-red-50 text-red-700",
  neutral: "bg-paper-dim text-ink-soft",
  paper: "bg-white/15 text-paper",
  rose: "bg-rose-50 text-rose-700",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        badgeTones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-white shadow-card",
        className,
      )}
      {...props}
    />
  );
}

const fieldBase =
  "w-full rounded-xl border border-line-strong bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-pine-500 focus:outline-2 focus:outline-pine-200 disabled:bg-paper-dim";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...props} />;
}

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldBase, "appearance-none", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, "min-h-24", className)} {...props} />;
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-sm font-medium text-ink", className)}
      {...props}
    />
  );
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs text-ink-faint">{children}</p>;
}

export function FormError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      {children}
    </p>
  );
}

export function Notice({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p className="rounded-xl border border-pine-200 bg-pine-50 px-4 py-3 text-sm text-pine-900">
      {children}
    </p>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line-strong bg-paper-dim/60 px-6 py-14 text-center">
      <h3 className="font-display text-lg text-ink">{title}</h3>
      {children && (
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">{children}</p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
