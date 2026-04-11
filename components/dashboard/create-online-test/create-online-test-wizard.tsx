"use client";

import type { ReactNode } from "react";
import { useTransition } from "react";
import { toast } from "sonner";

import type { CreateOnlineTestWizardProps } from "./create-online-test-wizard.types";
import { useCreateOnlineTestWizard } from "./hooks/use-create-online-test-wizard";
import { QuestionEditorModal } from "./question-editor-modal";
import { BasicInfoFormStep } from "./ui/basic-info-form-step";
import { BasicInfoSummaryStep } from "./ui/basic-info-summary-step";
import { CreateOnlineTestWizardHeader } from "./ui/create-online-test-wizard-header";
import { QuestionsStep } from "./ui/questions-step";

export function CreateOnlineTestWizard({
  initialQuestions,
  onCancel,
  onSubmit,
  submitLabel,
  initialValues,
  mode = "create",
}: CreateOnlineTestWizardProps) {
  const [isSubmitting, startTransition] = useTransition();

  const {
    basicInfoView,
    closeQuestionModal,
    currentQuestionNumber,
    editingQuestion,
    form,
    getDefaultQuestionType,
    handleBasicInfoSubmit,
    handleContinueToQuestions,
    handleEditBasicInfo,
    isQuestionModalOpen,
    openAddQuestionModal,
    openEditQuestionModal,
    questionModalInstance,
    questions,
    removeQuestion,
    savedValues,
    saveQuestion,
    setQuestionModalType,
    step,
  } = useCreateOnlineTestWizard({
    initialQuestions,
    initialValues,
    mode,
  });

  function handleSaveOnlineTest() {
    if (!savedValues) {
      return;
    }

    startTransition(async () => {
      const result = await onSubmit({
        basicInfo: savedValues,
        questions,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onCancel();
    });
  }

  let stepContent: ReactNode;

  if (step === 1 && basicInfoView === "form") {
    stepContent = (
      <BasicInfoFormStep
        form={form}
        onCancel={onCancel}
        onSubmit={handleBasicInfoSubmit}
      />
    );
  } else if (step === 1 && savedValues) {
    stepContent = (
      <BasicInfoSummaryStep
        values={savedValues}
        onCancel={onCancel}
        onContinue={handleContinueToQuestions}
        onEdit={handleEditBasicInfo}
      />
    );
  } else {
    stepContent = (
      <QuestionsStep
        isSubmitting={isSubmitting}
        questions={questions}
        submitLabel={submitLabel}
        onReturnToBasicInfo={handleEditBasicInfo}
        onSaveOnlineTest={handleSaveOnlineTest}
        onOpenAddQuestion={openAddQuestionModal}
        onRemoveQuestion={removeQuestion}
        onEditQuestion={(index, question) =>
          openEditQuestionModal(index, question.questionType)
        }
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8">
      <CreateOnlineTestWizardHeader currentStep={step} onCancel={onCancel} />
      {stepContent}
      <QuestionEditorModal
        key={`question-modal-${questionModalInstance}-${editingQuestion?.questionType ?? "new"}`}
        defaultQuestionType={getDefaultQuestionType()}
        initialQuestion={editingQuestion}
        open={step === 2 && isQuestionModalOpen}
        questionNumber={currentQuestionNumber}
        onClose={closeQuestionModal}
        onQuestionTypeChange={setQuestionModalType}
        onSave={saveQuestion}
      />
    </div>
  );
}
