import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CandidateTestComplete } from "@/components/candidate/test-complete";
import { requireCandidateSession } from "@/lib/auth/guards";
import {
  getOnlineTestCandidateCompletionMeta,
  getOnlineTestTitleById,
} from "@/lib/db";

type CandidateTestCompletePageProps = Readonly<{
  params: Promise<{ testId: string }>;
}>;

function examFormatLabel(questionType: "MCQ" | "Checkbox" | "Text"): string {
  if (questionType === "MCQ") {
    return "MCQ";
  }

  if (questionType === "Checkbox") {
    return "Checkbox";
  }

  return "Written";
}

export async function generateMetadata({
  params,
}: CandidateTestCompletePageProps): Promise<Metadata> {
  const { testId } = await params;
  const title = await getOnlineTestTitleById(testId);

  return {
    title: title ? `${title} — Completed` : "Test completed",
  };
}

export default async function CandidateTestCompletePage({
  params,
}: CandidateTestCompletePageProps) {
  const user = await requireCandidateSession();
  const { testId } = await params;
  const meta = await getOnlineTestCandidateCompletionMeta(testId);

  if (!meta) {
    notFound();
  }

  const displayName = user.username.trim() || user.email;

  return (
    <CandidateTestComplete
      displayName={displayName}
      examFormatLabel={examFormatLabel(meta.questionType)}
      testTitle={meta.title}
    />
  );
}
