import type { Metadata } from "next";

import { OnlineTestsDashboard } from "@/components/dashboard/overview";

export const metadata: Metadata = {
  title: "Online Tests",
  description: "Manage online tests and candidates",
};

export default function DashboardPage() {
  return (
    <section className="container-wrapper min-h-[calc(100vh-161px)] py-8 pb-12 dark:bg-background">
      <OnlineTestsDashboard />
    </section>
  );
}
