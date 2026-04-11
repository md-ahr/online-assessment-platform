import "server-only";

import { Types } from "mongoose";

import type {
  OnlineTestCandidateListItem,
  OnlineTestDashboardItem,
  OnlineTestMutationInput,
  QuestionDTO,
} from "@/lib/db/types";

import { OnlineTestModel } from "./models/online-test";
import { connectToDatabase } from "./mongoose";

/** Default penalty shown to candidates when the field is unset (matches product spec). */
export const DEFAULT_NEGATIVE_MARK_PER_WRONG = -0.25;

export type ListOnlineTestsParams = Readonly<{
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

export type ListOnlineTestsForCandidatesParams = Readonly<{
  page: number;
  pageSize: number;
  query: string;
}>;

export type ListOnlineTestsForCandidatesResult = Readonly<{
  items: readonly OnlineTestCandidateListItem[];
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

  const { page: initialPage, pageSize } = normalizePagination(
    params.page,
    params.pageSize
  );
  let page = initialPage;
  const trimmedQuery = params.query.trim();
  const filter = trimmedQuery
    ? {
        title: {
          $regex: escapeRegExp(trimmedQuery),
          $options: "i",
        },
      }
    : {};

  const total = await OnlineTestModel.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  page = Math.min(page, totalPages);

  const records = await OnlineTestModel.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();

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
    totalPages,
  };
}

export async function listOnlineTestsForCandidates(
  params: ListOnlineTestsForCandidatesParams
): Promise<ListOnlineTestsForCandidatesResult> {
  await connectToDatabase();

  const { page: initialPage, pageSize } = normalizePagination(
    params.page,
    params.pageSize
  );
  let page = initialPage;
  const trimmedQuery = params.query.trim();
  const filter = trimmedQuery
    ? {
        title: {
          $regex: escapeRegExp(trimmedQuery),
          $options: "i",
        },
      }
    : {};

  const total = await OnlineTestModel.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  page = Math.min(page, totalPages);

  const records = await OnlineTestModel.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();

  const items: OnlineTestCandidateListItem[] = records.map((record) => {
    const embeddedCount = record.questions?.length ?? 0;
    const questionCount =
      embeddedCount > 0 ? embeddedCount : record.totalQuestionSet;

    return {
      durationMinutes: record.durationMinutes ?? null,
      id: record._id.toString(),
      negativeMarkPerWrong:
        record.negativeMarkPerWrong ?? DEFAULT_NEGATIVE_MARK_PER_WRONG,
      questionCount,
      title: record.title,
    };
  });

  return {
    items,
    page,
    pageSize,
    total,
    totalPages,
  };
}

export async function getOnlineTestTitleById(
  testId: string
): Promise<string | null> {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(testId)) {
    return null;
  }

  const record = await OnlineTestModel.findById(toObjectId(testId))
    .select({ title: 1 })
    .lean();

  return record?.title ?? null;
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
    negativeMarkPerWrong: DEFAULT_NEGATIVE_MARK_PER_WRONG,
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
  testId: string
): Promise<EditableOnlineTestRecord | null> {
  await connectToDatabase();

  const record = await OnlineTestModel.findById(toObjectId(testId)).lean();

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
  testId: string,
  input: OnlineTestMutationInput
): Promise<boolean> {
  await connectToDatabase();

  const updated = await OnlineTestModel.updateOne(
    {
      _id: toObjectId(testId),
    },
    {
      $set: {
        durationMinutes: input.durationMinutes,
        endTime: input.endTime,
        negativeMarkPerWrong: DEFAULT_NEGATIVE_MARK_PER_WRONG,
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

export async function deleteOnlineTest(testId: string): Promise<boolean> {
  await connectToDatabase();

  const deleted = await OnlineTestModel.deleteOne({
    _id: toObjectId(testId),
  });

  return deleted.deletedCount > 0;
}
