import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db/mongodb";
import { EmergencySession } from "@/lib/models/emergency-session";
import { ArrowRight, Clock3, Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  await connectToDatabase();
  const sessions = await EmergencySession.find({ userId: session.user.id }).sort({ createdAt: -1 }).limit(30).lean() as unknown as Array<{ _id: { toString(): string }; title: string; severity: string; location?: string; createdAt: Date }>;

  return (
    <main className="min-w-0 flex-1 p-6 sm:p-10"><div className="mx-auto max-w-5xl"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-sky-700">Emergency timeline</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-navy">Hello, {session.user.name?.split(" ")[0] ?? "there"}.</h1><p className="mt-2 text-slate-600">Your previous sessions are private and available here when you need them.</p></div><Link href="/dashboard/emergency/new" className="focus-ring inline-flex items-center gap-2 rounded-xl bg-safety px-4 py-3 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Start emergency assessment</Link></header>
      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>Immediate danger?</strong> Call your local emergency number now. GuardianAI offers supportive guidance and never replaces emergency services.</div>
      <section className="mt-8"><h2 className="text-lg font-semibold text-navy">Recent sessions</h2>{sessions.length === 0 ? <div className="mt-4 rounded-2xl border border-dashed bg-white p-10 text-center"><Clock3 className="mx-auto h-7 w-7 text-slate-400" /><p className="mt-3 font-medium text-navy">No emergency sessions yet</p><p className="mt-1 text-sm text-slate-500">Start a session to receive cautious, AI-assisted first-aid guidance.</p></div> : <div className="mt-4 grid gap-3">{sessions.map((item) => <Link key={item._id.toString()} href={`/dashboard/emergency/${item._id}`} className="focus-ring group flex items-center justify-between rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"><div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${severityClass(item.severity)}`}>{item.severity}</span><h3 className="mt-3 font-semibold text-navy">{item.title}</h3><p className="mt-1 text-sm text-slate-500">{item.location || "No location saved"} · {item.createdAt.toLocaleDateString()}</p></div><ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-navy" /></Link>)}</div>}</section></div>
    </main>
  );
}

function severityClass(severity: string) { return ({ LOW: "bg-emerald-50 text-emerald-700", MODERATE: "bg-amber-50 text-amber-800", HIGH: "bg-orange-50 text-orange-800", CRITICAL: "bg-red-50 text-red-800" } as Record<string, string>)[severity] ?? "bg-slate-100 text-slate-700"; }
