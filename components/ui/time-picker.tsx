"use client";

import { Clock3 } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type TimePickerProps = Readonly<{
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}>;

function toTimeValue(value: string | undefined): string {
  if (!value) {
    return "";
  }

  const plainTimeMatch = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value.trim());
  if (plainTimeMatch) {
    return plainTimeMatch[0];
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

function toTwelveHourLabel(value: string): string {
  const [hoursRaw, minutesRaw] = value.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
    return value;
  }

  const period = hours >= 12 ? "PM" : "AM";
  const twelveHour = hours % 12 === 0 ? 12 : hours % 12;
  const paddedMinutes = String(minutes).padStart(2, "0");

  return `${String(twelveHour).padStart(2, "0")}:${paddedMinutes} ${period}`;
}

export function TimePicker({
  value,
  onChange,
  placeholder,
  className,
  id,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const timeInputRef = useRef<HTMLInputElement>(null);
  const normalizedTimeValue = useMemo(() => toTimeValue(value), [value]);
  const displayValue = normalizedTimeValue
    ? toTwelveHourLabel(normalizedTimeValue)
    : placeholder || "Select time";

  useEffect(() => {
    if (!open) {
      return;
    }

    globalThis.requestAnimationFrame(() => {
      timeInputRef.current?.focus();
      timeInputRef.current?.showPicker?.();
    });
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "flex h-12 min-h-[48px] w-full items-center justify-between rounded-lg border border-border bg-background px-3 text-left text-sm transition-colors",
          "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
          "aria-invalid:border-destructive",
          className
        )}
        id={inputId}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
      >
        <span
          className={cn(
            normalizedTimeValue ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {displayValue}
        </span>
        <Clock3 aria-hidden className="size-4 shrink-0 text-[#9CA3AF]" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--anchor-width) min-w-[240px] gap-3 p-3"
      >
        <div className="space-y-3">
          <Input
            ref={timeInputRef}
            type="time"
            value={normalizedTimeValue}
            onChange={(event) => {
              const nextValue = event.target.value;
              onChange(nextValue);
              if (nextValue) {
                setOpen(false);
              }
            }}
          />
          <div className="flex items-center justify-end">
            <Button
              type="button"
              variant="ghost"
              className="h-8 px-2 text-xs text-muted-foreground"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
