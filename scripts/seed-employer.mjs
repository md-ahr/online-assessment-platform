import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["employer", "candidate"],
      required: true,
      trim: true,
    },
    userId: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true, versionKey: false }
);

const UserModel = mongoose.models.User ?? mongoose.model("User", userSchema);

const requiredEnvKeys = [
  "MONGODB_URI",
  "SEED_USER_EMAIL",
  "SEED_USER_PASSWORD",
  "SEED_USER_ROLE",
  "SEED_USER_ID",
];

const missingKeys = requiredEnvKeys.filter((key) => !process.env[key]);

if (missingKeys.length > 0) {
  throw new Error(`Missing required env vars: ${missingKeys.join(", ")}`);
}

const email = process.env.SEED_USER_EMAIL.trim().toLowerCase();
const userId = process.env.SEED_USER_ID.trim();
const role = process.env.SEED_USER_ROLE.trim().toLowerCase();
const password = process.env.SEED_USER_PASSWORD;

if (role !== "employer" && role !== "candidate") {
  throw new Error("SEED_USER_ROLE must be either 'employer' or 'candidate'");
}

await mongoose.connect(process.env.MONGODB_URI, { maxPoolSize: 5 });

const passwordHash = await bcrypt.hash(password, 10);

await UserModel.updateOne(
  { $or: [{ email }, { userId }] },
  { $set: { email, passwordHash, role, userId } },
  { upsert: true }
);

await mongoose.disconnect();

process.stdout.write(`User seed complete for ${email} (${role}:${userId})\n`);
