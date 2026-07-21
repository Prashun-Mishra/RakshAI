"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { LoaderCircle, Mic, Send, TriangleAlert } from "lucide-react";

type ChatMessage = { role: "user" | "assistant"; message: string; createdAt?: string };
type Assessment = { severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL"; confidence: string; likelyConditions: string[]; firstAid: string[]; questions: string[]; disclaimer: string; summary: string };

export function EmergencyChat({ sessionId, initialMessages }: { sessionId: string; initialMessages: ChatMessage[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const recognition = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom on new messages or loading state change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function submit(event: FormEvent) {
    event.preventDefault(); const message = input.trim(); if (!message || loading) return;
    setInput(""); setError(""); setLoading(true); setMessages((current) => [...current, { role: "user", message }]);
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, message }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not assess this emergency.");
      setMessages((current) => [...current, result.message]); setAssessment(result.assessment);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not assess this emergency."); }
    finally { setLoading(false); }
  }

  function startVoiceInput() {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) { setError("Voice input is not supported in this browser."); return; }
    recognition.current = new Recognition(); recognition.current.lang = "en-US"; recognition.current.interimResults = false;
    recognition.current.onresult = (event) => setInput((value) => `${value} ${event.results[0][0].transcript}`.trim());
    recognition.current.onerror = () => setError("Voice input could not be started. Please type your message instead."); recognition.current.start();
  }

  return <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"><section className="flex h-[600px] flex-col overflow-hidden rounded-3xl border bg-white shadow-card"><div className="border-b p-5"><p className="font-semibold text-navy">AI emergency assessment</p><p className="mt-1 text-sm text-slate-500">Describe symptoms, timing, and what you can observe. Avoid waiting if the situation feels life-threatening.</p></div><div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-5">{messages.length === 0 && <div className="rounded-2xl bg-sky-50 p-5 text-sm leading-6 text-sky-950">I’m ready to help you assess this carefully. Please describe what happened, when it began, and any symptoms you can see or feel.</div>}{messages.map((item, index) => <div key={`${item.role}-${index}`} className={item.role === "user" ? "ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-navy p-4 text-sm leading-6 text-white" : "max-w-[88%] whitespace-pre-line rounded-2xl rounded-bl-md bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm"}>{item.message}</div>)}{loading && <div className="flex items-center gap-2 text-sm text-slate-500"><LoaderCircle className="h-4 w-4 animate-spin" />Assessing your message carefully…</div>}<div ref={messagesEndRef} /></div><form onSubmit={submit} className="border-t p-4"><div className="flex gap-2"><textarea value={input} onChange={(event) => setInput(event.target.value)} rows={2} maxLength={6000} placeholder="Describe what happened…" className="focus-ring min-h-12 flex-1 resize-none rounded-xl border px-3 py-2 text-sm" /><button type="button" onClick={startVoiceInput} title="Voice input" className="focus-ring self-end rounded-xl border p-3 text-slate-600 hover:bg-slate-50"><Mic className="h-5 w-5" /></button><button disabled={!input.trim() || loading} title="Send message" className="focus-ring self-end rounded-xl bg-navy p-3 text-white disabled:opacity-50"><Send className="h-5 w-5" /></button></div>{error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}</form></section><aside className="space-y-4"><div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><div className="flex items-center gap-2 font-semibold"><TriangleAlert className="h-4 w-4" />Safety first</div><p className="mt-2">For unconsciousness, severe bleeding, breathing difficulty, stroke symptoms, chest pain, or immediate danger: call your local emergency number now.</p></div>{assessment && <AssessmentCard assessment={assessment} />}</aside></div>;
}

function AssessmentCard({ assessment }: { assessment: Assessment }) { const critical = assessment.severity === "HIGH" || assessment.severity === "CRITICAL"; return <div className="rounded-2xl border bg-white p-5 shadow-sm"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${critical ? "bg-red-50 text-red-800" : "bg-sky-50 text-sky-800"}`}>{assessment.severity} RISK</span><h2 className="mt-4 font-semibold text-navy">Assessment summary</h2><p className="mt-2 text-sm leading-6 text-slate-600">{assessment.summary}</p>{assessment.likelyConditions.length > 0 && <><h3 className="mt-4 text-sm font-semibold text-navy">Possibilities to consider</h3><ul className="mt-2 space-y-1 text-sm text-slate-600">{assessment.likelyConditions.map((item) => <li key={item}>• {item}</li>)}</ul></>}{assessment.questions.length > 0 && <><h3 className="mt-4 text-sm font-semibold text-navy">Helpful next details</h3><ul className="mt-2 space-y-1 text-sm text-slate-600">{assessment.questions.map((item) => <li key={item}>• {item}</li>)}</ul></>}<p className="mt-4 border-t pt-3 text-xs leading-5 text-slate-500">{assessment.disclaimer}</p></div>; }
