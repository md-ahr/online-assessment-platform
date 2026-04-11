import { Plus } from "lucide-react";

import { Trash } from "@/components/svg";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

import type { QuestionOption, QuestionType } from "../question-editor.types";

type QuestionEditorOptionsProps = Readonly<{
  canAddOptions: boolean;
  editorVersion: number;
  optionErrors: Readonly<Record<string, string>>;
  onAddOption: () => void;
  onRemoveOption: (optionId: string) => void;
  onSetSingleCorrectOption: (optionId: string) => void;
  onToggleCorrectOption: (optionId: string, checked: boolean) => void;
  onUpdateOptionContent: (optionId: string, content: string) => void;
  options: readonly QuestionOption[];
  questionType: QuestionType;
  selectedRadioOption: string | null;
}>;

export function QuestionEditorOptions({
  canAddOptions,
  editorVersion,
  optionErrors,
  onAddOption,
  onRemoveOption,
  onSetSingleCorrectOption,
  onToggleCorrectOption,
  onUpdateOptionContent,
  options,
  questionType,
  selectedRadioOption,
}: QuestionEditorOptionsProps) {
  return (
    <>
      {options.map((option) => (
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
                      onToggleCorrectOption(option.id, Boolean(checked))
                    }
                  />
                  Set as correct answer
                </div>
              ) : null}

              {questionType === "Radio" ? (
                <div className="inline-flex items-center gap-2 text-sm leading-[140%] font-normal text-secondary">
                  <RadioGroup
                    className="grid gap-0"
                    value={selectedRadioOption ?? undefined}
                    onValueChange={(value) =>
                      onSetSingleCorrectOption(String(value))
                    }
                  >
                    <RadioGroupItem
                      aria-label={`Set option ${option.label} as correct answer`}
                      value={option.id}
                      className="pt-0.75"
                    />
                  </RadioGroup>
                  Set as correct answer
                </div>
              ) : null}
            </div>

            <button
              className="inline-flex size-8 items-center justify-center rounded-md text-secondary hover:bg-muted disabled:opacity-40"
              disabled={options.length <= 2 || questionType === "Text"}
              type="button"
              onClick={() => onRemoveOption(option.id)}
            >
              <Trash aria-hidden className="size-5" />
            </button>
          </div>

          <RichTextEditor
            className="h-[140px]"
            key={`option-${option.id}-${editorVersion}`}
            content={option.content}
            onChange={(value) => onUpdateOptionContent(option.id, value)}
          />
          {optionErrors[option.id] ? (
            <p className="text-sm text-[#EA5055]">{optionErrors[option.id]}</p>
          ) : null}
        </div>
      ))}

      {canAddOptions ? (
        <button
          className="inline-flex items-center gap-2 pl-5 text-sm leading-[150%] font-medium text-secondary hover:text-primary"
          type="button"
          onClick={onAddOption}
        >
          <Plus aria-hidden className="size-4 text-primary" />
          Another options
        </button>
      ) : null}
    </>
  );
}
