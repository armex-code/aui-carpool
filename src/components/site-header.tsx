import Link from "next/link";
import { CarFront, Inbox, Search, UserRound } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { Logo } from "./logo";
import { Avatar } from "./avatar";
import { ButtonLink } from "./ui";

const NAV = [
  { href: "/rides", label: "Find a ride", icon: Search },
  { href: "/requests", label: "Ride requests", icon: Inbox },
  { href: "/trips", label: "My trips", icon: CarFront },
];

export async function SiteHeader() {
  const profile = await getCurrentProfile();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-pine-100/60 hover:text-pine-900"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <ButtonLink href="/offer" variant="secondary" size="sm" className="hidden sm:inline-flex">
              Offer a ride
            </ButtonLink>
            {profile ? (
              <Link
                href="/settings"
                title="Your profile & settings"
                className="rounded-full outline-offset-2 focus-visible:outline-2 focus-visible:outline-pine-600"
              >
                <Avatar id={profile.id} name={profile.fullName || profile.email} size="sm" />
              </Link>
            ) : (
              <ButtonLink href="/login" size="sm">
                Log in
              </ButtonLink>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom tabs */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {[...NAV, { href: "/offer", label: "Offer", icon: UserRound }].map(
          ({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-ink-soft hover:text-pine-800"
            >
              <Icon size={19} strokeWidth={1.8} />
              {label}
            </Link>
          ),
        )}
      </nav>
    </>
  );
}
