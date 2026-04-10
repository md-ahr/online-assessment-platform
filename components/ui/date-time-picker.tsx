"use client";

import { format } from "date-fns";
import { Clock3 } from "lucide-react";
import { useMemo } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DateTimePickerProps = Readonly<{
  value?: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}>;

function parseDateTimeValue(value: string | undefined): Date | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function toDateTimeLocalValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function mergeDateWithExistingTime(
  selectedDate: Date,
  currentValue: string | undefined
): string {
  const currentDate = parseDateTimeValue(currentValue);
  const hours = currentDate ? currentDate.getHours() : 9;
  const minutes = currentDate ? currentDate.getMinutes() : 0;

  const merged = new Date(selectedDate);
  merged.setHours(hours, minutes, 0, 0);

  return toDateTimeLocalValue(merged);
}

export function DateTimePicker({
  value,
  onChange,
  placeholder,
  className,
  id,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
}: DateTimePickerProps) {
  const selectedDate = useMemo(() => parseDateTimeValue(value), [value]);
  const displayValue = selectedDate
    ? format(selectedDate, "dd MMM yyyy, hh:mm a")
    : placeholder;

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "flex h-12 min-h-[48px] w-full items-center justify-between rounded-lg border border-border bg-background px-3 text-left text-sm transition-colors",
          "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
          "aria-invalid:border-destructive",
          className
        )}
        id={id}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
      >
        <span
          className={cn(selectedDate ? "text-foreground" : "text-[#94A3B8]")}
        >
          {displayValue}
        </span>
        <Clock3 aria-hidden className="size-4 shrink-0 text-[#9CA3AF]" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--anchor-width) p-3">
        <div className="flex flex-col gap-3">
          <Calendar
            className="w-full"
            mode="single"
            selected={selectedDate ?? undefined}
            onSelect={(selected) => {
              if (!selected) {
                return;
              }

              onChange(mergeDateWithExistingTime(selected, value));
            }}
          />
          <div className="relative">
            <Input
              type="time"
              value={selectedDate ? format(selectedDate, "HH:mm") : ""}
              onChange={(event) => {
                if (!event.target.value) {
                  onChange("");
                  return;
                }
                const [hours = "09", minutes = "00"] =
                  event.target.value.split(":");
                const base = selectedDate ? new Date(selectedDate) : new Date();

                base.setHours(Number(hours), Number(minutes), 0, 0);
                onChange(toDateTimeLocalValue(base));
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
