import { Schema, Types, model, models } from "mongoose";

const imageAnalysisSchema = new Schema(
  {
    sessionId: { type: Types.ObjectId, ref: "EmergencySession", required: true, index: true },
    imageUrl: { type: String, required: true, trim: true },
    injuryType: { type: String, trim: true },
    severity: { type: String, enum: ["LOW", "MODERATE", "HIGH", "CRITICAL"] },
    confidence: { type: String, trim: true },
    recommendations: [{ type: String, trim: true }],
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const ImageAnalysis = models.ImageAnalysis || model("ImageAnalysis", imageAnalysisSchema);
