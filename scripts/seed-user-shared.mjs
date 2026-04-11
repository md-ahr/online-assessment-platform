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

/**
 * @param {{ mongoUri: string; email: string; password: string; userId: string; role: "employer" | "candidate" }} params
 */
export async function upsertSeedUser({
  mongoUri,
  email,
  password,
  userId,
  role,
}) {
  await mongoose.connect(mongoUri, { maxPoolSize: 5 });

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    await UserModel.updateOne(
      { $or: [{ email }, { userId }] },
      { $set: { email, passwordHash, role, userId } },
      { upsert: true }
    );
  } finally {
    await mongoose.disconnect();
  }
}
