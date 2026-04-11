import { z } from "zod/v4";

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

function toMinutes(value: string): number {
  const [hours, minutes] = value.split(":");
  return Number(hours) * 60 + Number(minutes);
}

export const basicInfoSchema = z
  .object({
    title: z.string().trim().min(1, "Online Test Title is required"),
    totalCandidates: z
      .string()
      .trim()
      .regex(/^\d+$/, "Total Candidates must be a valid number"),
    totalSlots: z.string().trim().min(1, "Total Slots is required"),
    totalQuestionSet: z
      .string()
      .trim()
      .min(1, "Total Question Set is required"),
    questionType: z.string().trim().min(1, "Question Type is required"),
    startTime: z
      .string()
      .trim()
      .min(1, "Start Time is required")
      .regex(timePattern, "Start Time must be a valid time"),
    endTime: z
      .string()
      .trim()
      .min(1, "End Time is required")
      .regex(timePattern, "End Time must be a valid time"),
    duration: z.string().trim().optional(),
  })
  .superRefine((values, ctx) => {
    if (
      !timePattern.test(values.startTime) ||
      !timePattern.test(values.endTime)
    ) {
      return;
    }

    if (toMinutes(values.endTime) <= toMinutes(values.startTime)) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "End Time must be later than Start Time",
      });
    }
  });
