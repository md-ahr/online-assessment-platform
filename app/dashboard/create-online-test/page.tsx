import type { Metadata } from "next";

import { CreateOnlineTest } from "@/components/dashboard/create-online-test";

export const metadata: Metadata = {
  title: "Create Online Test",
  description: "Create and configure a new online test",
};

export default function CreateOnlineTestPage() {
  return (
    <section className="container-wrapper min-h-[calc(100vh-161px)] py-8 pb-12 dark:bg-background">
      <CreateOnlineTest />
    </section>
  );
}
