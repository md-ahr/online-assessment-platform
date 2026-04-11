import "server-only";

import { redirect } from "next/navigation";

import type { AuthenticatedUser } from "@/lib/db/types";

import { getSessionFromCookies } from "./session";

export async function requireEmployerSession(): Promise<AuthenticatedUser> {
  const session = await getSessionFromCookies();

  if (!session) {
    redirect("/auth/login");
  }

  if (session.role === "candidate") {
    redirect("/candidate");
  }

  if (session.role !== "employer") {
    redirect("/auth/login");
  }

  return session;
}

export async function requireCandidateSession(): Promise<AuthenticatedUser> {
  const session = await getSessionFromCookies();

  if (!session) {
    redirect("/auth/login");
  }

  if (session.role === "employer") {
    redirect("/dashboard");
  }

  if (session.role !== "candidate") {
    redirect("/auth/login");
  }

  return session;
}
