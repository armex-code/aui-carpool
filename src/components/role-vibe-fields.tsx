import { ROLE_PREFS, VIBE_TAGS } from "@/lib/campus";
import type { RolePref } from "@/lib/types";
import { Label, FieldHint } from "./ui";

const chip =
  "cursor-pointer rounded-full border border-line-strong bg-white px-3.5 py-1.5 text-sm font-medium text-ink-soft transition-colors has-[:checked]:border-pine-700 has-[:checked]:bg-pine-700 has-[:checked]:text-paper";

/** Role + travel-style pickers shared by onboarding and settings. */
export function RoleVibeFields({
  defaultRole,
  defaultVibe,
}: {
  defaultRole: RolePref | null;
  defaultVibe: string[];
}) {
  return (
    <>
      <div>
        <Label>I&apos;ll mostly be</Label>
        <div className="flex flex-wrap gap-2">
          {ROLE_PREFS.map((role) => (
            <label key={role.value} className={chip}>
              <input
                type="radio"
                name="rolePref"
                value={role.value}
                defaultChecked={defaultRole === role.value}
                className="sr-only"
              />
              {role.label}
            </label>
          ))}
        </div>
      </div>
      <div>
        <Label>
          Your travel style{" "}
          <span className="font-normal text-ink-faint">(optional, pick up to 4)</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {VIBE_TAGS.map((tag) => (
            <label key={tag} className={chip}>
              <input
                type="checkbox"
                name="vibe"
                value={tag}
                defaultChecked={defaultVibe.includes(tag)}
                className="sr-only"
              />
              {tag}
            </label>
          ))}
        </div>
        <FieldHint>
          Shown on your profile so people know who they&apos;re riding with.
        </FieldHint>
      </div>
    </>
  );
}
