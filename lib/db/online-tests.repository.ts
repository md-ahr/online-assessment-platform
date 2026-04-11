import "server-only";

import { Types } from "mongoose";

import type {
  OnlineTestDashboardItem,
  OnlineTestMutationInput,
  QuestionDTO,
} from "@/lib/db/types";

import { OnlineTestModel } from "./models/online-test";
import { connectToDatabase } from "./mongoose";

export type ListOnlineTestsParams = Readonly<{
  userId: string;
  page: number;
  pageSize: number;
  query: string;
}>;

export type ListOnlineTestsResult = Readonly<{
  items: readonly OnlineTestDashboardItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}>;

export type EditableOnlineTestRecord = Readonly<{
  id: string;
  title: string;
  totalCandidates: number;
  totalSlots: number;
  totalQuestionSet: number;
  questionType: "MCQ" | "Checkbox" | "Text";
  startTime: string;
  endTime: string;
  durationMinutes: number | null;
  questions: readonly QuestionDTO[];
}>;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toObjectId(value: string): Types.ObjectId {
  if (!Types.ObjectId.isValid(value)) {
    throw new Error("Invalid ObjectId");
  }

  return new Types.ObjectId(value);
}

function normalizePagination(
  page: number,
  pageSize: number
): {
  page: number;
  pageSize: number;
} {
  const normalizedPage =
    Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const normalizedPageSize =
    Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 8;

  return { page: normalizedPage, pageSize: normalizedPageSize };
}

export async function listOnlineTests(
  params: ListOnlineTestsParams
): Promise<ListOnlineTestsResult> {
  await connectToDatabase();

  const { page, pageSize } = normalizePagination(params.page, params.pageSize);
  const ownerObjectId = toObjectId(params.userId);
  const trimmedQuery = params.query.trim();
  const filter = {
    createdBy: ownerObjectId,
    ...(trimmedQuery
      ? {
          title: {
            $regex: escapeRegExp(trimmedQuery),
            $options: "i",
          },
        }
      : {}),
  };

  const [records, total] = await Promise.all([
    OnlineTestModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    OnlineTestModel.countDocuments(filter),
  ]);

  const items: OnlineTestDashboardItem[] = records.map((record) => ({
    id: record._id.toString(),
    title: record.title,
    candidates: record.totalCandidates,
    examSlots: record.totalSlots,
    questionSet: record.totalQuestionSet,
  }));

  return {
    items,
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function createOnlineTest(
  userId: string,
  input: OnlineTestMutationInput
): Promise<string> {
  await connectToDatabase();

  const created = new OnlineTestModel({
    createdBy: toObjectId(userId),
    durationMinutes: input.durationMinutes,
    endTime: input.endTime,
    questionType: input.questionType,
    questions: input.questions.map((question) => ({
      options: question.options.map((option) => ({ ...option })),
      prompt: question.prompt,
      questionType: question.questionType,
      score: question.score,
    })),
    startTime: input.startTime,
    title: input.title,
    totalCandidates: input.totalCandidates,
    totalQuestionSet: input.totalQuestionSet,
    totalSlots: input.totalSlots,
  });

  await created.save();

  return created._id.toString();
}

export async function getOnlineTestById(
  userId: string,
  testId: string
): Promise<EditableOnlineTestRecord | null> {
  await connectToDatabase();

  const record = await OnlineTestModel.findOne({
    _id: toObjectId(testId),
    createdBy: toObjectId(userId),
  }).lean();

  if (!record) {
    return null;
  }

  return {
    durationMinutes: record.durationMinutes ?? null,
    endTime: record.endTime,
    id: record._id.toString(),
    questionType: record.questionType,
    questions: record.questions,
    startTime: record.startTime,
    title: record.title,
    totalCandidates: record.totalCandidates,
    totalQuestionSet: record.totalQuestionSet,
    totalSlots: record.totalSlots,
  };
}

export async function updateOnlineTest(
  userId: string,
  testId: string,
  input: OnlineTestMutationInput
): Promise<boolean> {
  await connectToDatabase();

  const updated = await OnlineTestModel.updateOne(
    {
      _id: toObjectId(testId),
      createdBy: toObjectId(userId),
    },
    {
      $set: {
        durationMinutes: input.durationMinutes,
        endTime: input.endTime,
        questionType: input.questionType,
        questions: input.questions.map((question) => ({
          options: question.options.map((option) => ({ ...option })),
          prompt: question.prompt,
          questionType: question.questionType,
          score: question.score,
        })),
        startTime: input.startTime,
        title: input.title,
        totalCandidates: input.totalCandidates,
        totalQuestionSet: input.totalQuestionSet,
        totalSlots: input.totalSlots,
      },
    }
  );

  return updated.matchedCount > 0;
}

export async function deleteOnlineTest(
  userId: string,
  testId: string
): Promise<boolean> {
  await connectToDatabase();

  const deleted = await OnlineTestModel.deleteOne({
    _id: toObjectId(testId),
    createdBy: toObjectId(userId),
  });

  return deleted.deletedCount > 0;
}
