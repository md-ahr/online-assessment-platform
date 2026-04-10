import { EmptyState } from "@/components/svg";
import { cn } from "@/lib/utils";

export function DashboardEmptyState({
  variant,
}: Readonly<{
  variant: "catalog" | "search";
}>) {
  const copy =
    variant === "search"
      ? {
          title: "No tests found",
          description:
            "No online tests match your search. Try a different exam title or clear the search.",
        }
      : {
          title: "No Online Test Available",
          description:
            "Currently, there are no online tests available. Please check back later for updates.",
        };

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-5 rounded-lg bg-white p-5",
        "dark:bg-card"
      )}
    >
      <EmptyState aria-hidden className="size-[120px] shrink-0" />
      <div className="flex max-w-[1240px] flex-col items-center gap-3 text-center">
        <p className="text-xl leading-[140%] font-semibold text-[#334155] dark:text-foreground">
          {copy.title}
        </p>
        <p className="max-w-[539px] text-sm leading-[140%] font-normal text-[#64748B]">
          {copy.description}
        </p>
      </div>
    </div>
  );
}
