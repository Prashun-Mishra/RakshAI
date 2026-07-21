import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { EmergencySession } from "@/lib/models/emergency-session";
import { requireUserId } from "@/lib/auth/require-user";
import { createSessionSchema } from "@/lib/validations/emergency";

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const parsed = createSessionSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Please provide a concise emergency description." }, { status: 400 });
    await connectToDatabase();
    const emergency = await EmergencySession.create({ userId, ...parsed.data });
    return NextResponse.json({ session: { id: emergency._id.toString(), title: emergency.title, severity: emergency.severity, location: emergency.location, createdAt: emergency.createdAt } }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("Create session error", error);
    return NextResponse.json({ error: "Unable to start an emergency session." }, { status: 500 });
  }
}
