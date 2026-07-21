import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/db/mongodb";
import { EmergencySession } from "@/lib/models/emergency-session";
import { EmergencyMessage } from "@/lib/models/emergency-message";
import { requireUserId } from "@/lib/auth/require-user";
import { chatSchema } from "@/lib/validations/emergency";
import { assessEmergency, assessmentToMessage } from "@/lib/ai/gemini";

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const parsed = chatSchema.safeParse(await request.json());
    if (!parsed.success || !isValidObjectId(parsed.data?.sessionId)) return NextResponse.json({ error: "Invalid emergency message." }, { status: 400 });
    await connectToDatabase();
    const emergency = await EmergencySession.findOne({ _id: parsed.data.sessionId, userId });
    if (!emergency) return NextResponse.json({ error: "Emergency session not found." }, { status: 404 });

    const prior = await EmergencyMessage.find({ sessionId: emergency._id }).sort({ createdAt: -1 }).limit(6).lean() as unknown as Array<{ role: string; message: string }>;
    await EmergencyMessage.create({ sessionId: emergency._id, role: "user", message: parsed.data.message });
    const assessment = await assessEmergency(parsed.data.message, prior.reverse().map((item) => `${item.role}: ${item.message}`));
    const assistantMessage = assessmentToMessage(assessment);
    await Promise.all([
      EmergencyMessage.create({ sessionId: emergency._id, role: "assistant", message: assistantMessage }),
      EmergencySession.updateOne({ _id: emergency._id }, { severity: assessment.severity }),
    ]);
    return NextResponse.json({ assessment, message: { role: "assistant", message: assistantMessage, createdAt: new Date().toISOString() } });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof Error && error.message === "GEMINI_NOT_CONFIGURED") return NextResponse.json({ error: "AI assessment is not configured yet. Add GEMINI_API_KEY to continue." }, { status: 503 });
    console.error("Emergency assessment error", error);
    return NextResponse.json({ error: "The assessment service could not respond. If this may be serious, call emergency services now." }, { status: 502 });
  }
}
