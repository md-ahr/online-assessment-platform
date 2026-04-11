"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

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

let didCommitClientRender = false;
const clientRenderListeners = new Set<() => void>();

function subscribeToClientRender(onStoreChange: () => void) {
  clientRenderListeners.add(onStoreChange);

  queueMicrotask(() => {
    if (didCommitClientRender) {
      return;
    }

    didCommitClientRender = true;

    for (const listener of clientRenderListeners) {
      listener();
    }
  });

  return () => {
    clientRenderListeners.delete(onStoreChange);
  };
}

function getClientHasRenderedSnapshot() {
  return didCommitClientRender;
}

function getServerHasRenderedSnapshot() {
  return false;
}

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();
  const hasRenderedOnClient = useSyncExternalStore(
    subscribeToClientRender,
    getClientHasRenderedSnapshot,
    getServerHasRenderedSnapshot
  );

  const selectedTheme: ThemeOption =
    hasRenderedOnClient &&
    (theme === "light" || theme === "dark" || theme === "system")
      ? theme
      : "system";

  return (
    <div className="w-[min(100%,5.75rem)] shrink-0 sm:w-[112px]">
      <Select
        value={selectedTheme}
        onValueChange={(value) => setTheme(value as ThemeOption)}
      >
        <SelectTrigger
          aria-label="Select theme"
          className="h-10 min-h-10 rounded-xl px-1.5 text-xs sm:px-2.5 sm:text-sm"
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
