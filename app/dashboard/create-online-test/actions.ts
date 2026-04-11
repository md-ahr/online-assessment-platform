"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";

import { basicInfoSchema } from "@/components/dashboard/create-online-test/create-online-test-wizard.schema";
import type { OnlineTestFormValues } from "@/components/dashboard/create-online-test/create-online-test-wizard.types";
import type {
  QuestionDraft,
  QuestionType,
} from "@/components/dashboard/create-online-test/question-editor.types";
import { requireEmployerSession } from "@/lib/auth/guards";
import { createOnlineTest, updateOnlineTest } from "@/lib/db";
import type { OnlineTestMutationInput } from "@/lib/db/types";

const questionOptionSchema = z.object({
  content: z.string().trim().min(1, "Question option content is required"),
  id: z.string().trim().min(1),
  isCorrect: z.boolean(),
  label: z.string().trim().min(1),
});

const basicInfoMutationSchema = basicInfoSchema.safeExtend({
  duration: z
    .string()
    .trim()
    .regex(/^\d*$/, "Duration must be a valid number")
    .optional(),
  questionType: z.enum(["MCQ", "Checkbox", "Text"]),
});

const questionSchema = z.object({
  options: z
    .array(questionOptionSchema)
    .min(1, "At least one option is required"),
  prompt: z.string().trim().min(1, "Question prompt is required"),
  questionType: z.enum(["Checkbox", "Radio", "Text"]),
  score: z.string().trim().regex(/^\d+$/, "Score must be a valid number"),
});

const payloadSchema = z.object({
  basicInfo: basicInfoMutationSchema,
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
});

export type UpsertOnlineTestPayload = Readonly<{
  basicInfo: OnlineTestFormValues;
  questions: readonly QuestionDraft[];
}>;

export type UpsertOnlineTestResult = Readonly<{
  success: boolean;
  message: string;
}>;

function normalizeQuestionType(type: QuestionType): QuestionType {
  if (type === "Radio") {
    return "Radio";
  }

  if (type === "Checkbox") {
    return "Checkbox";
  }

  return "Text";
}

function toMutationInput(
  payload: UpsertOnlineTestPayload
): OnlineTestMutationInput {
  const parsedPayload = payloadSchema.safeParse(payload);

  if (!parsedPayload.success) {
    throw new Error(
      parsedPayload.error.issues[0]?.message ?? "Invalid payload"
    );
  }

  return {
    durationMinutes:
      parsedPayload.data.basicInfo.duration &&
      parsedPayload.data.basicInfo.duration.trim().length > 0
        ? Number(parsedPayload.data.basicInfo.duration)
        : null,
    endTime: parsedPayload.data.basicInfo.endTime,
    questionType: parsedPayload.data.basicInfo.questionType as
      | "MCQ"
      | "Checkbox"
      | "Text",
    questions: parsedPayload.data.questions.map((question) => ({
      options: question.options.map((option) => ({
        content: option.content,
        id: option.id,
        isCorrect: option.isCorrect,
        label: option.label,
      })),
      prompt: question.prompt,
      questionType: normalizeQuestionType(question.questionType),
      score: Number(question.score),
    })),
    startTime: parsedPayload.data.basicInfo.startTime,
    title: parsedPayload.data.basicInfo.title,
    totalCandidates: Number(parsedPayload.data.basicInfo.totalCandidates),
    totalQuestionSet: Number(parsedPayload.data.basicInfo.totalQuestionSet),
    totalSlots: Number(parsedPayload.data.basicInfo.totalSlots),
  };
}

export async function createOnlineTestAction(
  payload: UpsertOnlineTestPayload
): Promise<UpsertOnlineTestResult> {
  try {
    const session = await requireEmployerSession();
    const mutationInput = toMutationInput(payload);
    await createOnlineTest(session.userId, mutationInput);
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Online test created successfully",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create online test";

    return {
      success: false,
      message,
    };
  }
}

export async function updateOnlineTestAction(
  testId: string,
  payload: UpsertOnlineTestPayload
): Promise<UpsertOnlineTestResult> {
  try {
    await requireEmployerSession();
    const mutationInput = toMutationInput(payload);
    const updated = await updateOnlineTest(testId, mutationInput);

    if (!updated) {
      return {
        success: false,
        message: "Online test not found",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/create-online-test/${testId}`);

    return {
      success: true,
      message: "Online test updated successfully",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update online test";

    return {
      success: false,
      message,
    };
  }
}
