import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { EmergencySession } from "@/lib/models/emergency-session";
import { requireUserId } from "@/lib/auth/require-user";

export async function GET() {
  try {
    const userId = await requireUserId();
    await connectToDatabase();
    const sessions = await EmergencySession.find({ userId }).sort({ createdAt: -1 }).limit(50).lean() as unknown as Array<{ _id: { toString(): string }; title: string; severity: string; location?: string; createdAt: Date }>;
    return NextResponse.json({ sessions: sessions.map((item) => ({ id: item._id.toString(), title: item.title, severity: item.severity, location: item.location, createdAt: item.createdAt })) });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Unable to load session history." }, { status: 500 });
  }
}
