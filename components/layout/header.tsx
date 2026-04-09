import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { User } from "@/components/svg/user";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LogoImage from "@/public/images/logo.webp";
import LogoWhiteImage from "@/public/images/logo-white.webp";

export function Header() {
  const user = {
    name: "John Doe",
    refId: "16101121",
  };

  const isLoggedIn = true;

  return (
    <header
      className={cn(
        "app-header sticky top-0 z-50 w-full bg-white",
        "border-b border-black/6",
        "dark:border-white/8 dark:bg-neutral-900"
      )}
    >
      <div className="container-wrapper flex h-20 items-center justify-between gap-4">
        <div
          className={cn(
            "flex min-w-0 items-center",
            isLoggedIn ? "gap-8 md:gap-16 lg:gap-25" : ""
          )}
        >
          <span className="relative inline-block h-8 w-[116px] shrink-0">
            <Image
              src={LogoImage}
              alt="AKIJ RESOURCE"
              width={116}
              height={32}
              className="dark:hidden"
              priority
            />
            <Image
              src={LogoWhiteImage}
              alt=""
              width={116}
              height={32}
              aria-hidden
              className="hidden dark:block"
              priority
            />
          </span>

          <nav aria-label="Main">
            {isLoggedIn && (
              <Link
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-0 py-2",
                  "text-base leading-[140%] font-normal text-[#130B2C]",
                  "transition-colors hover:text-[#130B2C]/85",
                  "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                  "dark:text-white/95 dark:hover:text-white",
                  "dark:focus-visible:ring-white/35"
                )}
                href="/dashboard"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        {!isLoggedIn && <h1 className="title mx-auto">Akij Resource</h1>}

        {isLoggedIn && (
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <Button
              className={cn(
                "h-auto max-w-[min(100vw-8rem,172px)] gap-2 rounded-full py-1.5 pr-2 pl-2",
                "text-foreground hover:bg-black/4",
                "dark:text-white/95 dark:hover:bg-white/8",
                "dark:focus-visible:ring-white/30"
              )}
              type="button"
              variant="ghost"
            >
              <User
                aria-hidden
                className="size-10 shrink-0 dark:rounded-full dark:ring-1 dark:ring-white/15 dark:ring-offset-0"
                height={40}
                width={40}
              />
              <span className="hidden min-w-0 flex-col items-start text-left sm:flex">
                <span className="max-w-40 truncate text-sm leading-[140%] font-semibold text-[#334155] dark:text-white">
                  {user.name}
                </span>
                <span className="max-w-40 truncate text-xs leading-[150%] font-medium text-[#64748B] dark:text-white/55">
                  Ref. ID - {user.refId}
                </span>
              </span>
              <ChevronDown
                aria-hidden
                className="size-4 shrink-0 text-[#4B5563] dark:text-white/70"
              />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
