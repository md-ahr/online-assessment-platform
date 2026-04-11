import { z } from "zod/v4";

export const loginSchema = z.object({
  emailOrUserId: z
    .string()
    .trim()
    .min(1, { message: "Enter your email or User ID" })
    .refine(
      (value) => {
        if (!value.includes("@")) {
          return true;
        }

        return z.email().safeParse(value).success;
      },
      { message: "Enter a valid email address" }
    ),
  password: z
    .string()
    .min(1, { message: "Enter your password" })
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
