import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/models/user";
import { registrationSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registrationSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid registration details", fields: parsed.error.flatten().fieldErrors }, { status: 400 });

    await connectToDatabase();
    const email = parsed.data.email.toLowerCase();
    if (await User.exists({ email })) return NextResponse.json({ error: "An account already exists for this email" }, { status: 409 });

    await User.create({ ...parsed.data, email, password: await bcrypt.hash(parsed.data.password, 12) });
    return NextResponse.json({ message: "Account created" }, { status: 201 });
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json({ error: "Unable to create account. Please try again." }, { status: 500 });
  }
}
