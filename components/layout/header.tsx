"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

import { logoutAction } from "@/app/(public)/auth/login/actions";
import { User } from "@/components/svg/user";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import LogoImage from "@/public/images/logo.webp";
import LogoWhiteImage from "@/public/images/logo-white.webp";

import { ThemeSwitcher } from "./theme-switcher";

export function Header() {
  const user = {
    name: "John Doe",
    refId: "16101121",
  };

  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, startTransition] = useTransition();

  const isLoggedIn = !pathname.startsWith("/auth");

  const isEmployerDashboard = pathname === "/dashboard";
  const isCandidateHome = pathname === "/candidate";
  const homeHref = !isLoggedIn
    ? "/auth/login"
    : pathname.startsWith("/candidate")
      ? "/candidate"
      : "/dashboard";

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
          <Link
            href={homeHref}
            className="relative inline-block h-8 w-[116px] shrink-0"
          >
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
          </Link>

          <nav aria-label="Main">
            {isLoggedIn && (
              <p>
                {isEmployerDashboard
                  ? "Dashboard"
                  : isCandidateHome
                    ? "Online Tests"
                    : "Online Test"}
              </p>
            )}
          </nav>
        </div>

        {!isLoggedIn && <h1 className="title mx-auto">Akij Resource</h1>}

        {isLoggedIn && (
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <ThemeSwitcher />
            <Popover>
              <PopoverTrigger
                className={cn(
                  "inline-flex h-auto max-w-[min(100vw-8rem,172px)] items-center gap-2 rounded-full px-2 py-1.5",
                  "text-foreground hover:bg-transparent focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                  "dark:text-white/95 dark:focus-visible:ring-white/30"
                )}
              >
                <div className="flex items-center gap-2">
                  <User
                    aria-hidden
                    className="size-10 shrink-0 dark:rounded-full dark:ring-1 dark:ring-white/15 dark:ring-offset-0"
                    height={40}
                    width={40}
                  />
                  <p className="hidden min-w-0 flex-col items-start text-left sm:flex">
                    <span className="max-w-40 truncate text-sm leading-[140%] font-semibold text-[#334155] dark:text-white">
                      {user.name}
                    </span>
                    <span className="max-w-40 truncate text-xs leading-[150%] font-medium text-[#64748B] dark:text-white/55">
                      Ref. ID - {user.refId}
                    </span>
                  </p>
                </div>
                <ChevronDown
                  aria-hidden
                  className="size-5 shrink-0 text-[#4B5563] dark:text-white/70"
                />
              </PopoverTrigger>
              <PopoverContent align="end" className="w-40 gap-0 p-1">
                <button
                  className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-[#334155] transition-colors hover:bg-accent hover:text-accent-foreground dark:text-white"
                  disabled={isLoggingOut}
                  type="button"
                  onClick={() => {
                    startTransition(async () => {
                      await logoutAction();
                      router.replace("/auth/login");
                      router.refresh();
                    });
                  }}
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </header>
  );
}
