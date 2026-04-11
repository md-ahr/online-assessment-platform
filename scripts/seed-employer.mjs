import { upsertSeedUser } from "./seed-user-shared.mjs";

const requiredEnvKeys = [
  "MONGODB_URI",
  "SEED_EMPLOYER_NAME",
  "SEED_EMPLOYER_EMAIL",
  "SEED_EMPLOYER_PASSWORD",
  "SEED_EMPLOYER_ID",
  "SEED_EMPLOYER_ROLE",
];

const missingKeys = requiredEnvKeys.filter((key) => !process.env[key]);

if (missingKeys.length > 0) {
  throw new Error(`Missing required env vars: ${missingKeys.join(", ")}`);
}

const name = process.env.SEED_EMPLOYER_NAME.trim();
const email = process.env.SEED_EMPLOYER_EMAIL.trim().toLowerCase();
const userId = process.env.SEED_EMPLOYER_ID.trim();
const password = process.env.SEED_EMPLOYER_PASSWORD;
const roleEnv = process.env.SEED_EMPLOYER_ROLE?.trim().toLowerCase();

/** @type {"employer" | "candidate" | null} */
let role = null;
if (roleEnv === "candidate") {
  role = "candidate";
} else if (!roleEnv || roleEnv === "employer") {
  role = "employer";
}

if (role === null) {
  throw new Error(
    "SEED_EMPLOYER_ROLE must be either 'employer' or 'candidate'"
  );
}

await upsertSeedUser({
  mongoUri: process.env.MONGODB_URI,
  name,
  email,
  password,
  userId,
  role,
});

process.stdout.write(`User seed complete for ${email} (${role}:${userId})\n`);
