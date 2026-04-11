import type { QuestionDraft } from "./question-editor.types";

export function stripHtml(html: string): string {
  return html
    .replaceAll(/<[^>]*>/g, " ")
    .replaceAll("&nbsp;", " ")
    .replaceAll(/\s+/g, " ")
    .trim();
}

export function formatQuestionType(
  type: QuestionDraft["questionType"]
): string {
  if (type === "Radio") {
    return "MCQ";
  }

  return type;
}
