"use client";

import { ChevronLeft, ChevronRight, Clock, FileText } from "lucide-react";
import { type ComponentType, type SVGProps, useMemo, useState } from "react";

import { EmptyState } from "@/components/svg";
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
import { ONLINE_TESTS, type OnlineTest } from "@/lib/data/online-tests";
import { cn } from "@/lib/utils";

import { Candidates, Search } from "../svg";

const PAGE_SIZE_OPTIONS = [4, 8, 16] as const;

function formatStat(value: number | null): string {
  if (value === null) return "Not Set";
  return value.toLocaleString("en-US");
}

function OnlineTestsEmptyState({
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

function OnlineTestCard({ test }: Readonly<{ test: OnlineTest }>) {
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
            className="h-10 min-w-[163px] rounded-xl border border-[#6633FF] bg-transparent px-6 py-2.5 text-sm leading-[140%] font-semibold text-[#6633FF] hover:bg-[#6633FF]/8 dark:hover:bg-[#6633FF]/15"
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

function StatBlock({
  icon: Icon,
  label,
  value,
}: Readonly<{
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
}>) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Icon
        aria-hidden
        className="size-6 shrink-0 text-[#9CA3AF]"
        strokeWidth={1.5}
      />
      <span className="text-sm leading-[150%] font-normal whitespace-nowrap text-[#64748B]">
        {label}
      </span>
      <span className="text-sm leading-[150%] font-medium whitespace-nowrap text-[#334155] dark:text-foreground">
        {value}
      </span>
    </div>
  );
}

export function OnlineTestsDashboard() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(8);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...ONLINE_TESTS];
    return ONLINE_TESTS.filter((t) => t.title.toLowerCase().includes(q));
  }, [query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  const showingFrom = total === 0 ? 0 : start + 1;
  const showingTo = Math.min(start + pageSize, total);

  return (
    <div className="flex min-h-[calc(100vh-241px)] w-full flex-col gap-4">
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
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
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
          >
            Create Online Test
          </Button>
        </div>
      </div>

      {total === 0 ? (
        <OnlineTestsEmptyState variant={query.trim() ? "search" : "catalog"} />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-4">
          {pageItems.map((test) => (
            <OnlineTestCard key={test.id} test={test} />
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
                disabled={safePage <= 1}
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                disabled={safePage >= totalPages}
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
                  setPageSize(Number(v));
                  setPage(1);
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
                        {PAGE_SIZE_OPTIONS.map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            <SelectItemText>{n}</SelectItemText>
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
