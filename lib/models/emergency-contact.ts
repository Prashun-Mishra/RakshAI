import { Schema, Types, model, models } from "mongoose";

const emergencyContactSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    relationship: { type: String, required: true, trim: true, maxlength: 50 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
  },
  { timestamps: false },
);

export const EmergencyContact = models.EmergencyContact || model("EmergencyContact", emergencyContactSchema);
