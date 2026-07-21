import { notFound, redirect } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db/mongodb";
import { EmergencySession } from "@/lib/models/emergency-session";
import { EmergencyMessage } from "@/lib/models/emergency-message";
import { EmergencyChat } from "@/components/emergency-chat";
import { EmergencyTools } from "@/components/emergency-tools";

export default async function EmergencyPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params; const user = (await auth())?.user;
  if (!user?.id) redirect("/login"); if (!isValidObjectId(sessionId)) notFound();
  await connectToDatabase();
  const emergency = await EmergencySession.findOne({ _id: sessionId, userId: user.id }).lean() as { title: string; severity: string; location?: string } | null;
  if (!emergency) notFound();
  const rawMessages = await EmergencyMessage.find({ sessionId }).sort({ createdAt: 1 }).lean();
  const messages = rawMessages.map((item) => ({
    role: item.role as "user" | "assistant",
    message: String(item.message),
    createdAt: (item.createdAt as Date).toISOString(),
  }));
  return <main className="min-w-0 flex-1 p-6 sm:p-10"><div className="mx-auto max-w-6xl"><p className="text-sm font-medium text-sky-700">Emergency session · {emergency.severity}</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-navy">{emergency.title}</h1>{emergency.location && <p className="mt-2 text-sm text-slate-500">Location: {emergency.location}</p>}<div className="mt-7"><EmergencyChat sessionId={sessionId} initialMessages={messages} /></div><EmergencyTools sessionId={sessionId} location={emergency.location} /></div></main>;
}
