import { supabaseEnabled } from "@/lib/supabase/server";
import type { DataStore } from "./store";
import { DemoStore } from "./demo";
import { SupabaseStore } from "./supabase-store";

let demoStore: DemoStore | null = null;
let supaStore: SupabaseStore | null = null;

export function getStore(): DataStore {
  if (supabaseEnabled()) {
    if (!supaStore) supaStore = new SupabaseStore();
    return supaStore;
  }
  if (!demoStore) demoStore = new DemoStore();
  return demoStore;
}

/** True when running without Supabase credentials (seeded preview data). */
export function isDemoMode() {
  return !supabaseEnabled();
}
