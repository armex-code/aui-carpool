import { cookies } from "next/headers";
import { createClient, supabaseEnabled } from "@/lib/supabase/server";
import { getStore } from "@/lib/data";
import type { Profile } from "@/lib/types";

export const DEMO_SESSION_COOKIE = "aui_demo_uid";
export const DEMO_PENDING_COOKIE = "aui_demo_pending_email";
export const DEMO_OTP_CODE = "424242";

export async function getSessionUserId(): Promise<string | null> {
  if (supabaseEnabled()) {
    const sb = await createClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    return user?.id ?? null;
  }
  const cookieStore = await cookies();
  return cookieStore.get(DEMO_SESSION_COOKIE)?.value ?? null;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const id = await getSessionUserId();
  if (!id) return null;
  return getStore().getProfile(id);
}

/** Profile is complete once we have a real name and a phone for WhatsApp. */
export function profileComplete(profile: Profile | null) {
  return Boolean(profile && profile.fullName.trim() && profile.phone?.trim());
}
