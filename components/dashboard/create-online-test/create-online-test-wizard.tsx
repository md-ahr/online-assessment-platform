"use client";

import type { ReactNode } from "react";

import type { CreateOnlineTestWizardProps } from "./create-online-test-wizard.types";
import { useCreateOnlineTestWizard } from "./hooks/use-create-online-test-wizard";
import { QuestionEditorModal } from "./question-editor-modal";
import { BasicInfoFormStep } from "./ui/basic-info-form-step";
import { BasicInfoSummaryStep } from "./ui/basic-info-summary-step";
import { CreateOnlineTestWizardHeader } from "./ui/create-online-test-wizard-header";
import { QuestionsStep } from "./ui/questions-step";

export function CreateOnlineTestWizard({
  onCancel,
  initialValues,
}: CreateOnlineTestWizardProps) {
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
    initialValues,
  });

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
        questions={questions}
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
