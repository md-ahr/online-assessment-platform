import type { Metadata } from "next";

import { CandidateTestsOverview } from "@/components/candidate/overview";
import { requireCandidateSession } from "@/lib/auth/guards";
import { listOnlineTestsForCandidates } from "@/lib/db";

import { type CandidateSearchParams, parsePositiveInt } from "./search-params";

export const metadata: Metadata = {
  title: "Online Tests",
  description: "Browse and start available online assessments",
};

type CandidatePageProps = Readonly<{
  searchParams: Promise<CandidateSearchParams>;
}>;

export default async function CandidatePage({
  searchParams,
}: CandidatePageProps) {
  await requireCandidateSession();
  const params = await searchParams;
  const page = parsePositiveInt(params.page, 1);
  const pageSize = parsePositiveInt(params.pageSize, 8);
  const query = params.q?.trim() ?? "";

  const data = await listOnlineTestsForCandidates({
    page,
    pageSize,
    query,
  });

  return (
    <section className="container-wrapper min-h-[calc(100vh-161px)] py-8 pb-12 dark:bg-background">
      <CandidateTestsOverview
        items={data.items}
        page={data.page}
        pageSize={data.pageSize}
        query={query}
        total={data.total}
        totalPages={data.totalPages}
      />
    </section>
  );
}
