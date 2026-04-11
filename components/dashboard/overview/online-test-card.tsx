import { Clock, FileText } from "lucide-react";

import { Candidates } from "@/components/svg";
import { Button } from "@/components/ui/button";
import type { OnlineTest } from "@/lib/data/online-tests";
import { cn } from "@/lib/utils";

import { StatBlock } from "./stat-block";

function formatStat(value: number | null): string {
  if (value === null) return "Not Set";
  return value.toLocaleString("en-US");
}

export function OnlineTestCard({ test }: Readonly<{ test: OnlineTest }>) {
  return (
    <article
      className={cn(
        "flex w-full flex-col justify-center gap-6 rounded-2xl border border-[#E5E7EB] bg-white p-8 pb-10 shadow-sm",
        "dark:border-border dark:bg-card"
      )}
    >
      <div className="flex w-full min-w-0 flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="line-clamp-2 text-xl leading-[140%] font-semibold text-[#334155] dark:text-foreground">
            {test.title}
          </h2>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 sm:gap-x-8">
            <StatBlock
              icon={Candidates}
              label="Candidates:"
              value={formatStat(test.candidates)}
            />
            <StatBlock
              icon={FileText}
              label="Question Set:"
              value={formatStat(test.questionSet)}
            />
            <StatBlock
              icon={Clock}
              label="Exam Slots:"
              value={formatStat(test.examSlots)}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            className="h-10 min-w-[163px] rounded-xl border border-[#6633FF] bg-transparent px-6 py-2.5 text-sm leading-[140%] font-semibold text-[#6633FF] hover:bg-[#6633FF]/8 dark:text-white dark:hover:bg-[#6633FF]/15"
            type="button"
            variant="outline"
          >
            View Candidates
          </Button>
        </div>
      </div>
    </article>
  );
}
