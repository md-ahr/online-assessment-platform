import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CandidateTestSession } from "@/components/candidate/test-session";
import { requireCandidateSession } from "@/lib/auth/guards";
import {
  getOnlineTestForCandidateSession,
  getOnlineTestTitleById,
} from "@/lib/db";

type CandidateTestPageProps = Readonly<{
  params: Promise<{ testId: string }>;
}>;

export async function generateMetadata({
  params,
}: CandidateTestPageProps): Promise<Metadata> {
  const { testId } = await params;
  const title = await getOnlineTestTitleById(testId);

  return {
    title: title ?? "Assessment",
  };
}

export default async function CandidateTestPage({
  params,
}: CandidateTestPageProps) {
  const user = await requireCandidateSession();
  const { testId } = await params;
  const session = await getOnlineTestForCandidateSession(testId);

  if (!session) {
    notFound();
  }

  const candidateDisplayName = user.name.trim() || user.email;

  return (
    <CandidateTestSession
      candidateDisplayName={candidateDisplayName}
      session={session}
    />
  );
}
