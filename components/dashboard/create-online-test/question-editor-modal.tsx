"use client";

import { RichTextEditor } from "@/components/ui/rich-text-editor";

import { useQuestionEditorDraft } from "./hooks/use-question-editor-draft";
import type {
  QuestionDraft,
  QuestionEditorModalProps,
} from "./question-editor.types";
import { QuestionEditorFooter } from "./ui/question-editor-footer";
import { QuestionEditorModalHeader } from "./ui/question-editor-modal-header";
import { QuestionEditorOptions } from "./ui/question-editor-options";

export type { QuestionDraft } from "./question-editor.types";

export function QuestionEditorModal({
  open,
  questionNumber,
  defaultQuestionType,
  initialQuestion,
  onClose,
  onQuestionTypeChange,
  onSave,
}: QuestionEditorModalProps) {
  const {
    addOption,
    applyQuestionType,
    buildDraftPayload,
    canAddOptions,
    editorVersion,
    optionErrors,
    prompt,
    promptError,
    questionType,
    removeOption,
    resetDraft,
    score,
    selectedRadioOption,
    setPrompt,
    setScore,
    setSingleCorrectOption,
    toggleCorrectOption,
    updateOptionContent,
    validateDraft,
    visibleOptions,
  } = useQuestionEditorDraft({
    defaultQuestionType,
    initialQuestion,
    onQuestionTypeChange,
  });

  function saveQuestion(saveAndAddMore: boolean) {
    if (!validateDraft()) {
      return;
    }

    const payload: QuestionDraft = buildDraftPayload();
    onSave(payload, saveAndAddMore);

    if (saveAndAddMore) {
      resetDraft(questionType);
      return;
    }

    onClose();
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 p-4">
      <div className="flex max-h-[95vh] w-full max-w-[954px] flex-col gap-5 overflow-hidden rounded-2xl bg-card p-6">
        <QuestionEditorModalHeader
          questionNumber={questionNumber}
          questionType={questionType}
          score={score}
          onClose={onClose}
          onQuestionTypeChange={applyQuestionType}
          onScoreChange={setScore}
        />

        <div className="max-h-[68vh] space-y-4 overflow-y-auto pr-1">
          <RichTextEditor
            key={`question-${editorVersion}`}
            className="h-[140px]"
            content={prompt}
            onChange={setPrompt}
          />
          {promptError ? (
            <p className="text-sm text-[#EA5055]">{promptError}</p>
          ) : null}

          <QuestionEditorOptions
            canAddOptions={canAddOptions}
            editorVersion={editorVersion}
            optionErrors={optionErrors}
            options={visibleOptions}
            questionType={questionType}
            selectedRadioOption={selectedRadioOption}
            onAddOption={addOption}
            onRemoveOption={removeOption}
            onSetSingleCorrectOption={setSingleCorrectOption}
            onToggleCorrectOption={toggleCorrectOption}
            onUpdateOptionContent={updateOptionContent}
          />
        </div>

        <QuestionEditorFooter
          onSave={() => saveQuestion(false)}
          onSaveAndAddMore={() => saveQuestion(true)}
        />
      </div>
    </div>
  );
}
