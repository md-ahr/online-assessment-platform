import {
  type InferSchemaType,
  type Model,
  model,
  models,
  Schema,
  type Types,
} from "mongoose";

const optionSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const questionSchema = new Schema(
  {
    prompt: { type: String, required: true, trim: true },
    questionType: {
      type: String,
      enum: ["Checkbox", "Radio", "Text"],
      required: true,
    },
    score: { type: Number, required: true, min: 0 },
    options: { type: [optionSchema], default: [] },
  },
  { _id: false }
);

const onlineTestSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    totalCandidates: { type: Number, required: true, min: 0 },
    totalSlots: { type: Number, required: true, min: 0 },
    totalQuestionSet: { type: Number, required: true, min: 0 },
    questionType: {
      type: String,
      enum: ["MCQ", "Checkbox", "Text"],
      required: true,
    },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, default: null, min: 0 },
    /** Penalty per wrong answer. Use 0 for no negative marking; default -0.25. */
    negativeMarkPerWrong: { type: Number, default: -0.25 },
    questions: { type: [questionSchema], default: [] },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

onlineTestSchema.index({ title: "text" });
onlineTestSchema.index({ createdAt: -1 });

export type OnlineTestDocument = InferSchemaType<typeof onlineTestSchema> & {
  _id: Types.ObjectId;
};

export const OnlineTestModel: Model<OnlineTestDocument> =
  models.OnlineTest ??
  model<OnlineTestDocument>("OnlineTest", onlineTestSchema);
