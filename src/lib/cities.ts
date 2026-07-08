export const CITIES = [
  "Ifrane",
  "Azrou",
  "Fès",
  "Meknès",
  "El Hajeb",
  "Rabat",
  "Casablanca",
  "Marrakech",
  "Tanger",
  "Kénitra",
  "Fès–Saïss Airport",
  "Casablanca Airport (CMN)",
] as const;

export type City = (typeof CITIES)[number];

/** Typical grand-taxi / bus price context so drivers price fairly. */
export const PRICE_HINTS: Record<string, { low: number; high: number }> = {
  "Ifrane→Azrou": { low: 10, high: 20 },
  "Ifrane→Fès": { low: 30, high: 50 },
  "Ifrane→Meknès": { low: 30, high: 50 },
  "Ifrane→El Hajeb": { low: 15, high: 30 },
  "Ifrane→Rabat": { low: 80, high: 130 },
  "Ifrane→Casablanca": { low: 110, high: 170 },
  "Ifrane→Marrakech": { low: 170, high: 250 },
  "Ifrane→Tanger": { low: 150, high: 220 },
  "Ifrane→Kénitra": { low: 80, high: 120 },
  "Ifrane→Fès–Saïss Airport": { low: 60, high: 90 },
  "Ifrane→Casablanca Airport (CMN)": { low: 130, high: 190 },
};

export function priceHint(from: string, to: string) {
  return (
    PRICE_HINTS[`${from}→${to}`] ??
    PRICE_HINTS[`${to}→${from}`] ??
    null
  );
}

export const POPULAR_ROUTES: { from: City; to: City; note: string }[] = [
  { from: "Ifrane", to: "Fès", note: "The weekend classic — about 1 hour" },
  { from: "Ifrane", to: "Meknès", note: "Around 1 hour through El Hajeb" },
  { from: "Ifrane", to: "Casablanca", note: "3.5 hours door to door" },
  { from: "Ifrane", to: "Rabat", note: "2.5 hours on the highway" },
];
