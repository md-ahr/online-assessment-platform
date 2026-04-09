import type { SVGProps } from "react";

export function Clock({
  width = 24,
  height = 24,
  stroke = "#9CA3AF",
  strokeWidth = "1.5",
  ...props
}: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Clock"
      {...props}
    >
      <title>Clock</title>
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <path
        d="M12 8V12L14 14"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
