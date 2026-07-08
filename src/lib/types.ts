export type BookingStatus = "pending" | "accepted" | "declined" | "cancelled";
export type RideStatus = "active" | "cancelled";
export type RequestStatus = "open" | "fulfilled" | "closed";
export type TimeOfDay = "morning" | "afternoon" | "evening" | "flexible";
export type ReviewedAs = "driver" | "passenger";

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  bio: string | null;
  createdAt: string;
}

export interface RatingSummary {
  driverAvg: number | null;
  driverCount: number;
  passengerAvg: number | null;
  passengerCount: number;
}

export interface PublicProfile
  extends Omit<Profile, "phone" | "email">, RatingSummary {
  /** All accounts are @aui.ma-verified; kept explicit for the UI badge. */
  verified: boolean;
}

export interface Ride {
  id: string;
  driverId: string;
  fromCity: string;
  fromDetail: string | null;
  toCity: string;
  toDetail: string | null;
  departureAt: string; // ISO
  seatsTotal: number;
  pricePerSeat: number; // MAD
  carModel: string | null;
  carColor: string | null;
  notes: string | null;
  isRecurring: boolean;
  recurrenceDays: Weekday[];
  status: RideStatus;
  createdAt: string;
}

export interface RideWithDriver extends Ride {
  driver: PublicProfile;
  seatsLeft: number;
}

export interface Booking {
  id: string;
  rideId: string;
  passengerId: string;
  seats: number;
  status: BookingStatus;
  createdAt: string;
}

export interface BookingWithRide extends Booking {
  ride: RideWithDriver;
}

export interface BookingWithPassenger extends Booking {
  passenger: PublicProfile;
}

export interface RideRequest {
  id: string;
  riderId: string;
  fromCity: string;
  toCity: string;
  travelDate: string; // YYYY-MM-DD
  timeOfDay: TimeOfDay;
  seats: number;
  notes: string | null;
  status: RequestStatus;
  createdAt: string;
}

export interface RideRequestWithRider extends RideRequest {
  rider: PublicProfile;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  reviewedAs: ReviewedAs; // the role the reviewee played on that ride
  rating: number; // 1..5
  comment: string | null;
  createdAt: string;
}

export interface ReviewWithReviewer extends Review {
  reviewer: PublicProfile;
}

export interface RideFilters {
  from?: string;
  to?: string;
  date?: string; // YYYY-MM-DD
}

export interface NewRideInput {
  fromCity: string;
  fromDetail: string | null;
  toCity: string;
  toDetail: string | null;
  departureAt: string;
  seatsTotal: number;
  pricePerSeat: number;
  carModel: string | null;
  carColor: string | null;
  notes: string | null;
  isRecurring: boolean;
  recurrenceDays: Weekday[];
}

export interface NewRequestInput {
  fromCity: string;
  toCity: string;
  travelDate: string;
  timeOfDay: TimeOfDay;
  seats: number;
  notes: string | null;
}
