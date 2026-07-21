import { Schema, Types, model, models } from "mongoose";

const emergencyMessageSchema = new Schema(
  {
    sessionId: { type: Types.ObjectId, ref: "EmergencySession", required: true, index: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    message: { type: String, required: true, trim: true, maxlength: 6000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const EmergencyMessage = models.EmergencyMessage || model("EmergencyMessage", emergencyMessageSchema);
