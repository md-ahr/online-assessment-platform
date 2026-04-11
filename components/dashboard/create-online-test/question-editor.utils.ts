import type { QuestionOption, QuestionType } from "./question-editor.types";

export function getOptionLabel(index: number): string {
  return String.fromCodePoint(65 + index);
}

export function createOption(index: number): QuestionOption {
  return {
    id: `option-${index}-${crypto.randomUUID()}`,
    label: getOptionLabel(index),
    content: "<p></p>",
    isCorrect: false,
  };
}

export function createOptionsForType(
  questionType: QuestionType
): QuestionOption[] {
  if (questionType === "Text") {
    return [createOption(0)];
  }

  return [createOption(0), createOption(1), createOption(2)];
}

export function createEmptyDraft(defaultQuestionType: QuestionType): {
  prompt: string;
  questionType: QuestionType;
  score: string;
  options: QuestionOption[];
} {
  return {
    prompt: "<p></p>",
    questionType: defaultQuestionType,
    score: "1",
    options: createOptionsForType(defaultQuestionType),
  };
}

export function getTextFromRichHtml(html: string): string {
  return html
    .replaceAll(/<[^>]*>/g, " ")
    .replaceAll("&nbsp;", " ")
    .replaceAll("\u00A0", " ")
    .replaceAll(/\s+/g, " ")
    .trim();
}

export function isRichTextEmpty(html: string): boolean {
  return getTextFromRichHtml(html).length === 0;
}
