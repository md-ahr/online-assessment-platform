import { upsertSeedUser } from "./seed-user-shared.mjs";

const requiredEnvKeys = [
  "MONGODB_URI",
  "SEED_USER_EMAIL",
  "SEED_USER_PASSWORD",
  "SEED_USER_ID",
];

const missingKeys = requiredEnvKeys.filter((key) => !process.env[key]);

if (missingKeys.length > 0) {
  throw new Error(`Missing required env vars: ${missingKeys.join(", ")}`);
}

const email = process.env.SEED_USER_EMAIL.trim().toLowerCase();
const userId = process.env.SEED_USER_ID.trim();
const password = process.env.SEED_USER_PASSWORD;
const roleEnv = process.env.SEED_USER_ROLE?.trim().toLowerCase();
const role =
  roleEnv === "candidate"
    ? "candidate"
    : !roleEnv || roleEnv === "employer"
      ? "employer"
      : null;

if (role === null) {
  throw new Error("SEED_USER_ROLE must be either 'employer' or 'candidate'");
}

await upsertSeedUser({
  mongoUri: process.env.MONGODB_URI,
  email,
  password,
  userId,
  role,
});

process.stdout.write(`User seed complete for ${email} (${role}:${userId})\n`);
