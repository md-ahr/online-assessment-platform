import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ThemeProvider } from "./theme-provider";

const setTheme = vi.fn();

vi.mock("next-themes", () => {
  return {
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
    useTheme: () => ({
      resolvedTheme: "dark",
      setTheme,
    }),
  };
});

afterEach(() => {
  cleanup();
  setTheme.mockReset();
});

describe("ThemeProvider", () => {
  it("ignores keydown events without a key value", () => {
    render(
      <ThemeProvider>
        <div>content</div>
      </ThemeProvider>
    );

    expect(() => {
      globalThis.dispatchEvent(new Event("keydown"));
    }).not.toThrow();

    expect(setTheme).not.toHaveBeenCalled();
  });
});
