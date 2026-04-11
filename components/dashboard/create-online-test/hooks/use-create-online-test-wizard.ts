import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { basicInfoSchema } from "../create-online-test-wizard.schema";
import type {
  OnlineTestFormValues,
  QuestionModalType,
  WizardStep,
} from "../create-online-test-wizard.types";
import type { QuestionDraft } from "../question-editor.types";

type UseCreateOnlineTestWizardParams = Readonly<{
  initialValues?: Partial<OnlineTestFormValues>;
}>;

export function useCreateOnlineTestWizard({
  initialValues,
}: UseCreateOnlineTestWizardParams) {
  const [step, setStep] = useState<WizardStep>(1);
  const [basicInfoView, setBasicInfoView] = useState<"form" | "summary">(
    "form"
  );
  const [savedValues, setSavedValues] = useState<OnlineTestFormValues | null>(
    null
  );
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);
  const [questionModalInstance, setQuestionModalInstance] = useState(0);
  const [questionModalType, setQuestionModalType] =
    useState<QuestionModalType>("Checkbox");

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

  const editingQuestion =
    editingQuestionIndex === null
      ? null
      : (questions[editingQuestionIndex] ?? null);
  const currentQuestionNumber =
    editingQuestionIndex === null
      ? questions.length + 1
      : editingQuestionIndex + 1;

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

  function getDefaultQuestionType(): QuestionModalType {
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

  function openAddQuestionModal() {
    setEditingQuestionIndex(null);
    setQuestionModalInstance((value) => value + 1);
    setIsQuestionModalOpen(true);
  }

  function openEditQuestionModal(
    index: number,
    questionType: QuestionModalType
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

  function closeQuestionModal() {
    setIsQuestionModalOpen(false);
    setEditingQuestionIndex(null);
  }

  function saveQuestion(question: QuestionDraft, saveAndAddMore: boolean) {
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
  }

  return {
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
  };
}
