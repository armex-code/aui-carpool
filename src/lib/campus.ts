import type { RideCategory, RideWithDriver, RolePref } from "./types";

/** Manual trip types a driver can attach to a ride. */
export const TRIP_TYPES: { value: RideCategory; label: string }[] = [
  { value: "event", label: "Campus event" },
  { value: "break", label: "Semester break travel" },
  { value: "exam", label: "Midterm / finals travel" },
];

export function tripTypeLabel(category: RideCategory) {
  return TRIP_TYPES.find((t) => t.value === category)?.label ?? category;
}

/** Profile: how the member mostly uses the platform. */
export const ROLE_PREFS: { value: RolePref; label: string }[] = [
  { value: "passenger", label: "Mostly riding" },
  { value: "driver", label: "Mostly driving" },
  { value: "both", label: "Both" },
];

export function rolePrefLabel(pref: RolePref) {
  return ROLE_PREFS.find((r) => r.value === pref)?.label ?? pref;
}

/** Travel-style tags members can pick for their profile. */
export const VIBE_TAGS = [
  "Quiet ride",
  "Chatty",
  "Music on",
  "Planner",
  "Spontaneous",
  "Early bird",
  "Night owl",
] as const;

/** Quick tags offered on the review form. */
export const REVIEW_TAGS = [
  "On time",
  "Friendly",
  "Safe driving",
  "Comfortable ride",
  "Smooth coordination",
  "Running late",
] as const;

/**
 * Smart filters on the rides page. Derived from the ride itself so they
 * work even when drivers don't tag anything.
 */
export const RIDE_CHIPS: {
  key: string;
  label: string;
  match: (ride: RideWithDriver) => boolean;
}[] = [
  {
    key: "weekend",
    label: "Weekend exits",
    match: (r) =>
      r.fromCity === "Ifrane" &&
      [4, 5, 6].includes(new Date(r.departureAt).getDay()), // Thu-Sat
  },
  {
    key: "sunday",
    label: "Sunday returns",
    match: (r) =>
      r.toCity === "Ifrane" && new Date(r.departureAt).getDay() === 0,
  },
  {
    key: "airport",
    label: "Airport runs",
    match: (r) => r.fromCity.includes("Airport") || r.toCity.includes("Airport"),
  },
  { key: "event", label: "Campus events", match: (r) => r.category === "event" },
  {
    key: "break",
    label: "Break & exams",
    match: (r) => r.category === "break" || r.category === "exam",
  },
  { key: "women", label: "Women only", match: (r) => r.womenOnly },
];

/**
 * High-demand travel windows around the AUI year. Approximate dates:
 * adjust each semester from the official academic calendar.
 */
export const DEMAND_PERIODS: {
  label: string;
  start: string; // YYYY-MM-DD inclusive
  end: string;
  message: string;
}[] = [
  { label: "Return to campus", start: "2026-08-18", end: "2026-08-31", message: "Semester start rush. Rides back to Ifrane fill up fast, book early." },
  { label: "Fall midterms", start: "2026-10-12", end: "2026-10-25", message: "Midterm week. Expect high demand for weekend rides." },
  { label: "Finals & winter break", start: "2026-12-04", end: "2026-12-20", message: "Finals wrap up and residences close. Book your ride home before seats run out." },
  { label: "Spring semester return", start: "2027-01-11", end: "2027-01-22", message: "Spring semester starts. Rides to Ifrane are in demand." },
  { label: "Eid al-Fitr break", start: "2027-02-20", end: "2027-03-02", message: "Eid break travel. Post and book rides early." },
  { label: "Spring break", start: "2027-03-05", end: "2027-03-15", message: "Spring break departures. High demand expected." },
  { label: "Finals & summer departure", start: "2027-05-08", end: "2027-05-25", message: "End of year. Residence checkout rides go fast, book early." },
];

/** The demand period that is active now or starting within ~10 days. */
export function upcomingDemandPeriod(now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  const horizon = new Date(now.getTime() + 10 * 86400_000)
    .toISOString()
    .slice(0, 10);
  return (
    DEMAND_PERIODS.find((p) => p.start <= horizon && p.end >= today) ?? null
  );
}
