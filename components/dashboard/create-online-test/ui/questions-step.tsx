import { Check as StatusCheck } from "@/components/svg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  formatQuestionType,
  stripHtml,
} from "../create-online-test-wizard.utils";
import type { QuestionDraft } from "../question-editor.types";

type QuestionsStepProps = Readonly<{
  isSubmitting?: boolean;
  onEditQuestion: (index: number, question: QuestionDraft) => void;
  onSaveOnlineTest?: () => void;
  onOpenAddQuestion: () => void;
  onReturnToBasicInfo?: () => void;
  onRemoveQuestion: (index: number) => void;
  questions: readonly QuestionDraft[];
  submitLabel?: string;
}>;

export function QuestionsStep({
  isSubmitting = false,
  onEditQuestion,
  onReturnToBasicInfo,
  onSaveOnlineTest,
  onOpenAddQuestion,
  onRemoveQuestion,
  questions,
  submitLabel = "Save Online Test",
}: QuestionsStepProps) {
  return (
    <div className="flex w-full max-w-[954px] flex-col gap-6">
      {questions.map((question, index) => (
        <article
          key={`${question.questionType}-${question.score}-${question.options.map((option) => option.id).join("-")}`}
          className="w-full rounded-2xl bg-card p-6"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-base leading-[150%] font-semibold text-secondary dark:text-foreground">
                Question {index + 1}
              </h3>
              <div className="flex items-center gap-3">
                <span className="rounded-xl border border-border px-3 py-1 text-sm leading-[150%] text-[#64748B]">
                  {formatQuestionType(question.questionType)}
                </span>
                <span className="rounded-xl border border-border px-3 py-1 text-sm leading-[150%] text-[#64748B]">
                  {question.score} pt
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-base leading-[150%] font-semibold text-black dark:text-foreground">
                {stripHtml(question.prompt) || "Untitled question"}
              </p>
            </div>

            {question.questionType === "Text" ? (
              <p className="text-base leading-[150%] text-secondary dark:text-foreground">
                {stripHtml(question.options[0]?.content ?? "") ||
                  "No answer text"}
              </p>
            ) : (
              <div className="space-y-4">
                {question.options.map((option) => {
                  const optionText =
                    stripHtml(option.content) || `${option.label}. Option`;

                  return (
                    <div
                      key={option.id}
                      className={
                        option.isCorrect
                          ? "rounded-lg bg-[#F3F4F6] px-3 py-2"
                          : "px-3"
                      }
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p
                          className={cn(
                            "text-base leading-[150%]",
                            option.isCorrect
                              ? "text-secondary"
                              : "text-secondary dark:text-foreground"
                          )}
                        >
                          {option.label}. {optionText}
                        </p>
                        {option.isCorrect ? (
                          <StatusCheck
                            aria-hidden
                            className="size-5 shrink-0"
                          />
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between gap-4">
                <button
                  className="text-base leading-[150%] font-medium text-primary"
                  type="button"
                  onClick={() => onEditQuestion(index, question)}
                >
                  Edit
                </button>
                <button
                  className="text-base leading-[150%] font-medium text-[#EA5055]"
                  type="button"
                  onClick={() => onRemoveQuestion(index)}
                >
                  Remove From Exam
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}

      <div className="w-full rounded-2xl bg-card p-6">
        <div
          className={cn(
            "grid grid-cols-1 gap-4 md:grid-cols-3",
            questions?.length > 0 ? "md:grid-cols-3" : "md:grid-cols-2"
          )}
        >
          <Button
            className="h-14 w-full rounded-xl border border-border bg-transparent text-base leading-[150%] font-semibold text-secondary hover:bg-muted/40 dark:text-foreground"
            type="button"
            variant="outline"
            onClick={onReturnToBasicInfo}
          >
            Back to Basic Info
          </Button>
          <Button
            className="h-14 w-full rounded-xl text-base leading-[150%] font-semibold text-white dark:text-white"
            type="button"
            onClick={onOpenAddQuestion}
          >
            Add Question
          </Button>
          {questions?.length > 0 && (
            <Button
              className="h-14 w-full rounded-xl bg-green-500 text-base leading-[150%] font-semibold text-white hover:bg-green-600 dark:text-white"
              disabled={isSubmitting || questions.length === 0}
              type="button"
              onClick={onSaveOnlineTest}
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
