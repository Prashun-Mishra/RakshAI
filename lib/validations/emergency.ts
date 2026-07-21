import { z } from "zod";

export const createSessionSchema = z.object({
  title: z.string().trim().min(3).max(1000),
  location: z.string().trim().max(250).optional(),
});

export const chatSchema = z.object({
  sessionId: z.string().length(24),
  message: z.string().trim().min(2).max(6000),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  relationship: z.string().trim().min(2).max(50),
  phone: z.string().trim().min(5).max(30),
});

export const imageAnalysisSchema = z.object({
  sessionId: z.string().length(24),
  imageUrl: z.string().url().max(2048).refine((value) => /^https?:\/\//i.test(value), "Use an http(s) image URL"),
});
