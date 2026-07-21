import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { requireUserId } from "@/lib/auth/require-user";
import { connectToDatabase } from "@/lib/db/mongodb";
import { EmergencySession } from "@/lib/models/emergency-session";
import { ImageAnalysis } from "@/lib/models/image-analysis";
import { imageAnalysisSchema } from "@/lib/validations/emergency";
import { analyzeInjuryImage } from "@/lib/ai/gemini";

export async function POST(request: Request) {
  try {
    const userId = await requireUserId(); const parsed = imageAnalysisSchema.safeParse(await request.json());
    if (!parsed.success || !isValidObjectId(parsed.data?.sessionId)) return NextResponse.json({ error: "Provide a valid session and image URL." }, { status: 400 });
    await connectToDatabase();
    if (!await EmergencySession.exists({ _id: parsed.data.sessionId, userId })) return NextResponse.json({ error: "Emergency session not found." }, { status: 404 });
    const result = await analyzeInjuryImage(parsed.data.imageUrl);
    const analysis = await ImageAnalysis.create({ sessionId: parsed.data.sessionId, imageUrl: parsed.data.imageUrl, ...result });
    return NextResponse.json({ analysis: { id: analysis._id.toString(), ...result } }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const message = error instanceof Error && ["UNSAFE_IMAGE_URL", "IMAGE_FETCH_FAILED", "INVALID_IMAGE"].includes(error.message) ? "The image URL could not be safely read. Use a public, direct image URL." : error instanceof Error && error.message === "GEMINI_NOT_CONFIGURED" ? "AI assessment is not configured yet." : "Image analysis could not be completed. If this may be serious, seek emergency care now.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
