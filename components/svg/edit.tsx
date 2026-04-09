import type { SVGProps } from "react";

export function Edit({
  width = 20,
  height = 20,
  stroke = "#6633FF",
  strokeWidth = "1.5",
  ...props
}: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Edit"
      {...props}
    >
      <title>Edit</title>
      <path
        d="M11.7282 3.23771C12.3492 2.5649 12.6597 2.2285 12.9896 2.03228C13.7857 1.5588 14.766 1.54408 15.5754 1.99344C15.9108 2.17967 16.2308 2.5066 16.8709 3.16047C17.511 3.81434 17.8311 4.14127 18.0133 4.48395C18.4532 5.31077 18.4388 6.31216 17.9753 7.12542C17.7832 7.46247 17.4539 7.77965 16.7953 8.414L8.95892 15.9618C7.71082 17.1639 7.08675 17.765 6.3068 18.0696C5.52685 18.3743 4.66942 18.3518 2.95455 18.307L2.72123 18.3009C2.19917 18.2873 1.93814 18.2804 1.78641 18.1082C1.63467 17.936 1.65538 17.6701 1.69682 17.1383L1.71932 16.8496C1.83592 15.3528 1.89422 14.6044 2.18651 13.9317C2.47878 13.2589 2.98295 12.7128 3.99127 11.6203L11.7282 3.23771Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M10.8333 3.3335L16.6666 9.16683"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M11.6667 18.3335H18.3334"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
