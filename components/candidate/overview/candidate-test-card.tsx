import { Clock, FileText } from "lucide-react";
import Link from "next/link";

import { CancelCircle } from "@/components/svg";
import { buttonVariants } from "@/components/ui/button";
import type { OnlineTestCandidateListItem } from "@/lib/db/types";
import { cn } from "@/lib/utils";

function formatDuration(minutes: number | null): string {
  if (minutes === null || !Number.isFinite(minutes) || minutes <= 0) {
    return "—";
  }

  return `${Math.round(minutes)} min`;
}

function formatNegativeMarking(value: number): string {
  if (value === 0) {
    return "None";
  }

  return `${value}/wrong`;
}

type CandidateTestCardProps = Readonly<{
  test: OnlineTestCandidateListItem;
}>;

export function CandidateTestCard({ test }: CandidateTestCardProps) {
  return (
    <article
      className={cn(
        "flex w-full flex-col justify-center gap-6 rounded-2xl border border-[#E5E7EB] bg-white p-6 pb-8 shadow-sm sm:p-8 sm:pb-10",
        "dark:border-border dark:bg-card"
      )}
    >
      <div className="flex w-full min-w-0 flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="line-clamp-3 text-lg leading-[140%] font-semibold text-[#334155] sm:text-xl dark:text-foreground">
            {test.title}
          </h2>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 sm:gap-x-8">
            <div className="flex min-w-0 items-center gap-2">
              <Clock
                aria-hidden
                className="size-6 shrink-0 text-[#9CA3AF]"
                strokeWidth={1.5}
              />
              <span className="text-sm leading-[150%] font-normal whitespace-nowrap text-[#64748B]">
                Duration:
              </span>
              <span className="text-sm leading-[150%] font-medium whitespace-nowrap text-[#334155] dark:text-foreground">
                {formatDuration(test.durationMinutes)}
              </span>
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <FileText
                aria-hidden
                className="size-6 shrink-0 text-[#9CA3AF]"
                strokeWidth={1.5}
              />
              <span className="text-sm leading-[150%] font-normal whitespace-nowrap text-[#64748B]">
                Question:
              </span>
              <span className="text-sm leading-[150%] font-medium whitespace-nowrap text-[#334155] dark:text-foreground">
                {test.questionCount.toLocaleString("en-US")}
              </span>
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <CancelCircle
                aria-hidden
                className="size-6 shrink-0 text-[#9CA3AF]"
              />
              <span className="text-sm leading-[150%] font-normal whitespace-nowrap text-[#64748B]">
                Negative Marking:
              </span>
              <span className="text-sm leading-[150%] font-medium whitespace-nowrap text-[#334155] dark:text-foreground">
                {formatNegativeMarking(test.negativeMarkPerWrong)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-10 min-w-[120px] rounded-xl border-[#6633FF] px-6 py-2.5 text-sm leading-[140%] font-semibold text-[#6633FF] hover:bg-[#6633FF]/8 dark:text-white dark:hover:bg-[#6633FF]/15"
            )}
            href={`/candidate/tests/${test.id}`}
          >
            Start
          </Link>
        </div>
      </div>
    </article>
  );
}
