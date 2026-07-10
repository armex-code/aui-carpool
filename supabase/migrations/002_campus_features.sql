-- Cambus: campus features
-- Trip types & event names, women-only rides and requests, profile role
-- preference and travel-style tags. Run after 001_init.sql.

alter table public.rides
  add column category text check (category in ('event', 'break', 'exam')),
  add column event_name text,
  add column women_only boolean not null default false;

alter table public.ride_requests
  add column women_only boolean not null default false;

alter table public.profiles
  add column role_pref text check (role_pref in ('driver', 'passenger', 'both')),
  add column vibe text[] not null default '{}';

-- Recreate the public directory view with the new profile fields
-- (new columns must come after the existing ones).
create or replace view public.profiles_public as
select
  p.id,
  p.full_name,
  p.bio,
  p.created_at,
  (select round(avg(r.rating)::numeric, 1) from public.reviews r
    where r.reviewee_id = p.id and r.reviewed_as = 'driver') as driver_avg,
  (select count(*) from public.reviews r
    where r.reviewee_id = p.id and r.reviewed_as = 'driver') as driver_count,
  (select round(avg(r.rating)::numeric, 1) from public.reviews r
    where r.reviewee_id = p.id and r.reviewed_as = 'passenger') as passenger_avg,
  (select count(*) from public.reviews r
    where r.reviewee_id = p.id and r.reviewed_as = 'passenger') as passenger_count,
  p.role_pref,
  p.vibe
from public.profiles p;
