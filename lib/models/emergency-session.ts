import { Schema, Types, model, models } from "mongoose";

export const severities = ["LOW", "MODERATE", "HIGH", "CRITICAL"] as const;

const emergencySessionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 1000 },
    severity: { type: String, enum: severities, default: "LOW" },
    location: { type: String, trim: true, maxlength: 250 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const EmergencySession = models.EmergencySession || model("EmergencySession", emergencySessionSchema);
