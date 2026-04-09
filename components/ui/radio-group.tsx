"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: Readonly<ComponentProps<typeof RadioGroupPrimitive>>) {
  return (
    <RadioGroupPrimitive className={cn("grid gap-3", className)} {...props} />
  );
}

function RadioGroupItem({
  className,
  ...props
}: Readonly<ComponentProps<typeof RadioPrimitive.Root>>) {
  return (
    <RadioPrimitive.Root
      className={cn(
        "aspect-square size-4 shrink-0 rounded-full border border-border bg-background text-primary shadow-none",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-checked:border-primary",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator className="flex items-center justify-center">
        <span className="size-2 rounded-full bg-primary" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupItem };
