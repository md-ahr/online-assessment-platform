import "server-only";

import { cookies } from "next/headers";

import type { AuthenticatedUser } from "@/lib/db/types";
import { env } from "@/lib/env";

import { SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from "./constants";
import { createSessionToken, verifySessionToken } from "./jwt";

export async function setSessionCookie(user: AuthenticatedUser): Promise<void> {
  const cookieStore = await cookies();
  const token = await createSessionToken(user, SESSION_TTL_SECONDS);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionFromCookies(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  return verifySessionToken(sessionToken);
}
