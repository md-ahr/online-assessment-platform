import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CreateOnlineTest } from "@/components/dashboard/create-online-test";
import { requireEmployerSession } from "@/lib/auth/guards";
import { getOnlineTestById } from "@/lib/db";

export const metadata: Metadata = {
  title: "Edit Online Test",
  description: "Edit and update an online test",
};

type EditOnlineTestPageProps = Readonly<{
  params: Promise<{
    testId: string;
  }>;
}>;

export default async function EditOnlineTestPage({
  params,
}: EditOnlineTestPageProps) {
  const session = await requireEmployerSession();
  const { testId } = await params;
  const testRecord = await getOnlineTestById(session.userId, testId);

  if (!testRecord) {
    notFound();
  }

  return (
    <section className="container-wrapper min-h-[calc(100vh-161px)] py-8 pb-12 dark:bg-background">
      <CreateOnlineTest
        initialQuestions={testRecord.questions.map((question) => ({
          options: question.options,
          prompt: question.prompt,
          questionType: question.questionType,
          score: String(question.score),
        }))}
        initialValues={{
          duration: testRecord.durationMinutes
            ? String(testRecord.durationMinutes)
            : "",
          endTime: testRecord.endTime,
          questionType: testRecord.questionType,
          startTime: testRecord.startTime,
          title: testRecord.title,
          totalCandidates: String(testRecord.totalCandidates),
          totalQuestionSet: String(testRecord.totalQuestionSet),
          totalSlots: String(testRecord.totalSlots),
        }}
        mode="edit"
        testId={testRecord.id}
      />
    </section>
  );
}
