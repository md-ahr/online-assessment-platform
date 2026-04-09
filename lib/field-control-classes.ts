import { cn } from "@/lib/utils";

export const fieldControlClasses = cn(
  "flex h-12 min-h-[48px] w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground shadow-none",
  "placeholder:text-[#94A3B8]",
  "transition-colors",
  "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-[invalid=true]:border-destructive"
);
