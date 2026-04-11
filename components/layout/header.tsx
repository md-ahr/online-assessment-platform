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
import type { AuthenticatedUser } from "@/lib/db/types";
import { cn } from "@/lib/utils";
import LogoImage from "@/public/images/logo.webp";
import LogoWhiteImage from "@/public/images/logo-white.webp";

import { ThemeSwitcher } from "./theme-switcher";

type HeaderProps = Readonly<{
  session: AuthenticatedUser | null;
}>;

export function Header({ session }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, startTransition] = useTransition();

  const isLoggedIn = session !== null;

  const isEmployerDashboard = pathname === "/dashboard";
  const isCandidateHome = pathname === "/candidate";

  let homeHref = "/auth/login";
  if (session) {
    homeHref = session.role === "candidate" ? "/candidate" : "/dashboard";
  }

  let navSectionLabel = "Online Test";
  if (isEmployerDashboard) {
    navSectionLabel = "Dashboard";
  } else if (isCandidateHome) {
    navSectionLabel = "Online Tests";
  }

  return (
    <header
      className={cn(
        "app-header sticky top-0 z-50 w-full bg-white",
        "border-b border-black/6",
        "dark:border-white/8 dark:bg-neutral-900"
      )}
    >
      <div className="container-wrapper flex h-20 min-h-20 w-full items-center gap-2 sm:gap-4">
        {!isLoggedIn ? (
          <>
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
            <h1 className="title min-w-0 flex-1 px-2 text-center">
              Akij Resource
            </h1>
          </>
        ) : (
          <>
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
            <nav
              aria-label="Main"
              className="flex min-w-0 flex-1 items-center justify-center px-1 sm:justify-start sm:pl-2"
            >
              <p className="w-full max-w-full truncate text-center text-sm leading-tight font-medium text-secondary sm:text-left sm:text-base dark:text-primary-foreground">
                {navSectionLabel}
              </p>
            </nav>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-4">
              <ThemeSwitcher />
              <Popover>
                <PopoverTrigger
                  className={cn(
                    "inline-flex h-auto max-w-[min(100vw-8rem,172px)] items-center gap-1.5 rounded-full px-1.5 py-1.5 sm:gap-2 sm:px-2",
                    "text-foreground hover:bg-transparent focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                    "dark:text-white/95 dark:focus-visible:ring-white/30"
                  )}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <User
                      aria-hidden
                      className="size-9 shrink-0 sm:size-10 dark:rounded-full dark:ring-1 dark:ring-white/15 dark:ring-offset-0"
                      height={40}
                      width={40}
                    />
                    <p className="hidden min-w-0 flex-col items-start text-left sm:flex">
                      <span className="max-w-40 truncate text-sm leading-[140%] font-semibold text-[#334155] dark:text-white">
                        {session.name}
                      </span>
                      <span
                        className="max-w-40 truncate text-xs leading-[150%] font-medium text-[#64748B] dark:text-white/55"
                        id={session.username}
                        title={`User ID: ${session.username}`}
                      >
                        Ref. ID - {session.username}
                      </span>
                    </p>
                  </div>
                  <ChevronDown
                    aria-hidden
                    className="size-4 shrink-0 text-[#4B5563] sm:size-5 dark:text-white/70"
                  />
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="flex w-[min(calc(100vw-1.5rem),18rem)] max-w-[min(calc(100vw-1.5rem),18rem)] flex-col gap-0 overflow-hidden p-0 sm:w-72 sm:max-w-none"
                >
                  <div className="border-b border-[#E5E7EB] bg-[#F3F4F6] px-3 py-3 dark:border-border dark:bg-muted/70">
                    <p className="truncate text-sm leading-[140%] font-semibold text-[#334155] dark:text-foreground">
                      {session.name}
                    </p>
                    <p
                      className="mt-1 truncate text-xs leading-[150%] font-medium text-[#64748B] dark:text-muted-foreground"
                      id="user-menu-ref-id"
                    >
                      Ref. ID - {session.username}
                    </p>
                  </div>
                  <div className="p-1">
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
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
