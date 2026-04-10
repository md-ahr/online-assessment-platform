import type { ComponentType, SVGProps } from "react";

export function StatBlock({
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
