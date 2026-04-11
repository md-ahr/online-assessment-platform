export type QuestionType = "Checkbox" | "Radio" | "Text";
export type UserRole = "employer" | "candidate";

export type QuestionOptionDTO = Readonly<{
  id: string;
  label: string;
  content: string;
  isCorrect: boolean;
}>;

export type QuestionDTO = Readonly<{
  prompt: string;
  questionType: QuestionType;
  score: number;
  options: readonly QuestionOptionDTO[];
}>;

/** Candidate-facing question payload (correct answers are never exposed). */
export type CandidateQuestionOptionDTO = Readonly<{
  id: string;
  label: string;
  content: string;
}>;

export type CandidateQuestionDTO = Readonly<{
  prompt: string;
  questionType: QuestionType;
  score: number;
  options: readonly CandidateQuestionOptionDTO[];
}>;

export type CandidateOnlineTestSession = Readonly<{
  testId: string;
  title: string;
  durationMinutes: number | null;
  questions: readonly CandidateQuestionDTO[];
}>;

export type OnlineTestQuestionPreference = "MCQ" | "Checkbox" | "Text";

export type OnlineTestDashboardItem = Readonly<{
  id: string;
  title: string;
  candidates: number;
  questionSet: number;
  examSlots: number;
}>;

/** Public catalog row for candidates (no employer-only fields). */
export type OnlineTestCandidateListItem = Readonly<{
  id: string;
  title: string;
  durationMinutes: number | null;
  questionCount: number;
  /** 0 = no negative marking; otherwise penalty per wrong (e.g. -0.25). */
  negativeMarkPerWrong: number;
}>;

export type OnlineTestMutationInput = Readonly<{
  title: string;
  totalCandidates: number;
  totalSlots: number;
  totalQuestionSet: number;
  questionType: OnlineTestQuestionPreference;
  startTime: string;
  endTime: string;
  durationMinutes: number | null;
  questions: readonly QuestionDTO[];
}>;

export type AuthenticatedUser = Readonly<{
  role: UserRole;
  /** MongoDB document id (subject of the session JWT). */
  userId: string;
  email: string;
  /** Business user id from the User document (e.g. EMP001). */
  username: string;
  /** Display name from the User document. */
  name: string;
}>;
