"use server";

import bcrypt from "bcryptjs";

import {
  type LoginFormValues,
  loginSchema,
} from "@/components/auth/login.schema";
import { clearSessionCookie, setSessionCookie } from "@/lib/auth/session";
import { connectToDatabase, UserModel } from "@/lib/db";
import type { UserRole } from "@/lib/db/types";

export type LoginActionResult = Readonly<{
  success: boolean;
  message: string;
  redirectTo?: string;
}>;

const INVALID_CREDENTIALS_MESSAGE = "Invalid email/User ID or password";

function isUserRole(value: string): value is UserRole {
  return value === "employer" || value === "candidate";
}

export async function loginAction(
  input: LoginFormValues
): Promise<LoginActionResult> {
  const parsedInput = loginSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      success: false,
      message: parsedInput.error.issues[0]?.message ?? "Invalid input",
    };
  }

  await connectToDatabase();

  const identifier = parsedInput.data.emailOrUserId.trim();
  const normalizedEmail = identifier.toLowerCase();

  const user = await UserModel.findOne({
    $or: [{ email: normalizedEmail }, { userId: identifier }],
  }).lean();

  if (!user) {
    return {
      success: false,
      message: INVALID_CREDENTIALS_MESSAGE,
    };
  }

  const isPasswordValid = await bcrypt.compare(
    parsedInput.data.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    return {
      success: false,
      message: INVALID_CREDENTIALS_MESSAGE,
    };
  }

  if (!isUserRole(user.role)) {
    return {
      success: false,
      message: "User has an invalid role",
    };
  }

  const displayName =
    typeof user.name === "string" && user.name.trim() !== ""
      ? user.name.trim()
      : user.userId;

  await setSessionCookie({
    email: user.email,
    name: displayName,
    role: user.role,
    userId: user._id.toString(),
    username: user.userId,
  });

  return {
    success: true,
    message: "Login successful",
    redirectTo: user.role === "candidate" ? "/candidate" : "/dashboard",
  };
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
}
