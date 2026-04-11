"use server";

import { revalidatePath } from "next/cache";

import { requireEmployerSession } from "@/lib/auth/guards";
import { deleteOnlineTest } from "@/lib/db";

export type DeleteOnlineTestResult = Readonly<{
  success: boolean;
  message: string;
}>;

export async function deleteOnlineTestAction(
  testId: string
): Promise<DeleteOnlineTestResult> {
  const session = await requireEmployerSession();
  const deleted = await deleteOnlineTest(session.userId, testId);

  if (!deleted) {
    return {
      success: false,
      message: "Online test not found",
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Online test deleted",
  };
}
