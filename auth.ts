import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/models/user";
import { loginSchema } from "@/lib/validations/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        await connectToDatabase();
        const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).select("+password").lean() as { _id: { toString(): string }; name: string; email: string; password: string } | null;
        if (!user || !(await bcrypt.compare(parsed.data.password, user.password))) return null;
        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) { if (user) token.id = user.id; return token; },
    session({ session, token }) { if (session.user && token.id) session.user.id = String(token.id); return session; },
  },
});
