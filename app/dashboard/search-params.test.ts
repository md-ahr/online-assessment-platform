import { describe, expect, it } from "vitest";

import { parsePositiveInt } from "./search-params";

describe("parsePositiveInt", () => {
  it("returns fallback when value is undefined", () => {
    expect(parsePositiveInt(undefined, 8)).toBe(8);
  });

  it("returns fallback when value is invalid", () => {
    expect(parsePositiveInt("abc", 4)).toBe(4);
    expect(parsePositiveInt("-2", 4)).toBe(4);
  });

  it("returns parsed value when valid", () => {
    expect(parsePositiveInt("16", 8)).toBe(16);
  });
});
