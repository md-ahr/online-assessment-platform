import type { Metadata } from "next";

import { OnlineTestsDashboard } from "@/components/dashboard/overview";

export const metadata: Metadata = {
  title: "Online Tests",
  description: "Manage online tests and candidates",
};

export default function DashboardPage() {
  return (
    <section className="container-wrapper py-8 pb-12 dark:bg-background">
      <OnlineTestsDashboard />
    </section>
  );
}
