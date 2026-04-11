export type QuestionType = "Checkbox" | "Radio" | "Text";

export type QuestionOption = Readonly<{
  id: string;
  label: string;
  content: string;
  isCorrect: boolean;
}>;

export type QuestionDraft = Readonly<{
  prompt: string;
  questionType: QuestionType;
  score: string;
  options: readonly QuestionOption[];
}>;

export type QuestionEditorModalProps = Readonly<{
  open: boolean;
  questionNumber: number;
  defaultQuestionType: QuestionType;
  initialQuestion?: QuestionDraft | null;
  onClose: () => void;
  onQuestionTypeChange?: (questionType: QuestionType) => void;
  onSave: (question: QuestionDraft, saveAndAddMore: boolean) => void;
}>;
