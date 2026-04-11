"use client";

import type { ComponentProps } from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

export type CalendarProps = ComponentProps<typeof DayPicker>;

function Calendar({ className, ...props }: Readonly<CalendarProps>) {
  return (
    <DayPicker
      className={cn("w-full rounded-xl bg-card p-3", className)}
      classNames={{
        root: "rdp-root w-full",
        months: "flex w-full flex-col",
        month: "w-full space-y-3",
        caption: "relative flex h-9 items-center justify-center",
        caption_label:
          "text-lg font-semibold text-foreground text-center block",
        nav: "absolute inset-x-0 top- left-2 right-2 flex items-center justify-between",
        button_previous:
          "inline-flex size-6 items-center justify-center rounded-md border border-transparent text-foreground transition-colors hover:bg-accent/50",
        button_next:
          "inline-flex size-6 items-center justify-center rounded-md border border-transparent text-foreground transition-colors hover:bg-accent/50",
        month_grid: "w-full border-collapse",
        weekdays: "grid grid-cols-7",
        weekday:
          "h-8 text-center text-sm font-semibold tracking-tight text-foreground/90",
        week: "mt-1 grid grid-cols-7",
        day: "flex items-center justify-center p-0",
        day_button:
          "flex size-9 items-center justify-center rounded-lg text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        selected:
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary",
        today: "[&>button]:ring-1 [&>button]:ring-primary/35",
        outside: "text-muted-foreground opacity-45",
        disabled: "text-muted-foreground opacity-45",
        hidden: "invisible",
      }}
      {...props}
    />
  );
}

export { Calendar };
