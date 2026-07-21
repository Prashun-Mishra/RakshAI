"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, LoaderCircle, ShieldAlert } from "lucide-react";

type AuthFormProps = { mode: "login" | "register" };

export function AuthForm({ mode }: AuthFormProps) {
  const isRegistration = mode === "register";
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      if (isRegistration) {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.get("name"), email, password, phone: form.get("phone") || undefined }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Unable to create your account");
      }

      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) throw new Error("Incorrect email or password");
      router.push("/dashboard");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[.9fr_1.1fr]">
      <aside className="hidden bg-navy p-12 text-white lg:flex lg:flex-col">
        <Link href="/" className="flex items-center gap-2 font-semibold"><ShieldAlert className="text-safety" />GuardianAI</Link>
        <div className="my-auto max-w-sm"><p className="text-sm font-medium text-sky-200">Careful guidance, ready when you need it.</p><h1 className="mt-4 text-4xl font-semibold leading-tight">Emergency support that keeps you oriented.</h1><p className="mt-5 leading-7 text-slate-300">GuardianAI is designed to help you gather useful information and take safer next steps—not to replace professional emergency care.</p></div>
        <p className="text-sm text-slate-400">If someone is in immediate danger, call your local emergency number first.</p>
      </aside>
      <section className="flex items-center justify-center bg-white px-6 py-12"><div className="w-full max-w-md"><Link href="/" className="mb-10 flex items-center gap-2 font-semibold text-navy lg:hidden"><ShieldAlert className="text-safety" />GuardianAI</Link><p className="text-sm font-medium text-sky-700">{isRegistration ? "Create your account" : "Welcome back"}</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-navy">{isRegistration ? "Be prepared, without the panic." : "Sign in to GuardianAI"}</h2><p className="mt-3 text-slate-600">{isRegistration ? "Keep your emergency history and contacts in one private place." : "Access your emergency sessions and contacts."}</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          {isRegistration && <Field label="Full name" name="name" autoComplete="name" required />}
          <Field label="Email address" name="email" type="email" autoComplete="email" required />
          {isRegistration && <Field label="Phone number (optional)" name="phone" type="tel" autoComplete="tel" />}
          <Field label="Password" name="password" type="password" autoComplete={isRegistration ? "new-password" : "current-password"} minLength={8} required />
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={isSubmitting} className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <>{isRegistration ? "Create account" : "Sign in"}<ArrowRight className="h-4 w-4" /></>}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">{isRegistration ? "Already have an account?" : "New to GuardianAI?"} <Link className="font-semibold text-sky-700 hover:underline" href={isRegistration ? "/login" : "/register"}>{isRegistration ? "Sign in" : "Create an account"}</Link></p>
      </div></section>
    </main>
  );
}

function Field({ label, name, type = "text", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return <label className="block text-sm font-medium text-slate-700">{label}<input name={name} type={type} className="focus-ring mt-2 w-full rounded-xl border bg-white px-3 py-3 text-base text-ink placeholder:text-slate-400" {...props} /></label>;
}
