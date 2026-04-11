import type { QuestionDraft, QuestionType } from "./question-editor.types";

export type OnlineTestFormValues = {
  title: string;
  totalCandidates: string;
  totalSlots: string;
  totalQuestionSet: string;
  questionType: string;
  startTime: string;
  endTime: string;
  duration?: string;
};

export type WizardStep = 1 | 2;
export type BasicInfoView = "form" | "summary";
export type QuestionModalType = QuestionType;

export type CreateOnlineTestWizardProps = Readonly<{
  initialQuestions?: readonly QuestionDraft[];
  onCancel: () => void;
  onSubmit: (payload: {
    basicInfo: OnlineTestFormValues;
    questions: readonly QuestionDraft[];
  }) => Promise<{
    message: string;
    success: boolean;
  }>;
  initialValues?: Partial<OnlineTestFormValues>;
  submitLabel?: string;
}>;

export type QuestionSaveParams = Readonly<{
  question: QuestionDraft;
  saveAndAddMore: boolean;
}>;
