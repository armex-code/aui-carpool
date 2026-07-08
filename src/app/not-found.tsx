import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-display text-6xl font-semibold text-pine-300">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
        This road doesn't go anywhere
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        The page you're after may have departed already.
      </p>
      <ButtonLink href="/rides" className="mt-6">
        Find a ride instead
      </ButtonLink>
    </div>
  );
}
