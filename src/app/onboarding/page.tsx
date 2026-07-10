import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile, profileComplete } from "@/lib/auth";
import { Card } from "@/components/ui";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = { title: "Finish your profile" };

export default async function OnboardingPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profileComplete(profile)) redirect("/rides");

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Almost there
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Two details so drivers and passengers know who they're riding with.
        </p>
      </div>
      <Card className="p-6 sm:p-8">
        <OnboardingForm
          defaultName={profile.fullName}
          defaultPhone={profile.phone ?? ""}
          defaultBio={profile.bio ?? ""}
          defaultRole={profile.rolePref}
          defaultVibe={profile.vibe}
        />
      </Card>
    </div>
  );
}
