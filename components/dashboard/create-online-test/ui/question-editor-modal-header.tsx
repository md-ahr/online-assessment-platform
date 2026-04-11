import { Trash } from "@/components/svg";
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

import type { QuestionType } from "../question-editor.types";

type QuestionEditorModalHeaderProps = Readonly<{
  onClose: () => void;
  onQuestionTypeChange: (questionType: QuestionType) => void;
  onScoreChange: (value: string) => void;
  questionNumber: number;
  questionType: QuestionType;
  score: string;
}>;

export function QuestionEditorModalHeader({
  onClose,
  onQuestionTypeChange,
  onScoreChange,
  questionNumber,
  questionType,
  score,
}: QuestionEditorModalHeaderProps) {
  return (
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
            onChange={(event) => onScoreChange(event.target.value)}
          />
        </div>

        <Select
          value={questionType}
          onValueChange={(value) => onQuestionTypeChange(value as QuestionType)}
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
  );
}
