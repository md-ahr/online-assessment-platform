import { useMemo, useState } from "react";

import type {
  QuestionDraft,
  QuestionOption,
  QuestionType,
} from "../question-editor.types";
import {
  createEmptyDraft,
  createOption,
  createOptionsForType,
  getOptionLabel,
  isRichTextEmpty,
} from "../question-editor.utils";

type UseQuestionEditorDraftParams = Readonly<{
  defaultQuestionType: QuestionType;
  initialQuestion?: QuestionDraft | null;
  onQuestionTypeChange?: (questionType: QuestionType) => void;
}>;

export function useQuestionEditorDraft({
  defaultQuestionType,
  initialQuestion,
  onQuestionTypeChange,
}: UseQuestionEditorDraftParams) {
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
  const [promptError, setPromptError] = useState<string | null>(null);
  const [optionErrors, setOptionErrors] = useState<Record<string, string>>({});

  const canAddOptions = questionType !== "Text";
  const visibleOptions = useMemo(() => options, [options]);
  const selectedRadioOption = useMemo(
    () => options.find((option) => option.isCorrect)?.id ?? null,
    [options]
  );

  function resetDraft(nextQuestionType: QuestionType) {
    const next = createEmptyDraft(nextQuestionType);
    setPrompt(next.prompt);
    setScore(next.score);
    setQuestionType(next.questionType);
    setOptions(next.options);
    setPromptError(null);
    setOptionErrors({});
    setEditorVersion((value) => value + 1);
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
    setOptionErrors((prev) => {
      const next = { ...prev };
      delete next[optionId];
      return next;
    });
  }

  function updateOptionContent(optionId: string, content: string) {
    setOptions((prev) =>
      prev.map((item) => (item.id === optionId ? { ...item, content } : item))
    );
    setOptionErrors((prev) => {
      if (!prev[optionId]) {
        return prev;
      }

      if (isRichTextEmpty(content)) {
        return prev;
      }

      const next = { ...prev };
      delete next[optionId];
      return next;
    });
  }

  function addOption() {
    setOptions((prev) => [...prev, createOption(prev.length)]);
  }

  function applyQuestionType(nextType: QuestionType) {
    setQuestionType(nextType);
    setOptions(createOptionsForType(nextType));
    setOptionErrors({});
    onQuestionTypeChange?.(nextType);
  }

  function updatePrompt(content: string) {
    setPrompt(content);
    if (promptError && !isRichTextEmpty(content)) {
      setPromptError(null);
    }
  }

  function validateDraft(): boolean {
    const nextOptionErrors: Record<string, string> = {};

    if (isRichTextEmpty(prompt)) {
      setPromptError("Question is required");
    } else {
      setPromptError(null);
    }

    for (const option of options) {
      if (isRichTextEmpty(option.content)) {
        nextOptionErrors[option.id] = `Option ${option.label} is required`;
      }
    }

    setOptionErrors(nextOptionErrors);

    return (
      !isRichTextEmpty(prompt) && Object.keys(nextOptionErrors).length === 0
    );
  }

  function buildDraftPayload(): QuestionDraft {
    return {
      options,
      prompt,
      questionType,
      score,
    };
  }

  return {
    addOption,
    applyQuestionType,
    buildDraftPayload,
    canAddOptions,
    editorVersion,
    prompt,
    promptError,
    questionType,
    removeOption,
    resetDraft,
    score,
    selectedRadioOption,
    setPrompt: updatePrompt,
    setScore,
    setSingleCorrectOption,
    toggleCorrectOption,
    updateOptionContent,
    validateDraft,
    visibleOptions,
    optionErrors,
  };
}
