"use client";

import { type ComponentProps, forwardRef } from "react";

import { fieldControlClasses } from "@/lib/field-control-classes";
import { cn } from "@/lib/utils";

export type InputProps = Omit<ComponentProps<"input">, "size">;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(fieldControlClasses, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
