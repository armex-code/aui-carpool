import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile, profileComplete } from "@/lib/auth";
import { Card } from "@/components/ui";
import { RequestForm } from "./request-form";

export const metadata: Metadata = { title: "Post a ride request" };

export default async function NewRequestPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (!profileComplete(profile)) redirect("/onboarding");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">
        Post a ride request
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Tell drivers where you need to go. Requests stay up until the travel
        date passes or you close them.
      </p>
      <Card className="mt-6 p-6 sm:p-8">
        <RequestForm />
      </Card>
    </div>
  );
}
