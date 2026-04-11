import { upsertSeedUser } from "./seed-user-shared.mjs";

const requiredEnvKeys = [
  "MONGODB_URI",
  "SEED_CANDIDATE_EMAIL",
  "SEED_CANDIDATE_PASSWORD",
  "SEED_CANDIDATE_USER_ID",
];

const missingKeys = requiredEnvKeys.filter((key) => !process.env[key]);

if (missingKeys.length > 0) {
  throw new Error(`Missing required env vars: ${missingKeys.join(", ")}`);
}

const email = process.env.SEED_CANDIDATE_EMAIL.trim().toLowerCase();
const userId = process.env.SEED_CANDIDATE_USER_ID.trim();
const password = process.env.SEED_CANDIDATE_PASSWORD;

await upsertSeedUser({
  mongoUri: process.env.MONGODB_URI,
  email,
  password,
  userId,
  role: "candidate",
});

process.stdout.write(`Candidate user seed complete for ${email} (${userId})\n`);
