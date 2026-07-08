import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CarFront,
  GraduationCap,
  HandCoins,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { CITIES, POPULAR_ROUTES, priceHint } from "@/lib/cities";
import { ButtonLink, Card } from "@/components/ui";
import { ZelligePattern } from "@/components/pattern";

const RIDER_STEPS: [string, string][] = [
  ["Search your route", "Filter rides by where you're going and when. Every driver you see is a verified AUI student."],
  ["Request a seat", "The driver accepts your request — only then do you two swap phone numbers, straight into WhatsApp."],
  ["Pay cash in the car", "No cards, no apps, no fees. Hand the driver their share and rate each other afterwards."],
];

const DRIVER_STEPS: [string, string][] = [
  ["Post your ride in a minute", "Set your route, departure time, free seats and a fair price. Driving every Friday? Mark it recurring."],
  ["Choose your passengers", "You see each requester's profile and rating before accepting. Your seats, your call."],
  ["Cover your fuel", "Three passengers to Casa at 150 MAD each roughly pays the tank and tolls. Driving home stops costing you."],
];

const SAFETY_POINTS = [
  { icon: BadgeCheck, title: "Closed to outsiders", body: "You can't even make an account without a live @aui.ma inbox. Every driver and passenger is one of us." },
  { icon: Star, title: "Reputation follows everyone", body: "Two-way ratings after each trip. A driver who speeds or a passenger who no-shows carries that score." },
  { icon: MessageCircle, title: "Numbers stay private", body: "Phones are exchanged only after a driver accepts a request — never posted publicly." },
  { icon: HandCoins, title: "No money in the app", body: "Cash between students, agreed upfront on the ride listing. Nobody's card details, nobody's wallet app." },
];

const FAQ: [string, string][] = [
  ["How much does it cost to use?", "Nothing. The platform is free and takes no commission — the price on a ride goes to the driver, in cash, to cover fuel and tolls."],
  ["I don't have a car. Is this still for me?", "Absolutely — most people here are passengers. You can also post a ride request, so drivers heading your way can find you."],
  ["How do I know a driver is trustworthy?", "Every account belongs to a verified @aui.ma inbox, and after each trip passengers rate drivers (and drivers rate passengers). Check the profile before you book."],
  ["What if my plans change?", "Cancel your seat from My Trips as early as you can — drivers count on you. Repeated no-shows sink your passenger rating."],
  ["Is this an official AUI service?", "No — it's an independent student initiative. It isn't operated or endorsed by Al Akhawayn University."],
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-pine-900">
        <ZelligePattern className="text-pine-700/30" id="hero-zellige" />
        <div
          aria-hidden
          className="absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-pine-700/40 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-pine-600/60 bg-pine-800/60 px-3.5 py-1.5 text-xs font-medium text-pine-100">
              <GraduationCap size={14} />
              Only for AUI students — verified by @aui.ma email
            </p>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-paper sm:text-6xl">
              Going home this weekend?
              <br />
              <span className="text-saffron-300">Ride with your campus.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-pine-200 sm:text-lg">
              AUI Carpool matches students driving out of Ifrane with students
              who need a seat. Split the fuel in cash, skip the grand-taxi
              scramble, and travel with people from your own university.
            </p>
          </div>

          <form
            action="/rides"
            className="mt-10 grid gap-3 rounded-2xl border border-pine-700 bg-paper p-4 shadow-lift sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end"
          >
            <div>
              <label htmlFor="from" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Leaving from
              </label>
              <select
                id="from"
                name="from"
                defaultValue="Ifrane"
                className="w-full rounded-xl border border-line-strong bg-white px-3.5 py-2.5 text-sm"
              >
                <option value="">Anywhere</option>
                {CITIES.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="to" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Going to
              </label>
              <select
                id="to"
                name="to"
                defaultValue=""
                className="w-full rounded-xl border border-line-strong bg-white px-3.5 py-2.5 text-sm"
              >
                <option value="">Anywhere</option>
                {CITIES.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Date
              </label>
              <input
                id="date"
                type="date"
                name="date"
                className="w-full rounded-xl border border-line-strong bg-white px-3.5 py-2.5 text-sm"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-pine-700 px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-pine-800"
            >
              <Search size={16} />
              Search rides
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-pine-200">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-saffron-300" /> Every account is a real AUI student
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Banknote size={15} className="text-saffron-300" /> Cash only, split fairly
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star size={15} className="text-saffron-300" /> Drivers and passengers rate each other
            </span>
          </div>
        </div>
      </section>

      {/* Popular routes */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              The routes everyone takes
            </h2>
            <p className="mt-2 text-sm text-ink-soft sm:text-base">
              Typical prices per seat — usually less than a grand taxi, always
              with someone from campus.
            </p>
          </div>
          <ButtonLink href="/rides" variant="ghost" className="hidden shrink-0 sm:inline-flex">
            All rides <ArrowRight size={16} />
          </ButtonLink>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_ROUTES.map(({ from, to, note }) => {
            const hint = priceHint(from, to);
            return (
              <Link
                key={`${from}-${to}`}
                href={`/rides?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`}
                className="group rounded-2xl border border-line bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-pine-300 hover:shadow-lift"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <MapPin size={15} className="text-pine-600" />
                  {from}
                  <ArrowRight size={14} className="text-ink-faint transition-transform group-hover:translate-x-0.5" />
                  {to}
                </div>
                <p className="mt-2 text-xs text-ink-faint">{note}</p>
                {hint && (
                  <p className="mt-4 font-display text-lg font-semibold text-pine-800">
                    {hint.low}–{hint.high} MAD
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-paper-dim/60">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            How it works
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-pine-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-pine-800">
                <Users size={13} /> Need a seat
              </p>
              <ol className="mt-6 space-y-6">
                {RIDER_STEPS.map(([title, body], i) => (
                  <li key={title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pine-700 font-display text-sm font-semibold text-paper">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-ink">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-saffron-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-saffron-700">
                <CarFront size={13} /> Have a car
              </p>
              <ol className="mt-6 space-y-6">
                {DRIVER_STEPS.map(([title, body], i) => (
                  <li key={title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-saffron-400 font-display text-sm font-semibold text-pine-950">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-ink">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-pine-900 px-6 py-12 sm:px-12 sm:py-16">
          <ZelligePattern className="text-pine-700/30" id="safety-zellige" />
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h2 className="font-display text-2xl font-semibold text-paper sm:text-3xl">
                Safety isn't a feature here.
                <br />
                It's the whole point.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-pine-200 sm:text-base">
                Shared taxis with strangers, midnight buses, hitching a ride
                from a Facebook post — that's the alternative. AUI Carpool
                keeps every trip inside the campus community.
              </p>
              <ButtonLink href="/safety" variant="secondary" className="mt-7">
                Read the safety rules <ArrowRight size={16} />
              </ButtonLink>
            </div>
            <ul className="space-y-4">
              {SAFETY_POINTS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4 rounded-2xl border border-pine-700/60 bg-pine-800/50 p-4">
                  <Icon size={20} className="mt-0.5 shrink-0 text-saffron-300" />
                  <div>
                    <h3 className="text-sm font-semibold text-paper">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-pine-200">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ + CTA */}
      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-24">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Fair questions
        </h2>
        <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white shadow-card">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group px-5 py-4 open:bg-paper-dim/50">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {q}
                <span className="text-ink-faint transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{a}</p>
            </details>
          ))}
        </div>

        <Card className="mt-12 flex flex-col items-center gap-4 px-6 py-10 text-center">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Next weekend, don't overpay to get home.
          </h2>
          <p className="max-w-md text-sm text-ink-soft">
            Sign in with your @aui.ma email and see who's already driving your
            way.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/rides" size="lg">
              Find a ride
            </ButtonLink>
            <ButtonLink href="/offer" variant="secondary" size="lg">
              Offer a ride
            </ButtonLink>
          </div>
        </Card>
      </section>
    </div>
  );
}
