"use client";

import { Check } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

import { Check as StatusCheck, Edit } from "@/components/svg";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectItemText,
  SelectList,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import {
  type QuestionDraft,
  QuestionEditorModal,
} from "./question-editor-modal";

const basicInfoSchema = z.object({
  title: z.string().trim().min(1, "Online Test Title is required"),
  totalCandidates: z
    .string()
    .trim()
    .regex(/^\d+$/, "Total Candidates must be a valid number"),
  totalSlots: z.string().trim().min(1, "Total Slots is required"),
  totalQuestionSet: z.string().trim().min(1, "Total Question Set is required"),
  questionType: z.string().trim().min(1, "Question Type is required"),
  startTime: z.string().trim().min(1, "Start Time is required"),
  endTime: z.string().trim().min(1, "End Time is required"),
  duration: z.string().trim().optional(),
});

type OnlineTestFormValues = z.infer<typeof basicInfoSchema>;
type WizardStep = 1 | 2;
type BasicInfoView = "form" | "summary";

const SLOT_OPTIONS = ["1", "2", "3", "4", "5"] as const;
const QUESTION_SET_OPTIONS = ["1", "2", "3", "4", "5"] as const;
const QUESTION_TYPE_OPTIONS = ["MCQ", "Checkbox", "Text"] as const;

type CreateOnlineTestWizardProps = Readonly<{
  onCancel: () => void;
  initialValues?: Partial<OnlineTestFormValues>;
}>;

function StepBadge({
  label,
  stepNumber,
  variant,
}: Readonly<{
  label: string;
  stepNumber: number;
  variant: "active" | "completed" | "upcoming";
}>) {
  const isActive = variant === "active";
  const isCompleted = variant === "completed";

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "flex size-6 items-center justify-center rounded-full text-sm leading-[130%] font-medium",
          isActive && "bg-primary text-white",
          isCompleted && "bg-primary text-white",
          variant === "upcoming" && "bg-[#D1D5DB] text-white"
        )}
      >
        {isCompleted ? <Check aria-hidden className="size-3.5" /> : stepNumber}
      </span>
      <span
        className={cn(
          "text-sm leading-[150%]",
          isActive ? "font-medium text-primary" : "font-normal text-[#64748B]",
          isCompleted && "font-medium text-secondary"
        )}
      >
        {label}
      </span>
    </div>
  );
}

function WizardHeader({
  currentStep,
  onCancel,
}: Readonly<{ currentStep: WizardStep; onCancel: () => void }>) {
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-xl leading-[140%] font-semibold text-secondary dark:text-foreground">
          Manage Online Test
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <StepBadge
              label="Basic Info"
              stepNumber={1}
              variant={currentStep === 1 ? "active" : "completed"}
            />
            <span
              aria-hidden
              className="h-px w-20 shrink-0 bg-[#4B5563] dark:bg-border"
            />
            <StepBadge
              label="Questions Sets"
              stepNumber={2}
              variant={currentStep === 2 ? "active" : "upcoming"}
            />
          </div>

          <Button
            className="h-10 min-w-[170px] rounded-xl border border-border px-6 py-2.5 text-sm leading-[140%] font-semibold text-secondary dark:text-foreground"
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

function RequiredLabel({ label }: Readonly<{ label: string }>) {
  return (
    <span className="inline-flex items-center gap-1">
      <span>{label}</span>
      <span className="text-[#EA5055]">*</span>
    </span>
  );
}

function BasicInfoStep({
  values,
  onEdit,
}: Readonly<{ values: OnlineTestFormValues; onEdit: () => void }>) {
  return (
    <div className="min-h-[calc(100vh-543px)] w-full rounded-2xl bg-card p-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[18px] leading-[140%] font-semibold text-secondary dark:text-foreground">
            Basic Information
          </h2>
          <button
            className="inline-flex items-center gap-1.5 text-base leading-[150%] font-semibold text-primary"
            type="button"
            onClick={onEdit}
          >
            <Edit aria-hidden className="size-4" />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-4 text-secondary sm:grid-cols-2 lg:grid-cols-4 dark:text-foreground">
          <div className="sm:col-span-2 lg:col-span-4">
            <p className="text-sm leading-[150%] font-normal text-[#64748B]">
              Online Test Title
            </p>
            <p className="text-base leading-[150%] font-medium">
              {values.title}
            </p>
          </div>
          <SummaryItem
            label="Total Candidates"
            value={values.totalCandidates}
          />
          <SummaryItem label="Total Slots" value={values.totalSlots} />
          <SummaryItem
            label="Total Question Set"
            value={values.totalQuestionSet}
          />
          <SummaryItem
            label="Duration Per Slots (Minutes)"
            value={values.duration || "-"}
          />
          <SummaryItem label="Question Type" value={values.questionType} />
        </div>
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm leading-[150%] font-normal text-[#64748B]">
        {label}
      </p>
      <p className="text-base leading-[150%] font-medium">{value}</p>
    </div>
  );
}

function stripHtml(html: string): string {
  return html
    .replaceAll(/<[^>]*>/g, " ")
    .replaceAll("&nbsp;", " ")
    .replaceAll(/\s+/g, " ")
    .trim();
}

function formatQuestionType(type: QuestionDraft["questionType"]): string {
  if (type === "Radio") {
    return "MCQ";
  }
  return type;
}

export function CreateOnlineTestWizard({
  onCancel,
  initialValues,
}: CreateOnlineTestWizardProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [basicInfoView, setBasicInfoView] = useState<BasicInfoView>("form");
  const [savedValues, setSavedValues] = useState<OnlineTestFormValues | null>(
    null
  );
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);
  const [questionModalInstance, setQuestionModalInstance] = useState(0);
  const [questionModalType, setQuestionModalType] = useState<
    "Checkbox" | "Radio" | "Text"
  >("Checkbox");

  const defaultValues = useMemo<OnlineTestFormValues>(
    () => ({
      title: initialValues?.title ?? "",
      totalCandidates: initialValues?.totalCandidates ?? "",
      totalSlots: initialValues?.totalSlots ?? "",
      totalQuestionSet: initialValues?.totalQuestionSet ?? "",
      questionType: initialValues?.questionType ?? "",
      startTime: initialValues?.startTime ?? "",
      endTime: initialValues?.endTime ?? "",
      duration: initialValues?.duration ?? "",
    }),
    [initialValues]
  );

  const form = useForm<OnlineTestFormValues>({
    defaultValues,
  });

  function handleBasicInfoSubmit(values: OnlineTestFormValues) {
    const parsed = basicInfoSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const fieldName = issue.path[0];

        if (typeof fieldName !== "string") {
          continue;
        }

        form.setError(fieldName as keyof OnlineTestFormValues, {
          message: issue.message,
          type: "manual",
        });
      }
      return;
    }

    setSavedValues(parsed.data);
    setStep(1);
    setBasicInfoView("summary");
  }

  function handleEditBasicInfo() {
    setStep(1);
    setBasicInfoView("form");
  }

  function handleContinueToQuestions() {
    if (!savedValues) {
      return;
    }
    setStep(2);
  }

  function getDefaultQuestionType(): "Checkbox" | "Radio" | "Text" {
    if (questionModalType) {
      return questionModalType;
    }

    const selectedType = savedValues?.questionType;
    if (
      selectedType === "Checkbox" ||
      selectedType === "Radio" ||
      selectedType === "Text"
    ) {
      return selectedType;
    }

    return "Checkbox";
  }

  const editingQuestion =
    editingQuestionIndex === null
      ? null
      : (questions[editingQuestionIndex] ?? null);
  const currentQuestionNumber =
    editingQuestionIndex === null
      ? questions.length + 1
      : editingQuestionIndex + 1;

  function openAddQuestionModal() {
    setEditingQuestionIndex(null);
    setQuestionModalInstance((value) => value + 1);
    setIsQuestionModalOpen(true);
  }

  function openEditQuestionModal(
    index: number,
    questionType: QuestionDraft["questionType"]
  ) {
    setEditingQuestionIndex(index);
    setQuestionModalType(questionType);
    setQuestionModalInstance((value) => value + 1);
    setIsQuestionModalOpen(true);
  }

  function removeQuestion(index: number) {
    setQuestions((prev) =>
      prev.filter((_, questionIndex) => questionIndex !== index)
    );
  }

  let stepContent: ReactNode;

  if (step === 1 && basicInfoView === "form") {
    stepContent = (
      <div className="flex w-full max-w-[954px] flex-col gap-6">
        <div className="w-full rounded-2xl bg-card p-6">
          <Form {...form}>
            <form
              className="flex flex-col gap-5"
              onSubmit={form.handleSubmit(handleBasicInfoSubmit)}
            >
              <h2 className="text-[18px] leading-[140%] font-semibold text-secondary dark:text-foreground">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-secondary dark:text-foreground">
                        <RequiredLabel label="Online Test Title" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter online test title"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="totalCandidates"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-secondary dark:text-foreground">
                          <RequiredLabel label="Total Candidates" />
                        </FormLabel>
                        <FormControl>
                          <Input
                            inputMode="numeric"
                            placeholder="Enter total candidates"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalSlots"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-secondary dark:text-foreground">
                          <RequiredLabel label="Total Slots" />
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger aria-label="Select total slots">
                              <SelectValue placeholder="Select total slots" />
                            </SelectTrigger>
                            <SelectPortal>
                              <SelectPositioner>
                                <SelectPopup>
                                  <SelectList>
                                    {SLOT_OPTIONS.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        <SelectItemText>
                                          {option}
                                        </SelectItemText>
                                      </SelectItem>
                                    ))}
                                  </SelectList>
                                </SelectPopup>
                              </SelectPositioner>
                            </SelectPortal>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="totalQuestionSet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-secondary dark:text-foreground">
                          <RequiredLabel label="Total Question Set" />
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger aria-label="Select total question set">
                              <SelectValue placeholder="Select total question set" />
                            </SelectTrigger>
                            <SelectPortal>
                              <SelectPositioner>
                                <SelectPopup>
                                  <SelectList>
                                    {QUESTION_SET_OPTIONS.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        <SelectItemText>
                                          {option}
                                        </SelectItemText>
                                      </SelectItem>
                                    ))}
                                  </SelectList>
                                </SelectPopup>
                              </SelectPositioner>
                            </SelectPortal>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="questionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-secondary dark:text-foreground">
                          <RequiredLabel label="Question Type" />
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger aria-label="Select question type">
                              <SelectValue placeholder="Select question type" />
                            </SelectTrigger>
                            <SelectPortal>
                              <SelectPositioner>
                                <SelectPopup>
                                  <SelectList>
                                    {QUESTION_TYPE_OPTIONS.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        <SelectItemText>
                                          {option}
                                        </SelectItemText>
                                      </SelectItem>
                                    ))}
                                  </SelectList>
                                </SelectPopup>
                              </SelectPositioner>
                            </SelectPortal>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_158px]">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-secondary dark:text-foreground">
                          <RequiredLabel label="Start Time" />
                        </FormLabel>
                        <FormControl>
                          <DateTimePicker
                            placeholder="Select start time"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-secondary dark:text-foreground">
                          <RequiredLabel label="End Time" />
                        </FormLabel>
                        <FormControl>
                          <DateTimePicker
                            placeholder="Select end time"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-secondary dark:text-foreground">
                          Duration
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Duration Time"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="mt-1 flex w-full items-center justify-between gap-5 rounded-2xl bg-card py-2">
                <Button
                  className="h-12 min-w-[180px] rounded-xl border border-border bg-transparent px-8 py-3 text-base leading-[150%] font-semibold text-secondary hover:bg-muted/40 dark:text-foreground"
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>

                <Button
                  className="h-12 min-w-[180px] rounded-xl px-8 py-3 text-base leading-[150%] font-semibold text-white dark:text-white"
                  type="submit"
                >
                  Save &amp; Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    );
  } else if (step === 1 && savedValues) {
    stepContent = (
      <div className="flex w-full max-w-[954px] flex-col gap-6">
        <BasicInfoStep values={savedValues} onEdit={handleEditBasicInfo} />

        <div className="w-full rounded-2xl bg-card p-6">
          <div className="flex w-full items-center justify-between gap-5">
            <Button
              className="h-12 min-w-[180px] rounded-xl border border-border bg-transparent px-8 py-3 text-base leading-[150%] font-semibold text-secondary hover:bg-muted/40 dark:text-foreground"
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>

            <Button
              className="h-12 min-w-[180px] rounded-xl px-8 py-3 text-base leading-[150%] font-semibold text-white dark:text-white"
              type="button"
              onClick={handleContinueToQuestions}
            >
              Save &amp; Continue
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    stepContent = (
      <div className="flex min-h-[calc(100vh-423px)] w-full max-w-[954px] flex-col gap-6">
        {questions.map((question, index) => (
          <article
            key={`${index}-${question.questionType}-${question.score}`}
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
                          <p className="text-base leading-[150%] text-secondary dark:text-foreground">
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
                    onClick={() =>
                      openEditQuestionModal(index, question.questionType)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="text-base leading-[150%] font-medium text-[#EA5055]"
                    type="button"
                    onClick={() => removeQuestion(index)}
                  >
                    Remove From Exam
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}

        <div className="w-full rounded-2xl bg-card p-6">
          <Button
            className="h-14 w-full rounded-xl text-base leading-[150%] font-semibold text-white dark:text-white"
            type="button"
            onClick={openAddQuestionModal}
          >
            Add Question
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
      <WizardHeader currentStep={step} onCancel={onCancel} />
      {stepContent}
      <QuestionEditorModal
        key={`question-modal-${questionModalInstance}-${editingQuestionIndex ?? "new"}`}
        defaultQuestionType={getDefaultQuestionType()}
        initialQuestion={editingQuestion}
        open={step === 2 && isQuestionModalOpen}
        questionNumber={currentQuestionNumber}
        onClose={() => {
          setIsQuestionModalOpen(false);
          setEditingQuestionIndex(null);
        }}
        onQuestionTypeChange={setQuestionModalType}
        onSave={(question, saveAndAddMore) => {
          setQuestions((prev) => {
            if (editingQuestionIndex === null) {
              return [...prev, question];
            }

            return prev.map((item, index) =>
              index === editingQuestionIndex ? question : item
            );
          });
          setQuestionModalType(question.questionType);
          if (editingQuestionIndex !== null && saveAndAddMore === false) {
            setEditingQuestionIndex(null);
            setIsQuestionModalOpen(false);
            return;
          }

          if (editingQuestionIndex !== null && saveAndAddMore) {
            setEditingQuestionIndex(null);
            return;
          }

          if (saveAndAddMore === false) {
            setIsQuestionModalOpen(false);
          }
        }}
      />
    </div>
  );
}
