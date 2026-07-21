import { Schema, Types, model, models } from "mongoose";

const emergencyReportSchema = new Schema(
  {
    sessionId: { type: Types.ObjectId, ref: "EmergencySession", required: true, index: true },
    summary: { type: String, required: true, trim: true, maxlength: 10000 },
    pdfUrl: { type: String, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const EmergencyReport = models.EmergencyReport || model("EmergencyReport", emergencyReportSchema);
