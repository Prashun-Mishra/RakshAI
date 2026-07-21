import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/db/mongodb";
import { EmergencyContact } from "@/lib/models/emergency-contact";
import { requireUserId } from "@/lib/auth/require-user";
import { contactSchema } from "@/lib/validations/emergency";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const userId = await requireUserId(); const { id } = await params; const parsed = contactSchema.safeParse(await request.json()); if (!isValidObjectId(id) || !parsed.success) return NextResponse.json({ error: "Invalid contact details." }, { status: 400 }); await connectToDatabase(); const contact = await EmergencyContact.findOneAndUpdate({ _id: id, userId }, parsed.data, { new: true }).lean() as unknown as { _id: { toString(): string }; name: string; relationship: string; phone: string } | null; if (!contact) return NextResponse.json({ error: "Contact not found." }, { status: 404 }); return NextResponse.json({ contact: { id: contact._id.toString(), name: contact.name, relationship: contact.relationship, phone: contact.phone } }); } catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === "UNAUTHORIZED" ? "Unauthorized" : "Unable to update contact." }, { status: error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 500 }); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const userId = await requireUserId(); const { id } = await params; if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid contact." }, { status: 400 }); await connectToDatabase(); const deleted = await EmergencyContact.findOneAndDelete({ _id: id, userId }); if (!deleted) return NextResponse.json({ error: "Contact not found." }, { status: 404 }); return new NextResponse(null, { status: 204 }); } catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === "UNAUTHORIZED" ? "Unauthorized" : "Unable to delete contact." }, { status: error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 500 }); }
}
