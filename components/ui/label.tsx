import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Label({
  className,
  htmlFor,
  ...props
}: Readonly<ComponentProps<"label">>) {
  return (
    <label
      className={cn(
        "text-sm leading-none font-medium text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      htmlFor={htmlFor}
      {...props}
    />
  );
}
