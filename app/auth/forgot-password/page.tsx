import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <section className="container-wrapper flex min-h-[calc(100vh-161px)] flex-col items-center justify-center gap-6 py-12">
      <h1 className="title text-center">Forgot password</h1>
      <p className="body max-w-md text-center text-muted-foreground">
        Password recovery is not wired up yet. Use the sign-in page to go back.
      </p>
      <Link
        className={cn(buttonVariants({ variant: "outline" }))}
        href="/auth/login"
      >
        Back to Sign In
      </Link>
    </section>
  );
}
