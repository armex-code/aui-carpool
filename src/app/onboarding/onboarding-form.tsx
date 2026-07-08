"use client";

import { useActionState } from "react";
import { completeOnboarding, type FormState } from "@/app/actions";
import {
  Button,
  FieldHint,
  FormError,
  Input,
  Label,
  Textarea,
} from "@/components/ui";

export function OnboardingForm({
  defaultName,
  defaultPhone,
  defaultBio,
}: {
  defaultName: string;
  defaultPhone: string;
  defaultBio: string;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    completeOnboarding,
    {},
  );

  return (
    <form action={action} className="space-y-5">
      <FormError>{state.error}</FormError>
      <div>
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={defaultName}
          placeholder="As people know you on campus"
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Moroccan mobile</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={defaultPhone}
          placeholder="06 12 34 56 78"
          required
        />
        <FieldHint>
          Kept private. It's only shared over WhatsApp with your driver or
          passenger once a booking is confirmed.
        </FieldHint>
      </div>
      <div>
        <Label htmlFor="bio">
          A line about you <span className="font-normal text-ink-faint">(optional)</span>
        </Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={defaultBio}
          placeholder="School, year, where you usually travel…"
        />
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending ? "Saving…" : "Start carpooling"}
      </Button>
    </form>
  );
}
