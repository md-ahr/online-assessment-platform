"use client";

import Link from "next/link";
import { useId, useLayoutEffect, useRef } from "react";

import { Timeout } from "@/components/svg";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TestTimeoutModalProps = Readonly<{
  displayName: string;
}>;

export function TestTimeoutModal({ displayName }: TestTimeoutModalProps) {
  const titleId = useId();
  const backRef = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    backRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[#0F172A]/45 backdrop-blur-[1px]"
      />
      <div
        className={cn(
          "relative box-border flex w-full max-w-[791px] flex-col items-center justify-center gap-2 rounded-[20px] border border-[#E5E7EB] bg-white px-6 py-12 shadow-lg sm:px-12 sm:py-14 md:px-24 lg:px-[158px] lg:py-14",
          "dark:border-border dark:bg-card dark:shadow-2xl"
        )}
      >
        <div className="flex w-full max-w-[674px] flex-col items-center gap-8">
          <div className="flex w-full flex-col items-center gap-3 text-center">
            <Timeout />
            <div className="flex w-full flex-col items-center gap-2">
              <h2
                className="text-center text-xl leading-6 font-semibold text-[#334155] dark:text-foreground"
                id={titleId}
              >
                Timeout!
              </h2>
              <p className="max-w-[674px] text-center text-base leading-normal font-normal text-[#64748B] dark:text-muted-foreground">
                {`Dear `}
                <strong className="font-semibold text-[#334155] dark:text-foreground">
                  {displayName}
                </strong>
                {`, Your exam time has been finished. Thank you for participating.`}
              </p>
            </div>
          </div>
          <Link
            ref={backRef}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 min-w-[180px] rounded-xl border-[#E5E7EB] px-8 text-base font-semibold text-[#334155] hover:bg-[#F9FAFB] dark:border-border dark:text-foreground dark:hover:bg-muted/50"
            )}
            href="/candidate"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
