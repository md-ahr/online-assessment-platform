import Link from "next/link";

import { TaskDone } from "@/components/svg";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CandidateTestCompleteProps = Readonly<{
  displayName: string;
  examFormatLabel: string;
  testTitle: string;
}>;

export function CandidateTestComplete({
  displayName,
  examFormatLabel,
  testTitle,
}: CandidateTestCompleteProps) {
  const message = `Congratulations! ${displayName}, You have completed your ${examFormatLabel} Exam for ${testTitle}. Thank you for participating.`;

  return (
    <section className="container-wrapper flex min-h-[calc(100vh-161px)] items-center justify-center py-10 pb-14 dark:bg-background">
      <div
        className={cn(
          "mx-auto box-border flex w-full max-w-[1280px] flex-col items-center justify-center gap-2 rounded-[20px] border border-[#E5E7EB] bg-white px-6 py-12 shadow-sm sm:px-12 sm:py-14 md:px-24 lg:px-[158px] lg:py-14",
          "dark:border-border dark:bg-card"
        )}
      >
        <div className="flex w-full max-w-[970px] flex-col items-center gap-8">
          <div className="flex w-full flex-col items-center gap-3 text-center">
            <TaskDone />
            <h1 className="text-center text-xl leading-6 font-semibold text-[#334155] dark:text-foreground">
              Test Completed
            </h1>
            <p className="max-w-[970px] text-center text-base leading-normal font-normal text-[#64748B] dark:text-muted-foreground">
              {message}
            </p>
          </div>
          <Link
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 min-w-[180px] rounded-xl border-[#E5E7EB] px-8 text-base font-semibold text-[#334155] hover:bg-[#F9FAFB] dark:border-border dark:text-foreground dark:hover:bg-muted/50"
            )}
            href="/candidate"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
