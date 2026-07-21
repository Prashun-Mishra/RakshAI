"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, MapPin } from "lucide-react";

export function StartSessionForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: form.get("title"), location: form.get("location") || undefined }) });
    const payload = await response.json(); setLoading(false);
    if (!response.ok) return setError(payload.error ?? "Unable to start a session.");
    router.push(`/dashboard/emergency/${payload.session.id}`);
  }
  return <form onSubmit={submit} className="mt-8 space-y-5 rounded-3xl border bg-white p-6 shadow-card"><label className="block text-sm font-medium text-slate-700">What happened?<textarea required name="title" minLength={3} maxLength={1000} rows={5} placeholder="For example: I fell and hurt my ankle" className="focus-ring mt-2 w-full resize-none rounded-xl border p-3 text-ink" /></label><label className="block text-sm font-medium text-slate-700">Location <span className="font-normal text-slate-400">(optional)</span><div className="relative mt-2"><MapPin className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" /><input name="location" maxLength={250} placeholder="City, address, or a useful landmark" className="focus-ring w-full rounded-xl border py-3 pl-10 pr-3 text-ink" /></div></label>{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="focus-ring inline-flex items-center gap-2 rounded-xl bg-safety px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <>Begin assessment <ArrowRight className="h-4 w-4" /></>}</button></form>;
}
