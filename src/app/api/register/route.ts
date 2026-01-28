import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { z } from "zod";

const RegisterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Minimum 6 characters required"),
    optionalSubject: z.string().optional(),
    state: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedFields = RegisterSchema.safeParse(body);

        if (!validatedFields.success) {
            return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
        }

        const { email, password, name, optionalSubject, state } = validatedFields.data;

        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email already in use!" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                optionalSubject,
                state,
            },
        });

        return NextResponse.json({ success: "Account created!" });
    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
    }
}
