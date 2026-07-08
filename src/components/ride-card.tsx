import Link from "next/link";
import { Repeat, Users } from "lucide-react";
import type { RideWithDriver } from "@/lib/types";
import {
  formatDay,
  formatMoney,
  formatRecurrence,
  formatTime,
  pluralize,
} from "@/lib/utils";
import { Avatar } from "./avatar";
import { RatingLine } from "./stars";
import { RouteLine } from "./route-line";
import { Badge } from "./ui";

export function RideCard({ ride }: { ride: RideWithDriver }) {
  const full = ride.seatsLeft === 0;
  return (
    <Link
      href={`/rides/${ride.id}`}
      className="group block rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:border-pine-300 hover:shadow-lift"
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-medium text-pine-800">
          {formatDay(ride.departureAt)}
          <span className="text-ink-faint"> · </span>
          {formatTime(ride.departureAt)}
        </p>
        <p className="font-display text-lg font-semibold text-pine-800">
          {formatMoney(ride.pricePerSeat)}
          <span className="ml-1 text-xs font-normal text-ink-faint">/ seat</span>
        </p>
      </div>

      <RouteLine
        from={ride.fromCity}
        to={ride.toCity}
        fromDetail={ride.fromDetail}
        toDetail={ride.toDetail}
        className="mt-3"
      />

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar id={ride.driver.id} name={ride.driver.fullName} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">
              {ride.driver.fullName}
            </p>
            <RatingLine
              avg={ride.driver.driverAvg}
              count={ride.driver.driverCount}
              label="rating"
            />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {ride.isRecurring && (
            <Badge tone="green" className="hidden sm:inline-flex">
              <Repeat size={11} />
              {formatRecurrence(ride.recurrenceDays)}
            </Badge>
          )}
          <Badge tone={full ? "red" : "neutral"}>
            <Users size={11} />
            {full ? "Full" : `${pluralize(ride.seatsLeft, "seat")} left`}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
