import type {
  Booking,
  BookingWithPassenger,
  BookingWithRide,
  BookingStatus,
  NewRequestInput,
  NewRideInput,
  Profile,
  PublicProfile,
  ReviewWithReviewer,
  RideFilters,
  RideRequestWithRider,
  RideWithDriver,
} from "@/lib/types";

export type Result<T = undefined> =
  | { ok: true; value: T }
  | { ok: false; error: string };

/**
 * Single seam between the UI and persistence. Two implementations exist:
 * an in-memory demo store (zero-config preview deployments) and a Supabase
 * store (production). A future React Native client talks to the same shape.
 */
export interface DataStore {
  // profiles
  getProfile(id: string): Promise<Profile | null>;
  getPublicProfile(id: string): Promise<PublicProfile | null>;
  updateProfile(
    id: string,
    patch: { fullName?: string; phone?: string; bio?: string },
  ): Promise<void>;

  // rides
  listRides(filters: RideFilters): Promise<RideWithDriver[]>;
  getRide(id: string): Promise<RideWithDriver | null>;
  createRide(driverId: string, input: NewRideInput): Promise<Result<string>>;
  cancelRide(rideId: string, driverId: string): Promise<Result>;
  listRidesByDriver(driverId: string): Promise<RideWithDriver[]>;

  // bookings
  getBooking(id: string): Promise<Booking | null>;
  createBooking(
    rideId: string,
    passengerId: string,
    seats: number,
  ): Promise<Result<string>>;
  setBookingStatus(
    bookingId: string,
    status: BookingStatus,
    actorId: string,
  ): Promise<Result>;
  listBookingsByPassenger(passengerId: string): Promise<BookingWithRide[]>;
  listBookingsForRide(rideId: string): Promise<BookingWithPassenger[]>;
  getBookingForPassenger(
    rideId: string,
    passengerId: string,
  ): Promise<Booking | null>;

  /** Phone numbers are only exchanged after a booking is accepted. */
  getContactPhone(
    bookingId: string,
    requesterId: string,
  ): Promise<{ phone: string; name: string } | null>;

  // ride requests
  listRequests(): Promise<RideRequestWithRider[]>;
  createRequest(
    riderId: string,
    input: NewRequestInput,
  ): Promise<Result<string>>;
  closeRequest(requestId: string, riderId: string): Promise<Result>;

  // reviews
  listReviewsFor(userId: string): Promise<ReviewWithReviewer[]>;
  createReview(
    reviewerId: string,
    bookingId: string,
    rating: number,
    comment: string | null,
  ): Promise<Result>;
  hasReviewed(bookingId: string, reviewerId: string): Promise<boolean>;
}
