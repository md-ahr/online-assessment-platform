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
  userId: string;
  email: string;
  username: string;
}>;
