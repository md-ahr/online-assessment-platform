"use client";

import type { ComponentProps } from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

export type CalendarProps = ComponentProps<typeof DayPicker>;

function Calendar({ className, ...props }: Readonly<CalendarProps>) {
  return (
    <DayPicker
      className={cn(
        "w-full rounded-xl border bg-card p-4 [--cell-size:2.5rem]",
        className
      )}
      classNames={{
        root: "rdp-root relative w-full",
        months: "flex flex-col items-center gap-2",
        month: "relative w-full pt-10",
        caption:
          "absolute inset-x-0 top-0 flex h-10 items-center justify-center",
        caption_label:
          "text-[1.75rem] leading-none font-semibold text-foreground",
        nav: "absolute inset-x-0 top-0 flex h-10 items-center justify-between px-1.5",
        nav_button:
          "h-8 w-8 rounded-md bg-transparent p-0 text-foreground hover:bg-accent/40",
        table: "mx-auto mt-2 border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "w-(--cell-size) rounded-md text-center text-base font-normal text-muted-foreground",
        row: "mt-2 flex w-full justify-center",
        cell: "h-(--cell-size) w-(--cell-size) p-0 text-center",
        day: "h-(--cell-size) w-(--cell-size) rounded-md p-0 text-xl font-medium text-foreground hover:bg-accent hover:text-accent-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        day_today: "ring-1 ring-border",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
      }}
      {...props}
    />
  );
}

export { Calendar };
