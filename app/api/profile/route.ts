import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/require-user";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/models/user";

export async function GET() {
  try { const userId = await requireUserId(); await connectToDatabase(); const user = await User.findById(userId).select("name email phone createdAt").lean() as unknown as { _id: { toString(): string }; name: string; email: string; phone?: string; createdAt: Date } | null; if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 }); return NextResponse.json({ user: { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone, createdAt: user.createdAt } }); } catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === "UNAUTHORIZED" ? "Unauthorized" : "Unable to load profile." }, { status: error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 500 }); }
}
