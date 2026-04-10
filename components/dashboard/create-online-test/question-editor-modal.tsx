"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Trash } from "@/components/svg";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
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

type QuestionType = "Checkbox" | "Radio" | "Text";

type QuestionOption = Readonly<{
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

type QuestionEditorModalProps = Readonly<{
  open: boolean;
  questionNumber: number;
  defaultQuestionType: QuestionType;
  initialQuestion?: QuestionDraft | null;
  onClose: () => void;
  onQuestionTypeChange?: (questionType: QuestionType) => void;
  onSave: (question: QuestionDraft, saveAndAddMore: boolean) => void;
}>;

function getOptionLabel(index: number): string {
  return String.fromCodePoint(65 + index);
}

function createOption(index: number): QuestionOption {
  return {
    id: `option-${index}-${crypto.randomUUID()}`,
    label: getOptionLabel(index),
    content: "<p></p>",
    isCorrect: false,
  };
}

function createInitialOptions(): QuestionOption[] {
  return [createOption(0), createOption(1), createOption(2)];
}

function createTextOptions(): QuestionOption[] {
  return [createOption(0)];
}

function createOptionsForType(questionType: QuestionType): QuestionOption[] {
  if (questionType === "Text") {
    return createTextOptions();
  }

  return createInitialOptions();
}

function createEmptyDraft(defaultQuestionType: QuestionType): {
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

export function QuestionEditorModal({
  open,
  questionNumber,
  defaultQuestionType,
  initialQuestion,
  onClose,
  onQuestionTypeChange,
  onSave,
}: QuestionEditorModalProps) {
  const [prompt, setPrompt] = useState(initialQuestion?.prompt ?? "<p></p>");
  const [score, setScore] = useState(initialQuestion?.score ?? "1");
  const [questionType, setQuestionType] = useState<QuestionType>(
    initialQuestion?.questionType ?? defaultQuestionType
  );
  const [options, setOptions] = useState<QuestionOption[]>(
    initialQuestion
      ? [...initialQuestion.options]
      : createOptionsForType(defaultQuestionType)
  );
  const [editorVersion, setEditorVersion] = useState(0);

  const canAddOptions = questionType !== "Text";

  function resetDraft(nextQuestionType: QuestionType) {
    const next = createEmptyDraft(nextQuestionType);
    setPrompt(next.prompt);
    setScore(next.score);
    setQuestionType(next.questionType);
    setOptions(next.options);
    setEditorVersion((v) => v + 1);
  }

  function setSingleCorrectOption(optionId: string) {
    setOptions((prev) =>
      prev.map((item) => ({ ...item, isCorrect: item.id === optionId }))
    );
  }

  function toggleCorrectOption(optionId: string, checked: boolean) {
    setOptions((prev) =>
      prev.map((item) =>
        item.id === optionId ? { ...item, isCorrect: checked } : item
      )
    );
  }

  function removeOption(optionId: string) {
    setOptions((prev) =>
      prev
        .filter((item) => item.id !== optionId)
        .map((item, index) => ({
          ...item,
          label: getOptionLabel(index),
        }))
    );
  }

  function updateOptionContent(optionId: string, content: string) {
    setOptions((prev) =>
      prev.map((item) => (item.id === optionId ? { ...item, content } : item))
    );
  }

  function applyQuestionType(nextType: QuestionType) {
    setQuestionType(nextType);
    setOptions(createOptionsForType(nextType));
    onQuestionTypeChange?.(nextType);
  }

  function saveQuestion(saveAndAddMore: boolean) {
    const payload: QuestionDraft = {
      options,
      prompt,
      questionType,
      score,
    };

    onSave(payload, saveAndAddMore);

    if (saveAndAddMore) {
      resetDraft(questionType);
      return;
    }

    onClose();
  }

  const visibleOptions = useMemo(() => options, [options]);
  const selectedRadioOption = useMemo(
    () => options.find((option) => option.isCorrect)?.id ?? null,
    [options]
  );

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 p-4">
      <div className="flex max-h-[95vh] w-full max-w-[954px] flex-col gap-5 overflow-hidden rounded-2xl bg-card p-6">
        <div className="flex min-w-0 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-6 items-center justify-center rounded-full border border-[#9CA3AF] text-sm leading-[150%] font-normal text-secondary">
              {questionNumber}
            </span>
            <h3 className="text-base leading-[150%] font-semibold text-secondary">
              Question {questionNumber}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm leading-[140%] font-semibold text-secondary">
                Score:
              </span>
              <Input
                className="h-8 min-h-8 w-12 rounded-lg px-2 py-1 text-center text-sm font-semibold"
                inputMode="numeric"
                value={score}
                onChange={(event) => setScore(event.target.value)}
              />
            </div>

            <Select
              value={questionType}
              onValueChange={(value) => {
                applyQuestionType(value as QuestionType);
              }}
            >
              <SelectTrigger className="h-8 min-h-8 w-[128px] rounded-lg px-3 py-1 text-sm font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectPortal>
                <SelectPositioner>
                  <SelectPopup>
                    <SelectList>
                      {(["Checkbox", "Radio", "Text"] as const).map((type) => (
                        <SelectItem key={type} value={type}>
                          <SelectItemText>{type}</SelectItemText>
                        </SelectItem>
                      ))}
                    </SelectList>
                  </SelectPopup>
                </SelectPositioner>
              </SelectPortal>
            </Select>

            <button
              className="inline-flex size-8 items-center justify-center rounded-md text-secondary hover:bg-muted"
              type="button"
              onClick={onClose}
            >
              <Trash aria-hidden className="size-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[68vh] space-y-4 overflow-y-auto pr-1">
          <RichTextEditor
            key={`question-${editorVersion}`}
            content={prompt}
            onChange={setPrompt}
            className="h-[140px]"
          />

          {visibleOptions.map((option) => (
            <div key={option.id} className="space-y-2 pl-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-6 items-center justify-center rounded-full border border-[#9CA3AF] text-sm leading-[150%] text-secondary">
                    {option.label}
                  </span>

                  {questionType === "Checkbox" ? (
                    <div className="flex items-center gap-2 text-sm leading-[140%] font-normal text-secondary">
                      <Checkbox
                        checked={option.isCorrect}
                        onCheckedChange={(checked) =>
                          toggleCorrectOption(option.id, Boolean(checked))
                        }
                      />
                      Set as correct answer
                    </div>
                  ) : null}

                  {questionType === "Radio" ? (
                    <div className="flex items-center gap-2 text-sm leading-[140%] font-normal text-secondary">
                      <RadioGroup
                        value={selectedRadioOption ?? undefined}
                        onValueChange={(value) =>
                          setSingleCorrectOption(String(value))
                        }
                      >
                        <RadioGroupItem
                          aria-label={`Set option ${option.label} as correct answer`}
                          value={option.id}
                        />
                      </RadioGroup>
                      Set as correct answer
                    </div>
                  ) : null}
                </div>

                <button
                  className="inline-flex size-8 items-center justify-center rounded-md text-secondary hover:bg-muted disabled:opacity-40"
                  disabled={
                    visibleOptions.length <= 2 || questionType === "Text"
                  }
                  type="button"
                  onClick={() => removeOption(option.id)}
                >
                  <Trash aria-hidden className="size-5" />
                </button>
              </div>

              <RichTextEditor
                className="h-[140px]"
                key={`option-${option.id}-${editorVersion}`}
                content={option.content}
                onChange={(value) => updateOptionContent(option.id, value)}
              />
            </div>
          ))}

          {canAddOptions ? (
            <button
              className="inline-flex items-center gap-2 pl-5 text-sm leading-[150%] font-medium text-secondary hover:text-primary"
              type="button"
              onClick={() => {
                setOptions((prev) => [...prev, createOption(prev.length)]);
              }}
            >
              <Plus aria-hidden className="size-4 text-primary" />
              Another options
            </button>
          ) : null}
        </div>

        <div className="mt-1 flex items-center justify-end gap-4 border-t border-border pt-4">
          <Button
            className="h-12 min-w-[180px] rounded-xl border border-primary bg-transparent text-base font-semibold text-primary hover:bg-primary/8"
            type="button"
            variant="outline"
            onClick={() => saveQuestion(false)}
          >
            Save
          </Button>
          <Button
            className="h-12 min-w-[180px] rounded-xl text-base font-semibold text-white"
            type="button"
            onClick={() => saveQuestion(true)}
          >
            Save &amp; Add More
          </Button>
        </div>
      </div>
    </div>
  );
}
