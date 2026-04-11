"use client";

import { Button } from "@/components/ui/button";

type CandidateErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function CandidateError({ error, reset }: CandidateErrorProps) {
  const details = error.digest ? `Error ref: ${error.digest}` : null;

  return (
    <section className="container-wrapper min-h-[calc(100vh-161px)] py-8 pb-12 dark:bg-background">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl bg-card p-8 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          Something went wrong
        </h2>
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t load the online tests catalog. Please try again.
        </p>
        {details ? (
          <p className="text-xs text-muted-foreground">{details}</p>
        ) : null}
        <Button type="button" onClick={reset}>
          Try again
        </Button>
      </div>
    </section>
  );
}
