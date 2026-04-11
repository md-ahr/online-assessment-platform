import { Edit } from "@/components/svg";
import { Button } from "@/components/ui/button";

import type { OnlineTestFormValues } from "../create-online-test-wizard.types";

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

type BasicInfoSummaryStepProps = Readonly<{
  onCancel: () => void;
  onContinue: () => void;
  onEdit: () => void;
  values: OnlineTestFormValues;
}>;

export function BasicInfoSummaryStep({
  onCancel,
  onContinue,
  onEdit,
  values,
}: BasicInfoSummaryStepProps) {
  return (
    <div className="flex w-full max-w-[954px] flex-col gap-6">
      <div className="w-full rounded-2xl bg-card p-6">
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
            onClick={onContinue}
          >
            Save &amp; Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
