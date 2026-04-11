import { type JWTPayload, jwtVerify, SignJWT } from "jose";

import type { AuthenticatedUser } from "@/lib/db/types";
import { env } from "@/lib/env";

const secretKey = new TextEncoder().encode(env.JWT_SECRET);

export type SessionPayload = JWTPayload & AuthenticatedUser;

export async function createSessionToken(
  payload: AuthenticatedUser,
  expiresInSeconds: number
): Promise<string> {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    role: payload.role,
    username: payload.username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(`${expiresInSeconds}s`)
    .sign(secretKey);
}

export async function verifySessionToken(
  token: string
): Promise<AuthenticatedUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.username !== "string" ||
      (payload.role !== "employer" && payload.role !== "candidate")
    ) {
      return null;
    }

    const name =
      typeof payload.name === "string" && payload.name.trim() !== ""
        ? payload.name.trim()
        : payload.username;

    return {
      email: payload.email,
      name,
      role: payload.role,
      userId: payload.sub,
      username: payload.username,
    };
  } catch {
    return null;
  }
}
