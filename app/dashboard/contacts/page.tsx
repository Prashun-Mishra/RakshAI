import { ContactManager } from "@/components/contact-manager";

export default function ContactsPage() { return <main className="min-w-0 flex-1 p-6 sm:p-10"><div className="mx-auto max-w-5xl"><p className="text-sm font-medium text-sky-700">Emergency contacts</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-navy">People to reach quickly.</h1><p className="mt-3 text-slate-600">Keep trusted contacts ready so you can call or share information faster during an emergency.</p><div className="mt-8"><ContactManager /></div></div></main>; }
