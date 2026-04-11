// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const TEST_JWT_SECRET = "test-jwt-secret-that-is-long-enough-12345";
const TEST_MONGODB_URI = "https://example.com";

describe("jwt helpers", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("JWT_SECRET", TEST_JWT_SECRET);
    vi.stubEnv("MONGODB_URI", TEST_MONGODB_URI);
    vi.stubEnv("NODE_ENV", "test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("creates and verifies session tokens", async () => {
    const { createSessionToken, verifySessionToken } = await import("./jwt");
    const token = await createSessionToken(
      {
        email: "employer@example.com",
        role: "employer",
        userId: "507f1f77bcf86cd799439011",
        username: "EMP001",
      },
      60
    );

    const payload = await verifySessionToken(token);

    expect(payload).toEqual({
      email: "employer@example.com",
      role: "employer",
      userId: "507f1f77bcf86cd799439011",
      username: "EMP001",
    });
  });

  it("returns null when token is invalid", async () => {
    const { verifySessionToken } = await import("./jwt");
    const payload = await verifySessionToken("not-a-token");

    expect(payload).toBeNull();
  });
});
