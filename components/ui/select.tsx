"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";

import { fieldControlClasses } from "@/lib/field-control-classes";
import { cn } from "@/lib/utils";

function SelectRoot({
  ...props
}: Readonly<ComponentProps<typeof SelectPrimitive.Root>>) {
  return <SelectPrimitive.Root {...props} />;
}

function SelectTrigger({
  className,
  children,
  ...props
}: Readonly<ComponentProps<typeof SelectPrimitive.Trigger>>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        fieldControlClasses,
        "cursor-pointer items-center justify-between gap-2 text-left data-placeholder:text-[#94A3B8]",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon className="pointer-events-none shrink-0 text-muted-foreground">
        <ChevronDown className="size-4" aria-hidden />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectValue({
  ...props
}: Readonly<ComponentProps<typeof SelectPrimitive.Value>>) {
  return <SelectPrimitive.Value {...props} />;
}

function SelectPortal({
  ...props
}: Readonly<ComponentProps<typeof SelectPrimitive.Portal>>) {
  return <SelectPrimitive.Portal {...props} />;
}

function SelectPositioner({
  className,
  ...props
}: Readonly<ComponentProps<typeof SelectPrimitive.Positioner>>) {
  return (
    <SelectPrimitive.Positioner
      className={cn("z-50 outline-none", className)}
      sideOffset={4}
      {...props}
    />
  );
}

function SelectPopup({
  className,
  ...props
}: Readonly<ComponentProps<typeof SelectPrimitive.Popup>>) {
  return (
    <SelectPrimitive.Popup
      className={cn(
        "origin(--transform-origin) max-h-[min(var(--available-height),20rem)] overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md",
        className
      )}
      {...props}
    />
  );
}

function SelectList({
  className,
  ...props
}: Readonly<ComponentProps<typeof SelectPrimitive.List>>) {
  return (
    <SelectPrimitive.List
      className={cn("outline-none", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  ...props
}: Readonly<ComponentProps<typeof SelectPrimitive.Item>>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-foreground outline-none select-none",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

function SelectItemText({
  ...props
}: Readonly<ComponentProps<typeof SelectPrimitive.ItemText>>) {
  return <SelectPrimitive.ItemText {...props} />;
}

function SelectGroup({
  ...props
}: Readonly<ComponentProps<typeof SelectPrimitive.Group>>) {
  return <SelectPrimitive.Group {...props} />;
}

function SelectGroupLabel({
  className,
  ...props
}: Readonly<ComponentProps<typeof SelectPrimitive.GroupLabel>>) {
  return (
    <SelectPrimitive.GroupLabel
      className={cn(
        "px-2 py-1.5 text-xs font-semibold text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export {
  SelectRoot as Select,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectItemText,
  SelectList,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
};
