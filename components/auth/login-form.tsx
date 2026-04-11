"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { loginAction } from "@/app/auth/login/actions";
import {
  type LoginFormValues,
  loginSchema,
} from "@/components/auth/login.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const inputClassName = cn(
  "rounded-lg border-[#D1D5DB] bg-white text-sm text-[#334155]",
  "placeholder:text-[#94A3B8]",
  "focus-visible:border-[#6633FF] focus-visible:ring-[#6633FF]/25",
  "dark:border-border dark:bg-background dark:text-foreground"
);

const labelClassName =
  "text-sm font-medium leading-[150%] text-[#334155] dark:text-foreground";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema as never),
    defaultValues: {
      emailOrUserId: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    startTransition(async () => {
      const result = await loginAction(values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.replace("/dashboard");
      router.refresh();
    });
  }

  return (
    <div className="flex w-full max-w-[571px] flex-col gap-6">
      <h1 className="text-center text-2xl leading-[130%] font-semibold text-[#334155] dark:text-foreground">
        Sign In
      </h1>

      <div
        className={cn(
          "rounded-2xl border border-[#E5E7EB] bg-white p-8 pb-10 shadow-sm",
          "dark:border-border dark:bg-card dark:shadow-none"
        )}
      >
        <Form {...form}>
          <form
            className="flex flex-col gap-10"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="emailOrUserId"
                render={({ field }) => (
                  <FormItem className="gap-3 space-y-0">
                    <FormLabel className={labelClassName}>
                      Email/ User ID
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="username"
                        className={inputClassName}
                        placeholder="Enter your email/User ID"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="gap-2 space-y-0">
                    <FormLabel className={labelClassName}>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          autoComplete="current-password"
                          className={cn(inputClassName, "pr-11")}
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                      </FormControl>
                      <button
                        aria-expanded={showPassword}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md text-[#9CA3AF] transition-colors hover:text-[#64748B] focus-visible:ring-2 focus-visible:ring-[#6633FF]/40 focus-visible:outline-none"
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? (
                          <EyeOff aria-hidden className="size-5" />
                        ) : (
                          <Eye aria-hidden className="size-5" />
                        )}
                      </button>
                    </div>
                    <FormMessage />

                    <div className="flex justify-end">
                      <Link
                        className="text-sm leading-[150%] font-medium text-[#334155] underline-offset-4 hover:underline dark:text-foreground"
                        href="/auth/forgot-password"
                      >
                        Forget Password?
                      </Link>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button
              className="h-12 w-full rounded-xl bg-[#6633FF] text-base leading-[150%] font-semibold text-white hover:bg-[#6633FF]/90 focus-visible:ring-[#6633FF]/40 dark:text-white"
              disabled={isPending}
              type="submit"
            >
              {isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
