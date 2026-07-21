import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true, maxlength: 30 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const User = models.User || model("User", userSchema);
