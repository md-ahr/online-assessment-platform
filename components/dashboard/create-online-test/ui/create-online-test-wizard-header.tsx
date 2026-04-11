import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { WizardStep } from "../create-online-test-wizard.types";

type StepBadgeProps = Readonly<{
  label: string;
  stepNumber: number;
  variant: "active" | "completed" | "upcoming";
}>;

function StepBadge({ label, stepNumber, variant }: StepBadgeProps) {
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

type CreateOnlineTestWizardHeaderProps = Readonly<{
  currentStep: WizardStep;
  onCancel: () => void;
}>;

export function CreateOnlineTestWizardHeader({
  currentStep,
  onCancel,
}: CreateOnlineTestWizardHeaderProps) {
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
