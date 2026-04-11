"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  Select,
  SelectItem,
  SelectItemText,
  SelectList,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ThemeOption = "light" | "dark" | "system";

const THEME_OPTIONS: readonly ThemeOption[] = ["light", "dark", "system"];

function formatThemeLabel(theme: ThemeOption): string {
  if (theme === "light") {
    return "Light";
  }

  if (theme === "dark") {
    return "Dark";
  }

  return "System";
}

function ThemeOptionIcon({ theme }: Readonly<{ theme: ThemeOption }>) {
  if (theme === "light") {
    return <Sun aria-hidden className="size-4" />;
  }

  if (theme === "dark") {
    return <Moon aria-hidden className="size-4" />;
  }

  return <Laptop aria-hidden className="size-4" />;
}

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  const selectedTheme: ThemeOption =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : "system";

  return (
    <div className="w-[112px]">
      <Select
        value={selectedTheme}
        onValueChange={(value) => setTheme(value as ThemeOption)}
      >
        <SelectTrigger
          aria-label="Select theme"
          className="h-10 min-h-10 rounded-xl px-2.5 text-sm"
        >
          <span className="inline-flex items-center gap-2">
            <ThemeOptionIcon theme={selectedTheme} />
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectPortal>
          <SelectPositioner>
            <SelectPopup>
              <SelectList>
                {THEME_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    <span className="inline-flex items-center gap-2">
                      <ThemeOptionIcon theme={option} />
                      <SelectItemText>
                        {formatThemeLabel(option)}
                      </SelectItemText>
                    </span>
                  </SelectItem>
                ))}
              </SelectList>
            </SelectPopup>
          </SelectPositioner>
        </SelectPortal>
      </Select>
    </div>
  );
}
