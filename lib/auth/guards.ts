import "server-only";

import { redirect } from "next/navigation";

import type { AuthenticatedUser } from "@/lib/db/types";

import { getSessionFromCookies } from "./session";

export async function requireEmployerSession(): Promise<AuthenticatedUser> {
  const session = await getSessionFromCookies();

  if (!session || session.role !== "employer") {
    redirect("/auth/login");
  }

  return session;
}
