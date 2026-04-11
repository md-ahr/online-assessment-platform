"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectItemText,
  SelectList,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OnlineTestDashboardItem } from "@/lib/db/types";
import { cn } from "@/lib/utils";

import { Search } from "../../svg";
import { DashboardEmptyState } from "./empty-state";
import { OnlineTestCard } from "./online-test-card";

const PAGE_SIZE_OPTIONS = [4, 8, 16] as const;

type OnlineTestsDashboardProps = Readonly<{
  items: readonly OnlineTestDashboardItem[];
  page: number;
  pageSize: number;
  query: string;
  total: number;
  totalPages: number;
}>;

export function OnlineTestsDashboard({
  items,
  page,
  pageSize,
  query,
  total,
  totalPages,
}: OnlineTestsDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [queryInput, setQueryInput] = useState(query);

  useEffect(() => {
    setQueryInput(query);
  }, [query]);

  const safePage = Math.min(Math.max(1, page), Math.max(1, totalPages));
  const start = (safePage - 1) * pageSize;

  const showingFrom = total === 0 ? 0 : start + 1;
  const showingTo = Math.min(start + pageSize, total);

  const canGoNext = safePage < totalPages;
  const canGoPrevious = safePage > 1;

  const pageSizeOptions = useMemo(
    () => PAGE_SIZE_OPTIONS.map((option) => String(option)),
    []
  );

  function navigateWithParams(
    values: Readonly<{
      page?: number;
      pageSize?: number;
      query?: string;
    }>
  ) {
    const nextParams = new URLSearchParams(searchParams.toString());

    const nextPage = values.page ?? page;
    const nextPageSize = values.pageSize ?? pageSize;
    const nextQuery = values.query ?? queryInput;

    nextParams.set("page", String(nextPage));
    nextParams.set("pageSize", String(nextPageSize));

    if (nextQuery.trim()) {
      nextParams.set("q", nextQuery.trim());
    } else {
      nextParams.delete("q");
    }

    startTransition(() => {
      router.replace(`/dashboard?${nextParams.toString()}`);
    });
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
        <h1 className="shrink-0 text-2xl leading-[130%] font-semibold text-[#334155] dark:text-foreground">
          Online Tests
        </h1>

        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-15 xl:gap-25">
          <div className="relative min-w-0 flex-1 sm:max-w-[621px]">
            <Input
              aria-label="Search by exam title"
              className={cn(
                "h-12 rounded-lg border border-[#A086F7] pr-14 shadow-[2px_2px_6px_rgba(73,123,241,0.24)]",
                "placeholder:text-xs placeholder:leading-[15px] placeholder:font-normal placeholder:text-[#7C8493]/50",
                "focus-visible:ring-[#6633FF]/30 dark:bg-background!"
              )}
              placeholder="Search by exam title"
              value={queryInput}
              onChange={(e) => {
                const nextValue = e.target.value;
                setQueryInput(nextValue);
                navigateWithParams({ page: 1, query: nextValue });
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3 z-10 -translate-y-1/2"
            >
              <Search />
            </div>
          </div>

          <Button
            className="h-12 shrink-0 rounded-xl bg-[#6633FF] px-8 text-base leading-[150%] font-semibold text-white hover:bg-[#6633FF]/90 sm:min-w-[192px] dark:text-white"
            type="button"
            onClick={() => router.push("/dashboard/create-online-test")}
          >
            Create Online Test
          </Button>
        </div>
      </div>

      {total === 0 ? (
        <DashboardEmptyState variant={query.trim() ? "search" : "catalog"} />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-4">
          {items.map((test) => (
            <OnlineTestCard
              key={test.id}
              test={test}
              onEdit={(testId) =>
                router.push(`/dashboard/create-online-test/${testId}`)
              }
            />
          ))}
        </div>
      )}

      {total > 0 && (
        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-6">
              <button
                aria-label="Previous page"
                className="flex size-8 items-center justify-center rounded-lg border border-[#F1F2F4] bg-white transition-colors hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-40 dark:border-border dark:bg-card"
                disabled={isPending || !canGoPrevious}
                type="button"
                onClick={() =>
                  navigateWithParams({ page: Math.max(1, safePage - 1) })
                }
              >
                <ChevronLeft aria-hidden className="size-4 text-[#A0AEC0]" />
              </button>
              <div className="flex size-8 items-center justify-center rounded-[10px] bg-[#F8F8F8] dark:bg-muted">
                <span className="text-xs leading-[160%] font-semibold text-[#2E2E2F] dark:text-foreground">
                  {safePage}
                </span>
              </div>
              <button
                aria-label="Next page"
                className="flex size-8 items-center justify-center rounded-lg border border-[#F1F2F4] bg-white transition-colors hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-40 dark:border-border dark:bg-card"
                disabled={isPending || !canGoNext}
                type="button"
                onClick={() =>
                  navigateWithParams({
                    page: Math.min(totalPages, safePage + 1),
                  })
                }
              >
                <ChevronRight
                  aria-hidden
                  className="size-4 text-[#111827] dark:text-foreground"
                />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-4">
            <p className="text-xs leading-[160%] font-medium text-[#666666] dark:text-muted-foreground">
              Showing {showingFrom} to {showingTo} of {total} entries
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs leading-[160%] font-medium text-[#666666] dark:text-muted-foreground">
                Online Test Per Page
              </span>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => {
                  navigateWithParams({
                    page: 1,
                    pageSize: Number(v),
                  });
                }}
              >
                <SelectTrigger
                  className="h-8 min-h-0 w-[54px] rounded-lg border border-[#F1F2F4] bg-white px-2.5 py-2 text-xs font-medium text-[#2E2E2F] dark:border-border dark:bg-card dark:text-foreground"
                  aria-label="Tests per page"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectPortal>
                  <SelectPositioner>
                    <SelectPopup>
                      <SelectList>
                        {pageSizeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            <SelectItemText>{option}</SelectItemText>
                          </SelectItem>
                        ))}
                      </SelectList>
                    </SelectPopup>
                  </SelectPositioner>
                </SelectPortal>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
