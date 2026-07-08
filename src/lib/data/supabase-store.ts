import type {
  Booking,
  BookingStatus,
  BookingWithPassenger,
  BookingWithRide,
  NewRequestInput,
  NewRideInput,
  Profile,
  PublicProfile,
  ReviewWithReviewer,
  Ride,
  RideFilters,
  RideRequest,
  RideRequestWithRider,
  RideWithDriver,
  Weekday,
} from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import type { DataStore, Result } from "./store";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

function mapProfile(row: Row): Profile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name ?? "",
    phone: row.phone ?? null,
    bio: row.bio ?? null,
    createdAt: row.created_at,
  };
}

function mapPublicProfile(row: Row): PublicProfile {
  return {
    id: row.id,
    fullName: row.full_name ?? "",
    bio: row.bio ?? null,
    createdAt: row.created_at,
    verified: true,
    driverAvg: row.driver_avg === null ? null : Number(row.driver_avg),
    driverCount: Number(row.driver_count ?? 0),
    passengerAvg: row.passenger_avg === null ? null : Number(row.passenger_avg),
    passengerCount: Number(row.passenger_count ?? 0),
  };
}

function mapRide(row: Row): Ride {
  return {
    id: row.id,
    driverId: row.driver_id,
    fromCity: row.from_city,
    fromDetail: row.from_detail ?? null,
    toCity: row.to_city,
    toDetail: row.to_detail ?? null,
    departureAt: row.departure_at,
    seatsTotal: row.seats_total,
    pricePerSeat: row.price_per_seat,
    carModel: row.car_model ?? null,
    carColor: row.car_color ?? null,
    notes: row.notes ?? null,
    isRecurring: row.is_recurring,
    recurrenceDays: (row.recurrence_days ?? []) as Weekday[],
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapBooking(row: Row): Booking {
  return {
    id: row.id,
    rideId: row.ride_id,
    passengerId: row.passenger_id,
    seats: row.seats,
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapRequest(row: Row): RideRequest {
  return {
    id: row.id,
    riderId: row.rider_id,
    fromCity: row.from_city,
    toCity: row.to_city,
    travelDate: row.travel_date,
    timeOfDay: row.time_of_day,
    seats: row.seats,
    notes: row.notes ?? null,
    status: row.status,
    createdAt: row.created_at,
  };
}

const RECENT_CUTOFF_MS = 60 * 60 * 1000;

export class SupabaseStore implements DataStore {
  private async publicProfiles(ids: string[]) {
    const map = new Map<string, PublicProfile>();
    if (ids.length === 0) return map;
    const sb = await createClient();
    const { data } = await sb
      .from("profiles_public")
      .select("*")
      .in("id", [...new Set(ids)]);
    for (const row of data ?? []) map.set(row.id, mapPublicProfile(row));
    return map;
  }

  private async seatsTaken(rideIds: string[]) {
    const map = new Map<string, number>();
    if (rideIds.length === 0) return map;
    const sb = await createClient();
    const { data } = await sb
      .from("ride_seats")
      .select("*")
      .in("ride_id", [...new Set(rideIds)]);
    for (const row of data ?? [])
      map.set(row.ride_id, Number(row.seats_taken ?? 0));
    return map;
  }

  private async hydrateRides(rows: Row[]): Promise<RideWithDriver[]> {
    const rides = rows.map(mapRide);
    const [drivers, seats] = await Promise.all([
      this.publicProfiles(rides.map((r) => r.driverId)),
      this.seatsTaken(rides.map((r) => r.id)),
    ]);
    return rides
      .map((ride) => {
        const driver = drivers.get(ride.driverId);
        if (!driver) return null;
        return {
          ...ride,
          driver,
          seatsLeft: Math.max(0, ride.seatsTotal - (seats.get(ride.id) ?? 0)),
        };
      })
      .filter((r): r is RideWithDriver => r !== null);
  }

  async getProfile(id: string) {
    const sb = await createClient();
    const { data } = await sb
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return data ? mapProfile(data) : null;
  }

  async getPublicProfile(id: string) {
    const sb = await createClient();
    const { data } = await sb
      .from("profiles_public")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return data ? mapPublicProfile(data) : null;
  }

  async updateProfile(
    id: string,
    patch: { fullName?: string; phone?: string; bio?: string },
  ) {
    const sb = await createClient();
    const update: Row = {};
    if (patch.fullName !== undefined) update.full_name = patch.fullName;
    if (patch.phone !== undefined) update.phone = patch.phone;
    if (patch.bio !== undefined) update.bio = patch.bio;
    await sb.from("profiles").update(update).eq("id", id);
  }

  async listRides(filters: RideFilters) {
    const sb = await createClient();
    let query = sb
      .from("rides")
      .select("*")
      .eq("status", "active")
      .gte(
        "departure_at",
        new Date(Date.now() - RECENT_CUTOFF_MS).toISOString(),
      )
      .order("departure_at", { ascending: true })
      .limit(100);
    if (filters.from) query = query.eq("from_city", filters.from);
    if (filters.to) query = query.eq("to_city", filters.to);
    if (filters.date) {
      query = query
        .gte("departure_at", `${filters.date}T00:00:00`)
        .lte("departure_at", `${filters.date}T23:59:59`);
    }
    const { data } = await query;
    return this.hydrateRides(data ?? []);
  }

  async getRide(id: string) {
    const sb = await createClient();
    const { data } = await sb
      .from("rides")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!data) return null;
    const [ride] = await this.hydrateRides([data]);
    return ride ?? null;
  }

  async createRide(driverId: string, input: NewRideInput): Promise<Result<string>> {
    const sb = await createClient();
    const { data, error } = await sb
      .from("rides")
      .insert({
        driver_id: driverId,
        from_city: input.fromCity,
        from_detail: input.fromDetail,
        to_city: input.toCity,
        to_detail: input.toDetail,
        departure_at: input.departureAt,
        seats_total: input.seatsTotal,
        price_per_seat: input.pricePerSeat,
        car_model: input.carModel,
        car_color: input.carColor,
        notes: input.notes,
        is_recurring: input.isRecurring,
        recurrence_days: input.recurrenceDays,
      })
      .select("id")
      .single();
    if (error || !data)
      return { ok: false, error: error?.message ?? "Could not create ride." };
    return { ok: true, value: data.id };
  }

  async cancelRide(rideId: string, driverId: string): Promise<Result> {
    const sb = await createClient();
    const { error } = await sb
      .from("rides")
      .update({ status: "cancelled" })
      .eq("id", rideId)
      .eq("driver_id", driverId);
    if (error) return { ok: false, error: error.message };
    await sb
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("ride_id", rideId)
      .in("status", ["pending", "accepted"]);
    return { ok: true, value: undefined };
  }

  async listRidesByDriver(driverId: string) {
    const sb = await createClient();
    const { data } = await sb
      .from("rides")
      .select("*")
      .eq("driver_id", driverId)
      .order("departure_at", { ascending: false })
      .limit(100);
    return this.hydrateRides(data ?? []);
  }

  async getBooking(id: string) {
    const sb = await createClient();
    const { data } = await sb
      .from("bookings")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return data ? mapBooking(data) : null;
  }

  async createBooking(
    rideId: string,
    passengerId: string,
    seats: number,
  ): Promise<Result<string>> {
    const sb = await createClient();
    const { data: rideRow } = await sb
      .from("rides")
      .select("*")
      .eq("id", rideId)
      .maybeSingle();
    if (!rideRow || rideRow.status !== "active")
      return { ok: false, error: "This ride is no longer available." };
    if (rideRow.driver_id === passengerId)
      return { ok: false, error: "You can't book a seat on your own ride." };
    if (new Date(rideRow.departure_at).getTime() < Date.now())
      return { ok: false, error: "This ride has already departed." };

    const { data: existing } = await sb
      .from("bookings")
      .select("id")
      .eq("ride_id", rideId)
      .eq("passenger_id", passengerId)
      .in("status", ["pending", "accepted"])
      .maybeSingle();
    if (existing)
      return { ok: false, error: "You already requested a seat on this ride." };

    const taken = await this.seatsTaken([rideId]);
    const left = rideRow.seats_total - (taken.get(rideId) ?? 0);
    if (seats < 1 || seats > left)
      return { ok: false, error: `Only ${left} seat(s) left on this ride.` };

    const { data, error } = await sb
      .from("bookings")
      .insert({ ride_id: rideId, passenger_id: passengerId, seats })
      .select("id")
      .single();
    if (error || !data)
      return { ok: false, error: error?.message ?? "Could not book." };
    return { ok: true, value: data.id };
  }

  async setBookingStatus(
    bookingId: string,
    status: BookingStatus,
    actorId: string,
  ): Promise<Result> {
    const sb = await createClient();
    const { data: bookingRow } = await sb
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .maybeSingle();
    if (!bookingRow) return { ok: false, error: "Booking not found." };
    const { data: rideRow } = await sb
      .from("rides")
      .select("*")
      .eq("id", bookingRow.ride_id)
      .maybeSingle();
    if (!rideRow) return { ok: false, error: "Ride not found." };

    const isDriver = rideRow.driver_id === actorId;
    const isPassenger = bookingRow.passenger_id === actorId;
    if (status === "cancelled" && !isPassenger)
      return { ok: false, error: "Only the passenger can cancel a booking." };
    if ((status === "accepted" || status === "declined") && !isDriver)
      return { ok: false, error: "Only the driver can respond to requests." };

    if (status === "accepted") {
      const taken = await this.seatsTaken([rideRow.id]);
      const left = rideRow.seats_total - (taken.get(rideRow.id) ?? 0);
      if (bookingRow.seats > left)
        return { ok: false, error: "Not enough seats left to accept this." };
    }

    const { error } = await sb
      .from("bookings")
      .update({ status })
      .eq("id", bookingId);
    if (error) return { ok: false, error: error.message };
    return { ok: true, value: undefined };
  }

  async listBookingsByPassenger(passengerId: string) {
    const sb = await createClient();
    const { data: bookingRows } = await sb
      .from("bookings")
      .select("*")
      .eq("passenger_id", passengerId)
      .order("created_at", { ascending: false })
      .limit(100);
    const bookings = (bookingRows ?? []).map(mapBooking);
    if (bookings.length === 0) return [];
    const { data: rideRows } = await sb
      .from("rides")
      .select("*")
      .in("id", [...new Set(bookings.map((b) => b.rideId))]);
    const rides = await this.hydrateRides(rideRows ?? []);
    const rideMap = new Map(rides.map((r) => [r.id, r]));
    return bookings
      .map((b) => {
        const ride = rideMap.get(b.rideId);
        return ride ? ({ ...b, ride } satisfies BookingWithRide) : null;
      })
      .filter((b): b is BookingWithRide => b !== null)
      .sort(
        (a, b) =>
          new Date(b.ride.departureAt).getTime() -
          new Date(a.ride.departureAt).getTime(),
      );
  }

  async listBookingsForRide(rideId: string) {
    const sb = await createClient();
    const { data: bookingRows } = await sb
      .from("bookings")
      .select("*")
      .eq("ride_id", rideId)
      .order("created_at", { ascending: true });
    const bookings = (bookingRows ?? []).map(mapBooking);
    const passengers = await this.publicProfiles(
      bookings.map((b) => b.passengerId),
    );
    return bookings
      .map((b) => {
        const passenger = passengers.get(b.passengerId);
        return passenger
          ? ({ ...b, passenger } satisfies BookingWithPassenger)
          : null;
      })
      .filter((b): b is BookingWithPassenger => b !== null);
  }

  async getBookingForPassenger(rideId: string, passengerId: string) {
    const sb = await createClient();
    const { data } = await sb
      .from("bookings")
      .select("*")
      .eq("ride_id", rideId)
      .eq("passenger_id", passengerId)
      .in("status", ["pending", "accepted"])
      .maybeSingle();
    return data ? mapBooking(data) : null;
  }

  async getContactPhone(bookingId: string) {
    const sb = await createClient();
    const { data } = await sb.rpc("get_contact_phone", {
      p_booking_id: bookingId,
    });
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.phone) return null;
    return { phone: row.phone as string, name: (row.name as string) ?? "" };
  }

  async listRequests() {
    const sb = await createClient();
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await sb
      .from("ride_requests")
      .select("*")
      .eq("status", "open")
      .gte("travel_date", today)
      .order("travel_date", { ascending: true })
      .limit(100);
    const requests = (data ?? []).map(mapRequest);
    const riders = await this.publicProfiles(requests.map((q) => q.riderId));
    return requests
      .map((q) => {
        const rider = riders.get(q.riderId);
        return rider ? ({ ...q, rider } satisfies RideRequestWithRider) : null;
      })
      .filter((q): q is RideRequestWithRider => q !== null);
  }

  async createRequest(
    riderId: string,
    input: NewRequestInput,
  ): Promise<Result<string>> {
    const sb = await createClient();
    const { data, error } = await sb
      .from("ride_requests")
      .insert({
        rider_id: riderId,
        from_city: input.fromCity,
        to_city: input.toCity,
        travel_date: input.travelDate,
        time_of_day: input.timeOfDay,
        seats: input.seats,
        notes: input.notes,
      })
      .select("id")
      .single();
    if (error || !data)
      return { ok: false, error: error?.message ?? "Could not post request." };
    return { ok: true, value: data.id };
  }

  async closeRequest(requestId: string, riderId: string): Promise<Result> {
    const sb = await createClient();
    const { error } = await sb
      .from("ride_requests")
      .update({ status: "closed" })
      .eq("id", requestId)
      .eq("rider_id", riderId);
    if (error) return { ok: false, error: error.message };
    return { ok: true, value: undefined };
  }

  async listReviewsFor(userId: string) {
    const sb = await createClient();
    const { data } = await sb
      .from("reviews")
      .select("*")
      .eq("reviewee_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    const rows = data ?? [];
    const reviewers = await this.publicProfiles(
      rows.map((r) => r.reviewer_id),
    );
    return rows
      .map((row) => {
        const reviewer = reviewers.get(row.reviewer_id);
        if (!reviewer) return null;
        return {
          id: row.id,
          bookingId: row.booking_id,
          reviewerId: row.reviewer_id,
          revieweeId: row.reviewee_id,
          reviewedAs: row.reviewed_as,
          rating: row.rating,
          comment: row.comment ?? null,
          createdAt: row.created_at,
          reviewer,
        } satisfies ReviewWithReviewer;
      })
      .filter((r): r is ReviewWithReviewer => r !== null);
  }

  async createReview(
    reviewerId: string,
    bookingId: string,
    rating: number,
    comment: string | null,
  ): Promise<Result> {
    if (rating < 1 || rating > 5)
      return { ok: false, error: "Rating must be between 1 and 5." };
    const sb = await createClient();
    const { data: bookingRow } = await sb
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .maybeSingle();
    if (!bookingRow || bookingRow.status !== "accepted")
      return { ok: false, error: "You can only review confirmed rides." };
    const { data: rideRow } = await sb
      .from("rides")
      .select("*")
      .eq("id", bookingRow.ride_id)
      .maybeSingle();
    if (!rideRow) return { ok: false, error: "Ride not found." };
    if (new Date(rideRow.departure_at).getTime() > Date.now())
      return { ok: false, error: "You can review once the ride has happened." };

    let revieweeId: string;
    let reviewedAs: "driver" | "passenger";
    if (reviewerId === bookingRow.passenger_id) {
      revieweeId = rideRow.driver_id;
      reviewedAs = "driver";
    } else if (reviewerId === rideRow.driver_id) {
      revieweeId = bookingRow.passenger_id;
      reviewedAs = "passenger";
    } else {
      return { ok: false, error: "You weren't part of this ride." };
    }

    const { error } = await sb.from("reviews").insert({
      booking_id: bookingId,
      reviewer_id: reviewerId,
      reviewee_id: revieweeId,
      reviewed_as: reviewedAs,
      rating,
      comment,
    });
    if (error) {
      if (error.code === "23505")
        return { ok: false, error: "You already reviewed this ride." };
      return { ok: false, error: error.message };
    }
    return { ok: true, value: undefined };
  }

  async hasReviewed(bookingId: string, reviewerId: string) {
    const sb = await createClient();
    const { data } = await sb
      .from("reviews")
      .select("id")
      .eq("booking_id", bookingId)
      .eq("reviewer_id", reviewerId)
      .maybeSingle();
    return Boolean(data);
  }
}
