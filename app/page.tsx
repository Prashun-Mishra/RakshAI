import Link from "next/link";
import { ArrowRight, ShieldAlert, Stethoscope } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-mist to-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-navy"><ShieldAlert className="h-6 w-6 text-safety" />RakshAI</Link>
        <div className="flex gap-3"><Link className="focus-ring rounded-lg px-4 py-2 text-sm font-medium" href="/login">Sign in</Link><Link className="focus-ring rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white" href="/register">Create account</Link></div>
      </nav>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
        <div><p className="mb-5 inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-800">Emergency support, thoughtfully guided</p><h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-navy sm:text-6xl">Clear next steps when every minute matters.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">RakshAI assesses urgent situations, helps document symptoms, and connects you with nearby emergency services. It never replaces professional medical care.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/register" className="focus-ring inline-flex items-center gap-2 rounded-xl bg-safety px-5 py-3 font-semibold text-white shadow-lg shadow-orange-200">Get started <ArrowRight className="h-4 w-4" /></Link><Link href="/login" className="focus-ring rounded-xl border bg-white px-5 py-3 font-semibold text-navy">Open dashboard</Link></div></div>
        <div className="rounded-3xl border bg-white p-6 shadow-card"><div className="flex items-center gap-3 border-b pb-5"><div className="rounded-2xl bg-red-50 p-3 text-safety"><Stethoscope /></div><div><p className="font-semibold">Emergency assessment</p><p className="text-sm text-slate-500">Start with what happened</p></div></div><div className="space-y-4 py-6"><div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">“I cut my hand while cooking and it won’t stop bleeding.”</div><div className="rounded-2xl bg-sky-50 p-4 text-sm leading-6 text-sky-950">I can help you assess this. Apply firm, continuous pressure with clean cloth. Is the bleeding soaking through it, or do you feel faint?</div></div><div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">For life-threatening symptoms, call your local emergency number immediately.</div></div>
      </section>
    </main>
  );
}
