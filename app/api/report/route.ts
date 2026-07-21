import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { requireUserId } from "@/lib/auth/require-user";
import { connectToDatabase } from "@/lib/db/mongodb";
import { EmergencySession } from "@/lib/models/emergency-session";
import { EmergencyMessage } from "@/lib/models/emergency-message";
import { EmergencyReport } from "@/lib/models/emergency-report";
import { createEmergencyPdf } from "@/lib/reports/emergency-pdf";

export async function POST(request: Request) {
  try {
    const userId = await requireUserId(); const { sessionId } = await request.json();
    if (typeof sessionId !== "string" || !isValidObjectId(sessionId)) return NextResponse.json({ error: "Invalid emergency session." }, { status: 400 });
    await connectToDatabase();
    const session = await EmergencySession.findOne({ _id: sessionId, userId }).lean() as unknown as { _id: { toString(): string }; title: string; severity: string; location?: string; createdAt: Date } | null;
    if (!session) return NextResponse.json({ error: "Emergency session not found." }, { status: 404 });
    const messages = await EmergencyMessage.find({ sessionId }).sort({ createdAt: 1 }).lean() as unknown as Array<{ role: string; message: string; createdAt: Date }>;
    const pdf = await createEmergencyPdf({ ...session, messages });
    const summary = messages.filter((item) => item.role === "assistant").map((item) => item.message).at(-1) ?? session.title;
    await EmergencyReport.create({ sessionId, summary, pdfUrl: "" });
    const filename = `rakshai-report-${session._id.toString()}.pdf`;
    return new NextResponse(new Uint8Array(pdf), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${filename}"`, "Cache-Control": "no-store" } });
  } catch (error) { console.error("Report error", error); return NextResponse.json({ error: error instanceof Error && error.message === "UNAUTHORIZED" ? "Unauthorized" : "Unable to generate the report." }, { status: error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 500 }); }
}
