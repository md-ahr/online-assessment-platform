import type { Metadata } from "next";

import { OnlineTestsDashboard } from "@/components/dashboard/overview";
import { requireEmployerSession } from "@/lib/auth/guards";
import { listOnlineTests } from "@/lib/db";

import { type DashboardSearchParams, parsePositiveInt } from "./search-params";

export const metadata: Metadata = {
  title: "Online Tests",
  description: "Manage online tests and candidates",
};

type DashboardPageProps = Readonly<{
  searchParams: Promise<DashboardSearchParams>;
}>;

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const session = await requireEmployerSession();
  const params = await searchParams;
  const page = parsePositiveInt(params.page, 1);
  const pageSize = parsePositiveInt(params.pageSize, 8);
  const query = params.q?.trim() ?? "";

  const data = await listOnlineTests({
    userId: session.userId,
    page,
    pageSize,
    query,
  });

  return (
    <section className="container-wrapper min-h-[calc(100vh-161px)] py-8 pb-12 dark:bg-background">
      <OnlineTestsDashboard
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
