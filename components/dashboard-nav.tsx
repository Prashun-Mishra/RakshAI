"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { History, LogOut, Plus, ShieldAlert, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardNav({ name }: { name?: string | null }) {
  const pathname = usePathname();
  return <aside className="flex w-full shrink-0 flex-col border-b bg-white p-4 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r lg:p-5"><Link href="/dashboard" className="flex items-center gap-2 px-2 font-semibold text-navy"><ShieldAlert className="text-safety" />GuardianAI</Link><nav className="mt-6 flex gap-2 lg:flex-col"><Link href="/dashboard/emergency/new" className="focus-ring inline-flex items-center gap-2 rounded-xl bg-safety px-3 py-2.5 text-sm font-semibold text-white"><Plus className="h-4 w-4" />New emergency</Link><Link href="/dashboard" className={cn("focus-ring inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100", pathname === "/dashboard" && "bg-sky-50 text-sky-900")}><History className="h-4 w-4" />Session history</Link><Link href="/dashboard/contacts" className={cn("focus-ring inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100", pathname === "/dashboard/contacts" && "bg-sky-50 text-sky-900")}><UsersRound className="h-4 w-4" />Emergency contacts</Link></nav><div className="mt-auto hidden border-t pt-4 lg:block"><p className="px-2 text-sm font-medium text-navy">{name ?? "GuardianAI user"}</p><button onClick={() => signOut({ callbackUrl: "/" })} className="focus-ring mt-3 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-500 hover:text-slate-800"><LogOut className="h-4 w-4" />Sign out</button></div></aside>;
}
