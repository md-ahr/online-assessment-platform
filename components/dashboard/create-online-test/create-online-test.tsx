"use client";

import { useRouter } from "next/navigation";

import { CreateOnlineTestWizard } from "./create-online-test-wizard";

export function CreateOnlineTest() {
  const router = useRouter();

  return <CreateOnlineTestWizard onCancel={() => router.push("/dashboard")} />;
}
