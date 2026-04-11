"use client";

import { useRouter } from "next/navigation";

import {
  createOnlineTestAction,
  updateOnlineTestAction,
} from "@/app/dashboard/create-online-test/actions";

import { CreateOnlineTestWizard } from "./create-online-test-wizard";
import type { OnlineTestFormValues } from "./create-online-test-wizard.types";
import type { QuestionDraft } from "./question-editor.types";

type CreateOnlineTestProps = Readonly<{
  initialValues?: Partial<OnlineTestFormValues>;
  initialQuestions?: readonly QuestionDraft[];
  mode?: "create" | "edit";
  testId?: string;
}>;

export function CreateOnlineTest({
  initialQuestions,
  initialValues,
  mode = "create",
  testId,
}: CreateOnlineTestProps) {
  const router = useRouter();

  return (
    <CreateOnlineTestWizard
      initialQuestions={initialQuestions}
      initialValues={initialValues}
      submitLabel={mode === "edit" ? "Update Online Test" : "Save Online Test"}
      onCancel={() => router.push("/dashboard")}
      onSubmit={(payload) => {
        if (mode === "edit") {
          if (!testId) {
            return Promise.resolve({
              success: false,
              message: "Missing test identifier",
            });
          }

          return updateOnlineTestAction(testId, payload);
        }

        return createOnlineTestAction(payload);
      }}
    />
  );
}
