import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { requireCandidateSession } from "@/lib/auth/guards";
import { getOnlineTestTitleById } from "@/lib/db";
import { cn } from "@/lib/utils";

type CandidateTestPageProps = Readonly<{
  params: Promise<{ testId: string }>;
}>;

export async function generateMetadata({
  params,
}: CandidateTestPageProps): Promise<Metadata> {
  const { testId } = await params;
  const title = await getOnlineTestTitleById(testId);

  return {
    title: title ? title : "Assessment",
  };
}

export default async function CandidateTestIntroPage({
  params,
}: CandidateTestPageProps) {
  await requireCandidateSession();
  const { testId } = await params;
  const title = await getOnlineTestTitleById(testId);

  if (!title) {
    notFound();
  }

  return (
    <section className="container-wrapper min-h-[calc(100vh-161px)] py-8 pb-12 dark:bg-background">
      <div className="mx-auto flex max-w-xl flex-col gap-6 rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm dark:border-border dark:bg-card">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium tracking-wide text-[#64748B] uppercase dark:text-muted-foreground">
            Online test
          </p>
          <h1 className="text-xl leading-[140%] font-semibold text-[#334155] dark:text-foreground">
            {title}
          </h1>
          <p className="text-sm leading-[150%] text-[#64748B] dark:text-muted-foreground">
            The timed assessment flow will open from this page in a future
            update. For now you can return to the catalog and pick another test.
          </p>
        </div>
        <Link
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-10 w-fit rounded-xl border-[#6633FF] px-6 font-semibold text-[#6633FF] hover:bg-[#6633FF]/8 dark:text-white dark:hover:bg-[#6633FF]/15"
          )}
          href="/candidate"
        >
          Back to Online Tests
        </Link>
      </div>
    </section>
  );
}
