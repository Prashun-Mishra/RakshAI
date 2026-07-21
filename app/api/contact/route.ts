import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { EmergencyContact } from "@/lib/models/emergency-contact";
import { requireUserId } from "@/lib/auth/require-user";
import { contactSchema } from "@/lib/validations/emergency";

export async function GET() {
  try { const userId = await requireUserId(); await connectToDatabase(); const contacts = await EmergencyContact.find({ userId }).sort({ name: 1 }).lean() as unknown as Array<{ _id: { toString(): string }; name: string; relationship: string; phone: string }>; return NextResponse.json({ contacts: contacts.map((item) => ({ id: item._id.toString(), name: item.name, relationship: item.relationship, phone: item.phone })) }); } catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === "UNAUTHORIZED" ? "Unauthorized" : "Unable to load contacts." }, { status: error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 500 }); }
}

export async function POST(request: Request) {
  try { const userId = await requireUserId(); const parsed = contactSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Please complete every contact field." }, { status: 400 }); await connectToDatabase(); const contact = await EmergencyContact.create({ userId, ...parsed.data }); return NextResponse.json({ contact: { id: contact._id.toString(), ...parsed.data } }, { status: 201 }); } catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === "UNAUTHORIZED" ? "Unauthorized" : "Unable to save contact." }, { status: error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 500 }); }
}
