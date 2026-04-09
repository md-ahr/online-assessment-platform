"use client";

import { type SVGProps, useId } from "react";

export function Search({
  width = 32,
  height = 32,
  fill = "#673FED",
  fillOpacity = "0.1",
  ...props
}: Readonly<SVGProps<SVGSVGElement>>) {
  const baseId = useId();
  const paint0 = `${baseId}-paint0`;
  const paint1 = `${baseId}-paint1`;
  const paint2 = `${baseId}-paint2`;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Search"
      {...props}
    >
      <title>Search</title>
      <rect
        width="32"
        height="32"
        rx="16"
        fill={fill}
        fillOpacity={fillOpacity}
      />
      <path
        d="M19.333 19.75L22.6663 23.0833"
        stroke={`url(#${paint0})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.9997 15.5833C20.9997 18.805 18.388 21.4166 15.1663 21.4166C11.9447 21.4166 9.33301 18.805 9.33301 15.5833C9.33301 12.3617 11.9447 9.75 15.1663 9.75"
        stroke={`url(#${paint1})`}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.9167 8.91675L19.1316 9.49761C19.4134 10.2593 19.5543 10.6401 19.8322 10.9179C20.11 11.1957 20.4908 11.3366 21.2525 11.6185L21.8333 11.8334L21.2525 12.0483C20.4908 12.3302 20.11 12.4711 19.8322 12.7489C19.5543 13.0267 19.4134 13.4076 19.1316 14.1692L18.9167 14.7501L18.7017 14.1692C18.4199 13.4076 18.279 13.0267 18.0012 12.7489C17.7233 12.4711 17.3425 12.3302 16.5808 12.0483L16 11.8334L16.5808 11.6185C17.3425 11.3366 17.7233 11.1957 18.0012 10.9179C18.279 10.6401 18.4199 10.2593 18.7017 9.49761L18.9167 8.91675Z"
        stroke={`url(#${paint2})`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={paint0}
          x1="20.9996"
          y1="19.75"
          x2="20.9996"
          y2="23.0833"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27ACFF" />
          <stop offset="0.504808" stopColor="#A000E9" />
          <stop offset="1" stopColor="#673FED" />
        </linearGradient>
        <linearGradient
          id={paint1}
          x1="15.1663"
          y1="9.75"
          x2="15.1663"
          y2="21.4166"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27ACFF" />
          <stop offset="0.504808" stopColor="#A000E9" />
          <stop offset="1" stopColor="#673FED" />
        </linearGradient>
        <linearGradient
          id={paint2}
          x1="18.9167"
          y1="8.91675"
          x2="18.9167"
          y2="14.7501"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#27ACFF" />
          <stop offset="0.504808" stopColor="#A000E9" />
          <stop offset="1" stopColor="#673FED" />
        </linearGradient>
      </defs>
    </svg>
  );
}
