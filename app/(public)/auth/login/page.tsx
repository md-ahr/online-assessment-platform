import type { Metadata } from "next";

import {
  LoginForm,
  type SeedAccountCredentials,
} from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to the Online Assessment Platform",
};

function getSeedCredentials():
  | { employer: SeedAccountCredentials; candidate: SeedAccountCredentials }
  | undefined {
  const employerEmail = process.env.SEED_EMPLOYER_EMAIL;
  const employerPassword = process.env.SEED_EMPLOYER_PASSWORD;
  const employerUserId = process.env.SEED_EMPLOYER_ID;
  const candidateEmail = process.env.SEED_CANDIDATE_EMAIL;
  const candidatePassword = process.env.SEED_CANDIDATE_PASSWORD;
  const candidateUserId = process.env.SEED_CANDIDATE_ID;

  if (
    !employerEmail ||
    !employerPassword ||
    !employerUserId ||
    !candidateEmail ||
    !candidatePassword ||
    !candidateUserId
  ) {
    return undefined;
  }

  return {
    employer: {
      email: employerEmail,
      password: employerPassword,
      userId: employerUserId,
    },
    candidate: {
      email: candidateEmail,
      password: candidatePassword,
      userId: candidateUserId,
    },
  };
}

export default function LoginPage() {
  const seedCredentials = getSeedCredentials();

  return (
    <section className="flex min-h-[calc(100vh-161px)] items-center justify-center">
      <LoginForm seedCredentials={seedCredentials} />
    </section>
  );
}
