import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { signOut } from "@/app/actions";
import { Button, ButtonLink, Card } from "@/components/ui";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Your profile
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Signed in as <span className="font-medium text-ink">{profile.email}</span>
          </p>
        </div>
        <ButtonLink href={`/profile/${profile.id}`} variant="secondary" size="sm">
          View public profile
        </ButtonLink>
      </div>

      <Card className="mt-6 p-6 sm:p-8">
        <SettingsForm
          defaultName={profile.fullName}
          defaultPhone={profile.phone ?? ""}
          defaultBio={profile.bio ?? ""}
          defaultRole={profile.rolePref}
          defaultVibe={profile.vibe}
        />
      </Card>

      <Card className="mt-6 flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h2 className="font-semibold text-ink">Sign out</h2>
          <p className="mt-0.5 text-sm text-ink-soft">
            You can sign back in any time with your @aui.ma email.
          </p>
        </div>
        <form action={signOut}>
          <Button variant="danger" type="submit">
            Sign out
          </Button>
        </form>
      </Card>
    </div>
  );
}
