"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { stripHtml } from "@/components/dashboard/create-online-test/create-online-test-wizard.utils";
import { buttonVariants } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import type { CandidateOnlineTestSession } from "@/lib/db/types";
import { cn } from "@/lib/utils";

import { TestTimeoutModal } from "./timeout-modal";

type CandidateTestSessionProps = Readonly<{
  candidateDisplayName: string;
  session: CandidateOnlineTestSession;
}>;

function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function optionDisplayText(content: string, label: string): string {
  const plain = stripHtml(content).trim();
  if (plain.length > 0) {
    return plain;
  }

  return `Option ${label}`;
}

export function CandidateTestSession({
  candidateDisplayName,
  session,
}: CandidateTestSessionProps) {
  const router = useRouter();
  const { durationMinutes, questions, testId, title } = session;
  const total = questions.length;

  const [questionIndex, setQuestionIndex] = useState(0);
  const [timedOut, setTimedOut] = useState(false);

  const [radioAnswers, setRadioAnswers] = useState<(string | null)[]>(() =>
    questions.map(() => null)
  );
  const [checkboxAnswers, setCheckboxAnswers] = useState<string[][]>(() =>
    questions.map(() => [])
  );
  const [textAnswers, setTextAnswers] = useState<string[]>(() =>
    questions.map(() => "<p></p>")
  );

  const initialSeconds = useMemo(() => {
    if (durationMinutes === null || !Number.isFinite(durationMinutes)) {
      return null;
    }

    const minutes = Math.max(0, Math.floor(durationMinutes));
    return minutes * 60;
  }, [durationMinutes]);

  const [secondsLeft, setSecondsLeft] = useState<number | null>(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (initialSeconds === null || initialSeconds <= 0) {
      return;
    }

    if (timedOut) {
      return;
    }

    const intervalId = globalThis.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === null) {
          return prev;
        }

        return prev <= 0 ? 0 : prev - 1;
      });
    }, 1000);

    return () => globalThis.clearInterval(intervalId);
  }, [initialSeconds, timedOut]);

  useEffect(() => {
    if (initialSeconds === null) {
      return;
    }

    if (secondsLeft === 0) {
      setTimedOut(true);
    }
  }, [initialSeconds, secondsLeft]);

  const current = questions[questionIndex];
  const isLast = questionIndex >= total - 1;

  const goNext = useCallback(() => {
    if (timedOut) {
      return;
    }

    if (isLast) {
      router.push(`/candidate/tests/${testId}/complete`);
      return;
    }

    setQuestionIndex((i) => Math.min(i + 1, total - 1));
  }, [isLast, router, testId, timedOut, total]);

  const setRadioForIndex = useCallback((index: number, optionId: string) => {
    setRadioAnswers((prev) => {
      const next = [...prev];
      next[index] = optionId;
      return next;
    });
  }, []);

  const toggleCheckboxForIndex = useCallback(
    (index: number, optionId: string) => {
      setCheckboxAnswers((prev) => {
        const next = prev.map((arr) => [...arr]);
        const row = next[index] ?? [];
        const has = row.includes(optionId);
        next[index] = has
          ? row.filter((id) => id !== optionId)
          : [...row, optionId];
        return next;
      });
    },
    []
  );

  const setTextForIndex = useCallback((index: number, html: string) => {
    setTextAnswers((prev) => {
      const next = [...prev];
      next[index] = html;
      return next;
    });
  }, []);

  if (total === 0) {
    return (
      <section className="container-wrapper min-h-[calc(100vh-161px)] py-8 pb-12 dark:bg-background">
        <div className="mx-auto flex w-full max-w-[849px] flex-col gap-6 px-4 sm:px-0">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm dark:border-border dark:bg-card">
            <h1 className="text-xl font-semibold text-[#334155] dark:text-foreground">
              {title}
            </h1>
            <p className="mt-2 text-sm text-[#64748B] dark:text-muted-foreground">
              This assessment does not have any questions yet.
            </p>
            <Link
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "mt-6 inline-flex h-10 rounded-xl border-[#6633FF] px-6 font-semibold text-[#6633FF] hover:bg-[#6633FF]/8 dark:text-white dark:hover:bg-[#6633FF]/15"
              )}
              href="/candidate"
            >
              Back to Online Tests
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const progressLabel = `Question (${questionIndex + 1}/${total})`;
  const timerLabel =
    secondsLeft === null
      ? "No time limit"
      : `${formatCountdown(secondsLeft)} left`;

  return (
    <>
      <section
        aria-label={title}
        className="container-wrapper min-h-[calc(100vh-161px)] py-8 pb-12 dark:bg-background"
        inert={timedOut}
      >
        <div className="mx-auto flex w-full max-w-[849px] flex-col gap-6 px-4 sm:px-0">
          <header className="box-border w-full rounded-2xl border border-[#E5E7EB] bg-white px-6 py-4 shadow-sm dark:border-border dark:bg-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xl leading-6 font-medium text-[#334155] dark:text-foreground">
                {progressLabel}
              </p>
              <div
                aria-live="polite"
                className="inline-flex min-h-[54px] items-center justify-center rounded-xl bg-[#F3F4F6] px-8 py-3 dark:bg-muted"
              >
                <span className="text-center text-xl leading-6 font-semibold text-[#334155] dark:text-foreground">
                  {timerLabel}
                </span>
              </div>
            </div>
          </header>

          <article className="box-border flex w-full flex-col gap-2 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-6 dark:border-border dark:bg-card">
            <div className="flex w-full min-w-0 flex-col gap-8">
              <div className="flex flex-col gap-6">
                <h2 className="text-xl leading-6 font-medium text-[#334155] dark:text-foreground">
                  <span className="sr-only">Question </span>Q{questionIndex + 1}
                  . {stripHtml(current.prompt) || "Question"}
                </h2>

                {current.questionType === "Text" ? (
                  <div className="w-full min-w-0">
                    <RichTextEditor
                      key={`text-${questionIndex}`}
                      className="min-h-[220px] border-[#E5E7EB] dark:border-border"
                      content={textAnswers[questionIndex] ?? "<p></p>"}
                      onChange={(html) => setTextForIndex(questionIndex, html)}
                    />
                  </div>
                ) : (
                  <fieldset className="m-0 flex w-full min-w-0 flex-col gap-4 border-0 p-0">
                    <legend className="sr-only">
                      {current.questionType === "Radio"
                        ? "Select one answer"
                        : "Select all that apply"}
                    </legend>
                    {current.options.map((option) => {
                      const selectedRadio = radioAnswers[questionIndex];
                      const selectedBoxes =
                        checkboxAnswers[questionIndex] ?? [];
                      const isRadio = current.questionType === "Radio";
                      const checked = isRadio
                        ? selectedRadio === option.id
                        : selectedBoxes.includes(option.id);

                      return (
                        <label
                          key={option.id}
                          className={cn(
                            "flex min-h-[52px] w-full cursor-pointer items-center gap-3 rounded-lg border border-[#E5E7EB] px-4 py-3.5 transition-colors dark:border-border",
                            checked &&
                              "border-[#6633FF] bg-[#6633FF]/6 dark:border-[#6633FF] dark:bg-[#6633FF]/10"
                          )}
                        >
                          <input
                            checked={checked}
                            className="sr-only"
                            name={
                              isRadio ? `question-${questionIndex}` : undefined
                            }
                            type={isRadio ? "radio" : "checkbox"}
                            value={option.id}
                            onChange={() => {
                              if (isRadio) {
                                setRadioForIndex(questionIndex, option.id);
                              } else {
                                toggleCheckboxForIndex(
                                  questionIndex,
                                  option.id
                                );
                              }
                            }}
                          />
                          {isRadio ? (
                            <span
                              aria-hidden
                              className={cn(
                                "grid size-6 shrink-0 place-items-center rounded-full border-2 border-[#A6A6A6] dark:border-muted-foreground",
                                checked && "border-[#6633FF]"
                              )}
                            >
                              {checked ? (
                                <span className="size-2.5 rounded-full bg-[#6633FF]" />
                              ) : null}
                            </span>
                          ) : (
                            <span
                              aria-hidden
                              className={cn(
                                "grid size-6 shrink-0 place-items-center rounded border-2 border-[#A6A6A6] dark:border-muted-foreground",
                                checked && "border-[#6633FF] bg-[#6633FF]"
                              )}
                            >
                              {checked ? (
                                <Check
                                  aria-hidden
                                  className="size-3.5 text-white"
                                  strokeWidth={3}
                                />
                              ) : null}
                            </span>
                          )}
                          <span className="min-w-0 flex-1 text-base leading-[1.2] font-normal text-[#334155] dark:text-foreground">
                            {optionDisplayText(option.content, option.label)}
                          </span>
                        </label>
                      );
                    })}
                  </fieldset>
                )}
              </div>

              <footer className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                <button
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 w-full rounded-xl border-[#E5E7EB] px-8 text-base font-semibold text-[#334155] sm:w-auto dark:border-border dark:text-foreground"
                  )}
                  type="button"
                  onClick={goNext}
                >
                  Skip this Question
                </button>
                <button
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "h-12 w-full rounded-xl bg-[#6633FF] px-8 text-base font-semibold text-white hover:bg-[#6633FF]/90 sm:w-auto"
                  )}
                  type="button"
                  onClick={goNext}
                >
                  {isLast ? "Submit" : "Save & Continue"}
                </button>
              </footer>
            </div>
          </article>
        </div>
      </section>
      {timedOut ? (
        <TestTimeoutModal displayName={candidateDisplayName} />
      ) : null}
    </>
  );
}
