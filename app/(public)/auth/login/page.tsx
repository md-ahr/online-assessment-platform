import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to the Online Assessment Platform",
};

export default function LoginPage() {
  return (
    <section className="flex min-h-[calc(100vh-161px)] items-center justify-center">
      <LoginForm />
    </section>
  );
}
